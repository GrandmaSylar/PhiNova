interface PhiLogoProps {
  size?: number;
  className?: string;
}

/* PhiNova PN monogram — geometric mark derived from the logo brief */
export function PhiLogo({ size = 32, className = "" }: PhiLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="35 14 78 68"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* Letter P and N */}
      <path
        className="fill-navy dark:fill-canvas transition-colors duration-300"
        d="M38.8,78.5h27.8v-6.3h-8.8V49.1c7.3,0,13-1.6,17.2-4.8c4.2-3.2,6.3-8.2,6.3-15.1c0-6.6-2.1-11.4-6.4-14.4c-4.3-3-9.8-4.5-16.6-4.5H38.8v6.3h8.8v55.8h-8.8V78.5z M57.6,16.8c3.9,0,6.9,0.9,9,2.8c2.1,1.9,3.1,4.9,3.1,8.9c0,4.1-1,7-3.1,8.9c-2.1,1.9-5.1,2.8-9,2.8h-1v-23.4H57.6z"
      />
      <path
        className="fill-navy dark:fill-canvas transition-colors duration-300"
        d="M87.3,78.5h23v-6.3h-6.7V23.1h6.7v-6.3h-21l-24.8,42.5V23.1h6.7v-6.3H58.4v6.3h6.7v55.8h-6.7v6.3h21.1L100,37.3v34.9h-6.7v6.3H87.3z"
      />

      {/* Accent Circle (Steel Blue) with Navy/Canvas border */}
      <circle cx="68" cy="32" r="14" className="fill-steel" />
      <circle
        cx="68"
        cy="32"
        r="14"
        className="fill-none stroke-navy dark:stroke-canvas transition-colors duration-300"
        strokeWidth="1.5"
      />

      {/* Phi Symbol (Φ) inside the circle */}
      <circle cx="68" cy="32" r="6" className="fill-none stroke-canvas" strokeWidth="2" />
      <line
        x1="68"
        y1="21"
        x2="68"
        y2="43"
        className="stroke-canvas"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
