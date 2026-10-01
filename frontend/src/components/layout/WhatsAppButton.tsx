import { MessageCircle } from "lucide-react";

/** Floating WhatsApp button. Number comes from /settings (first WhatsApp-enabled phone). */
export function WhatsAppButton({ phone }: { phone: string | null }) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
