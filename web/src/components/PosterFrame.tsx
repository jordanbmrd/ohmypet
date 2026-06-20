import { cn } from "@/lib/utils";

/**
 * A gallery-matted poster. When `image` is provided it shows the real
 * generated artwork; otherwise it falls back to a tinted CSS stand-in.
 * Either way it floats inside a thin white mat with a soft edition caption.
 */
export function PosterFrame({
  accent,
  label,
  caption,
  image,
  className,
  ratio = "aspect-[4/5]",
}: {
  accent: string;
  label: string;
  caption?: string;
  image?: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface p-3 shadow-[0_30px_60px_-30px_rgba(20,17,13,0.35)] ring-1 ring-hairline",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[8px]",
          ratio,
        )}
        style={
          image
            ? undefined
            : { background: `linear-gradient(150deg, ${accent}, color-mix(in oklab, ${accent} 55%, #14110d))` }
        }
      >
        {image ? (
          <img
            src={image}
            alt={label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            {/* portrait vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 30%, rgba(255,255,255,0.34), transparent 55%)",
              }}
            />
            {/* paper grain */}
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            {/* abstract pet silhouette */}
            <svg
              viewBox="0 0 24 24"
              className="absolute left-1/2 top-[42%] w-1/3 -translate-x-1/2 -translate-y-1/2 fill-white/85"
            >
              <circle cx="6" cy="9" r="2.1" />
              <circle cx="10.5" cy="5.5" r="2.1" />
              <circle cx="15.5" cy="5.5" r="2.1" />
              <circle cx="19" cy="9.5" r="2.1" />
              <path d="M12.5 12c-2.6 0-4.7 1.7-5.6 3.7-.6 1.4-1.6 2.2-2.1 3.2-.7 1.5.3 3.1 2 3.1 1 0 1.9-.4 2.9-.6.9-.2 1.8-.2 2.8 0 1 .2 1.9.6 2.9.6 1.7 0 2.7-1.6 2-3.1-.5-1-1.5-1.8-2.1-3.2C17.2 13.7 15.1 12 12.5 12Z" />
            </svg>
          </>
        )}

        {/* legibility scrim so the edition label reads on any artwork */}
        {image && (
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="display text-2xl text-white">{label}</div>
        </div>
      </div>
      {caption && (
        <div className="flex items-center justify-between px-1 pb-1 pt-3">
          <span className="text-xs text-ink-soft">{caption}</span>
          <span className="text-xs text-ink-faint">N° 01 / 100</span>
        </div>
      )}
    </div>
  );
}
