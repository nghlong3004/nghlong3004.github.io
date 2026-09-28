import { SectionFlower } from "./icons";

interface EyebrowProps {
  label: string;
  className?: string;
  iconClassName?: string;
}

export function Eyebrow({
  label,
  className = "",
  iconClassName = "",
}: EyebrowProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 text-eyebrow font-medium uppercase tracking-[0.22em] text-muted ${className}`}
    >
      <SectionFlower
        width={22}
        height={25}
        className={`shrink-0 animate-spin duration-4000 ${iconClassName}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
