interface EyebrowProps {
  label: string;
  className?: string;
}

export function Eyebrow({ label, className = "" }: EyebrowProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-[0.22em] text-muted ${className}`}
    >
      <span
        className="size-2 rounded-full bg-accent shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
