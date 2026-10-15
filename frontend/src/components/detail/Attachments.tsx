import { Download, FileText } from "lucide-react";

/** Download list for files attached to a CMS item; each opens in a new tab. */
export function Attachments({ title, files }: { title: string; files: { name: string; url: string }[] }) {
  if (files.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-fg">{title}</h2>
      <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
        {files.map((f) => (
          <li key={f.url}>
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-accent/15 text-accent">
                <FileText className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">{f.name}</span>
              <Download className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
