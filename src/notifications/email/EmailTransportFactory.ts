import type { EmailDeliveryResult, EmailMessage } from "./EmailDeliveryResult";
import { smtpReady } from "./EmailTransportConfig";
import { SmtpTransport } from "./SmtpTransport";

export type MailTransport = {
  canSend(): boolean;
  send(message: EmailMessage): Promise<EmailDeliveryResult>;
};

export class PreparedEmailTransport implements MailTransport {
  canSend() {
    return false;
  }

  async send(_message: EmailMessage): Promise<EmailDeliveryResult> {
    void _message;
    return { status: "prepared", failureReason: "transport_disabled" };
  }
}

export class EmailTransport implements MailTransport {
  constructor(private readonly inner: MailTransport = EmailTransportFactory.create()) {}

  canSend() {
    return this.inner.canSend();
  }

  send(message: EmailMessage): Promise<EmailDeliveryResult> {
    return Promise.resolve(this.inner.send(message));
  }
}

export class EmailTransportFactory {
  static create(): MailTransport {
    if (smtpReady()) return new SmtpTransport();
    return new PreparedEmailTransport();
  }
}
