import { useState } from "react";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { cn } from "@/lib/utils";

export function MailApp() {
  const lang = useOs((s) => s.lang);
  const copy = t(lang);
  const mails = useOs((s) => s.mails);
  const mailId = useOs((s) => s.mailId);
  const setMailId = useOs((s) => s.setMailId);
  const markMailRead = useOs((s) => s.markMailRead);
  const sendMail = useOs((s) => s.sendMail);
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const current = mails.find((m) => m.id === mailId);

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[min(280px,42%)] shrink-0 flex-col border-r border-line">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-xs font-medium tracking-wide text-mist uppercase">{copy.mail.inbox}</p>
          <button
            type="button"
            onClick={() => setCompose(true)}
            className="rounded-lg bg-luna px-2.5 py-1 text-[11px] font-medium text-luna-ink"
          >
            {copy.mail.compose}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {mails.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMailId(m.id);
                markMailRead(m.id);
                setCompose(false);
              }}
              className={cn(
                "block w-full border-t border-line px-3 py-2.5 text-left",
                mailId === m.id ? "bg-ink-3" : "hover:bg-ink-3/60",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("truncate text-sm", m.unread && "font-semibold")}>{m.from}</span>
                <span className="shrink-0 font-mono text-[10px] text-ash">{m.time}</span>
              </div>
              <p className="truncate text-[13px]">{m.subject}</p>
              <p className="truncate text-xs text-mist">{m.preview}</p>
            </button>
          ))}
        </div>
      </aside>
      <section className="min-w-0 flex-1 overflow-auto p-5">
        {compose ? (
          <form
            className="flex h-full flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendMail(to, subject, body);
              setCompose(false);
              setTo("");
              setSubject("");
              setBody("");
            }}
          >
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={copy.mail.to}
              className="h-10 rounded-lg bg-ink-3 px-3 text-sm outline-none"
            />
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={copy.mail.subject}
              className="h-10 rounded-lg bg-ink-3 px-3 text-sm outline-none"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-40 flex-1 resize-none rounded-lg bg-ink-3 p-3 text-sm outline-none"
            />
            <button type="submit" className="h-10 self-start rounded-lg bg-luna px-4 text-sm font-medium text-luna-ink">
              {copy.mail.send}
            </button>
          </form>
        ) : current ? (
          <article>
            <p className="text-[11px] tracking-wide text-mist uppercase">{current.tag}</p>
            <h2 className="mt-1 font-display text-2xl tracking-[-0.03em]">{current.subject}</h2>
            <p className="mt-2 text-sm text-mist">
              {current.from} · {current.fromEmail} · {current.time}
            </p>
            <pre className="mt-6 font-sans text-sm leading-relaxed whitespace-pre-wrap">{current.body}</pre>
          </article>
        ) : (
          <p className="text-sm text-mist">{copy.mail.empty}</p>
        )}
      </section>
    </div>
  );
}
