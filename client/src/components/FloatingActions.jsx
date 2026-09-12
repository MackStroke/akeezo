import { Phone } from 'lucide-react';
import { site, whatsappHref, telHref, formatPhone } from '@/lib/site';

function WhatsAppIcon({ className = 'size-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.842L.055 23.361l5.688-1.491A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.83 0-3.551-.482-5.05-1.325l-.362-.202-3.37.884.899-3.284-.236-.375A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

/**
 * WhatsApp and phone, always reachable.
 * - WhatsApp pill carrying the real WhatsApp icon & "Need Help?" text tag.
 * - Phone call button styled with AKEEZO theme palette.
 */
export function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5">
      {/* WhatsApp Button with "Need Help?" text tag */}
      <a
        href={whatsappHref('Hello AKEEZO, I need help with a healthcare requirement.')}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2 text-white shadow-widget transition-all hover:bg-[#20bd5a] hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#25D366]"
        aria-label="Chat with AKEEZO on WhatsApp (Need Help?)"
      >
        <WhatsAppIcon className="size-5 shrink-0 text-white" />
        <span className="text-xs font-bold tracking-wide">Need Help?</span>
      </a>

      {/* Phone Call Button styled with AKEEZO theme design */}
      <a
        href={telHref(site.emergencyPhone)}
        className="group flex size-12 items-center justify-center rounded-full bg-navy text-navy-foreground border border-white/20 shadow-widget transition-all hover:bg-primary hover:text-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary"
        aria-label={`Call AKEEZO on ${formatPhone(site.emergencyPhone)}`}
        title={`Call AKEEZO: ${formatPhone(site.emergencyPhone)}`}
      >
        <Phone className="size-5 stroke-[2.2]" aria-hidden="true" />
        <span className="visually-hidden">Call AKEEZO on {formatPhone(site.emergencyPhone)}</span>
      </a>
    </div>
  );
}
