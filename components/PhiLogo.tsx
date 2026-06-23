interface PhiLogoProps {
  size?: number;
  className?: string;
}

/* PhiNova PN monogram — geometric mark derived from the logo brief */
export function PhiLogo({ size = 32, className = "" }: PhiLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[8px] bg-navy text-white font-bold select-none ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      PN
    </span>
  );
}
