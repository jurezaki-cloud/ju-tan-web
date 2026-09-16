import net from "net";
import tls from "tls";
import type { EmailDeliveryResult, EmailMessage } from "./EmailDeliveryResult";
import { loadEmailTransportConfig, smtpReady, type EmailTransportConfig } from "./EmailTransportConfig";
import { emailDeliveryErrorMapper } from "./EmailDeliveryErrorMapper";

function encodeSubject(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function stuff(body: string) {
  return body.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

export class SmtpTransport {
  constructor(private readonly config: EmailTransportConfig = loadEmailTransportConfig()) {}

  canSend() {
    return smtpReady(this.config);
  }

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    if (!this.canSend()) return { status: "prepared", failureReason: "transport_disabled" };
    if (!message.to.includes("@")) return { status: "failed", failureReason: "invalid_payload" };
    let last: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await this.deliver(message);
        return { status: "sent" };
      } catch (error) {
        last = error;
        const reason = emailDeliveryErrorMapper.mapFailure(error);
        if (!emailDeliveryErrorMapper.retryable(reason)) return { status: "failed", failureReason: reason };
      }
    }
    return { status: "failed", failureReason: emailDeliveryErrorMapper.mapFailure(last) };
  }

  private async deliver(message: EmailMessage) {
    const conn = await this.connect();
    try {
      await this.expect(conn, 220);
      await this.command(conn, `EHLO ju-tan`);
      await this.expect(conn, 250);
      if (!this.config.secure) {
        await this.command(conn, "STARTTLS");
        await this.expect(conn, 220);
        conn.socket = tls.connect({ socket: conn.socket, host: this.config.host, servername: this.config.host });
        await this.ready(conn.socket);
        conn.buffer = "";
        await this.command(conn, `EHLO ju-tan`);
        await this.expect(conn, 250);
      }
      if (this.config.username) {
        await this.command(conn, "AUTH LOGIN");
        await this.expect(conn, 334);
        await this.command(conn, Buffer.from(this.config.username, "utf8").toString("base64"));
        await this.expect(conn, 334);
        await this.command(conn, Buffer.from(this.config.password, "utf8").toString("base64"));
        await this.expect(conn, 235);
      }
      const from = message.from ?? this.config.from;
      const fromAddr = from.replace(/^.*<|>.*$/g, (chunk) => (chunk === "<" || chunk === ">" ? "" : chunk));
      const mailFrom = from.includes("<") ? from.slice(from.indexOf("<") + 1, from.indexOf(">")) : fromAddr;
      await this.command(conn, `MAIL FROM:<${mailFrom}>`);
      await this.expect(conn, 250);
      await this.command(conn, `RCPT TO:<${message.to}>`);
      await this.expect(conn, 250);
      await this.command(conn, "DATA");
      await this.expect(conn, 354);
      const boundary = `ju-tan-${Date.now()}`;
      const reply = message.replyTo ?? this.config.replyTo;
      const headers = [
        `From: ${from}`,
        `To: ${message.to}`,
        reply ? `Reply-To: ${reply}` : "",
        `Subject: ${encodeSubject(message.subject)}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ]
        .filter(Boolean)
        .join("\r\n");
      const payload = [
        headers,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        stuff(message.text),
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        stuff(message.html),
        `--${boundary}--`,
        ".",
      ].join("\r\n");
      conn.socket.write(`${payload}\r\n`);
      await this.expect(conn, 250);
      await this.command(conn, "QUIT");
    } finally {
      conn.socket.destroy();
    }
  }

  private connect(): Promise<{ socket: net.Socket; buffer: string }> {
    return new Promise((resolve, reject) => {
      const conn = { socket: undefined as unknown as net.Socket, buffer: "" };
      const socket = this.config.secure
        ? tls.connect({ host: this.config.host, port: this.config.port, servername: this.config.host })
        : net.connect({ host: this.config.host, port: this.config.port });
      conn.socket = socket;
      socket.setTimeout(this.config.connectionTimeoutMs);
      socket.once("timeout", () => reject(new Error("SMTP timeout")));
      socket.once("error", reject);
      socket.on("data", (chunk: Buffer) => {
        conn.buffer += chunk.toString("utf8");
      });
      socket.once("connect", () => resolve(conn));
      if (this.config.secure) {
        socket.once("secureConnect", () => resolve(conn));
      }
    });
  }

  private ready(socket: net.Socket) {
    return new Promise<void>((resolve, reject) => {
      socket.setTimeout(this.config.connectionTimeoutMs);
      socket.once("timeout", () => reject(new Error("SMTP timeout")));
      socket.once("error", reject);
      socket.once("secureConnect", () => resolve());
      if (!("authorized" in socket)) resolve();
    });
  }

  private command(conn: { socket: net.Socket }, line: string) {
    conn.socket.write(`${line}\r\n`);
    return Promise.resolve();
  }

  private expect(conn: { socket: net.Socket; buffer: string }, code: number) {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("SMTP timeout")), this.config.sendTimeoutMs);
      const onData = (chunk: Buffer) => {
        conn.buffer += chunk.toString("utf8");
        const lines = conn.buffer.split(/\r?\n/);
        if (!conn.buffer.endsWith("\n")) {
          conn.buffer = lines.pop() ?? "";
        } else {
          conn.buffer = "";
        }
        for (const line of lines) {
          if (!line) continue;
          const match = /^(\d{3})([\s-])/.exec(line);
          if (!match) continue;
          if (match[2] === "-") continue;
          conn.socket.off("data", onData);
          clearTimeout(timer);
          if (Number(match[1]) === code || (code === 250 && Number(match[1]) >= 200 && Number(match[1]) < 400)) {
            resolve();
            return;
          }
          reject(new Error(`SMTP ${match[1]}`));
          return;
        }
      };
      conn.socket.on("data", onData);
    });
  }
}
