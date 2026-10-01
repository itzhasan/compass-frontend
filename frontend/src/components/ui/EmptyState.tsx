import { Inbox } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border py-16 text-center text-muted">
      <Inbox className="mb-3 h-10 w-10 opacity-50" aria-hidden />
      <p>{message}</p>
    </div>
  );
}
