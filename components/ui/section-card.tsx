import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={[
        "rounded-[24px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="font-heading text-lg text-slate-950 sm:text-xl">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
