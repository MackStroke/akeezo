/** The AKEEZO mark: a location pin holding a pulse trace. */
export function Logomark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--primary)" />
      <path
        d="M16 7.5c2.6 0 4.6 1.9 4.6 4.5 0 3.6-4.6 7.4-4.6 7.4S11.4 15.6 11.4 12c0-2.6 2-4.5 4.6-4.5Z"
        fill="var(--mint)"
      />
      <path d="M15 10.4h2v1.6h1.6v2H17v1.6h-2V14h-1.6v-2H15v-1.6Z" fill="var(--primary)" />
      <path
        d="M8 23.2h3.4l1.5-2.6 2 4.6 2.3-5.4 1.5 3.4H24"
        stroke="var(--mint)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
