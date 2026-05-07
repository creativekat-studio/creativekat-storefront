type Props = {
  /** White / inverted version of the logo — shown on the dark card. */
  logoLight?: string;
  /** Dark version of the logo — shown on the light card. */
  logoDark?: string;
  /** Accessible alt for the white/inverted logo. */
  altLight?: string;
  /** Accessible alt for the dark logo. */
  altDark?: string;
  /** Override the section label. Defaults to "Logo". */
  label?: string;
  /** Scale multiplier for the logo image inside its card. Default 1. */
  scale?: number;
};

const BASE_MAX_HEIGHT_PX = 96; // = max-h-24

export default function LogoDisplay({
  logoLight,
  logoDark,
  altLight = "Logo on dark",
  altDark = "Logo on light",
  label = "Logo",
  scale = 1,
}: Props) {
  const maxHeight = `${Math.round(BASE_MAX_HEIGHT_PX * scale)}px`;
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Dark card — white/inverted logo */}
        <div className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-neutral-950 px-10 py-16 sm:py-20">
          {/* TODO: logo on dark — white version */}
          {logoLight ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoLight}
              alt={altLight}
              style={{ maxHeight }}
              className="block h-auto w-auto max-w-full"
            />
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Logo · white
            </span>
          )}
        </div>

        {/* Light card — dark logo */}
        <div className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[#f7f7f5] px-10 py-16 sm:py-20">
          {/* TODO: logo on light — dark version */}
          {logoDark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoDark}
              alt={altDark}
              style={{ maxHeight }}
              className="block h-auto w-auto max-w-full"
            />
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
              Logo · dark
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
