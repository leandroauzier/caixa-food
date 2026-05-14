import Link from "next/link";

export function BackLink({ href, label = "Voltar" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/60 hover:text-slate-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      {label}
    </Link>
  );
}
