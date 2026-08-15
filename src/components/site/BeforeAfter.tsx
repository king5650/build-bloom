import { useRef, useState } from "react";
import { motion } from "motion/react";

import { useI18n } from "@/i18n/i18n";

export function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  function move(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-sm bg-secondary select-none"
      onPointerMove={(e) => e.buttons !== 0 && move(e.clientX)}
      onPointerDown={(e) => move(e.clientX)}
      onMouseMove={(e) => move(e.clientX)}
    >
      <img
        src={after}
        alt={`${alt} — ${t({ fr: "après", en: "after" })}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt={`${alt} — ${t({ fr: "avant", en: "before" })}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: ref.current?.offsetWidth ?? undefined }}
        />
      </div>
      <motion.div
        className="absolute inset-y-0 w-[3px] bg-accent"
        style={{ left: `calc(${pos}% - 1.5px)` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-craft)]">
          <span className="label-mono text-[9px]">↔</span>
        </span>
      </motion.div>
      <span className="label-mono absolute bottom-3 left-3 rounded-sm bg-primary/85 px-2 py-1 text-primary-foreground">
        {t({ fr: "Avant", en: "Before" })}
      </span>
      <span className="label-mono absolute right-3 bottom-3 rounded-sm bg-accent px-2 py-1 text-accent-foreground">
        {t({ fr: "Après", en: "After" })}
      </span>
    </div>
  );
}