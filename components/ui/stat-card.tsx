type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-slate-50 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 font-heading text-3xl">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{hint}</p>
    </article>
  );
}

