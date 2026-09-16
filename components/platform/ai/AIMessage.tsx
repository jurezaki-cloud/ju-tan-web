"use client";

import { useMemo, type ReactNode } from "react";
import { Copy, MoreHorizontal } from "lucide-react";
import {
  cardBodyClass,
  headingCard,
  iconButtonClass,
  insetSurface,
  metaClass,
  noteSurface,
} from "@/design";
import { cn } from "@/lib/utils";
import type { AiMessage } from "@/src/ai/types";
import AIStatus from "./AIStatus";
import ArtifactCard from "./ArtifactCard";

function MarkdownText({ text }: { text: string }) {
  const nodes = useMemo(() => {
    return text.split("\n").map((line, lineIndex) => {
      const chunks = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
      return (
        <span key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {chunks.map((chunk, index) => {
            if (chunk.startsWith("**") && chunk.endsWith("**")) {
              return <strong key={index}>{chunk.slice(2, -2)}</strong>;
            }
            if (chunk.startsWith("`") && chunk.endsWith("`")) {
              return (
                <code
                  key={index}
                  className="rounded-lg border border-white/10 px-1.5 py-0.5 text-[13px]"
                >
                  {chunk.slice(1, -1)}
                </code>
              );
            }
            return <span key={index}>{chunk}</span>;
          })}
        </span>
      );
    });
  }, [text]);

  return <p className={cardBodyClass}>{nodes}</p>;
}

function copyText(value: string) {
  void navigator.clipboard.writeText(value);
}

export default function AIMessage({ message }: { message: AiMessage }) {
  const isUser = message.role === "user";
  const copyPayload =
    message.code?.content ??
    message.artifact?.title ??
    message.body;

  let content: ReactNode = <p className={cardBodyClass}>{message.body}</p>;
  if (message.kind === "markdown") content = <MarkdownText text={message.body} />;
  if (message.kind === "warning") {
    content = <p className={noteSurface}>{message.body}</p>;
  }
  if (message.kind === "success") {
    content = (
      <p className="rounded-xl border border-[#16a34a]/20 bg-[#16a34a]/8 px-4 py-3 text-[14px] leading-[1.7] text-slate-300 light:text-slate-700">
        {message.body}
      </p>
    );
  }
  if (message.kind === "code" && message.code) {
    content = (
      <div>
        <p className={`mb-2 ${cardBodyClass}`}>{message.body}</p>
        <pre className={`${insetSurface} overflow-x-auto text-[13px] leading-[1.6]`}>
          <code>{message.code.content}</code>
        </pre>
      </div>
    );
  }
  if (message.kind === "table" && message.table) {
    content = (
      <div>
        <p className={`mb-3 ${cardBodyClass}`}>{message.body}</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/10 light:border-slate-200">
                {message.table.headers.map((header) => (
                  <th key={header} className="px-3 py-2 text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {message.table.rows.map((row) => (
                <tr key={row.join("-")} className="border-b border-white/10 last:border-0 light:border-slate-200">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2 text-slate-300 light:text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (message.kind === "artifact" && message.artifact) {
    content = (
      <div className="space-y-3">
        <p className={cardBodyClass}>{message.body}</p>
        <ArtifactCard artifact={message.artifact} />
      </div>
    );
  }

  return (
    <article className="flex gap-3">
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[11px] font-semibold text-[#16a34a] light:border-slate-200"
        aria-hidden
      >
        {isUser ? "VI" : "AI"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={headingCard}>
            {isUser ? "Operater" : "JU-TAN AI"}
          </p>
          <span className={metaClass}>{message.time}</span>
          <AIStatus status={message.status} />
        </div>
        <div className="mt-2">{content}</div>
        <div className="mt-2 flex gap-1">
          <button
            type="button"
            className={cn(iconButtonClass, "h-9 w-9 text-slate-400")}
            aria-label="Kopiraj"
            onClick={() => copyText(copyPayload)}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            className={cn(iconButtonClass, "h-9 w-9 text-slate-400")}
            aria-label="Več dejanj"
            disabled
          >
            <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
