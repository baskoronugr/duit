import { useState, useRef, type ReactNode } from 'react'

/** Horizontal swipeable/scroll-snap carousel with dot indicators. Each child is one full-width slide. */
export function Carousel({ children }: { children: ReactNode[] }) {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  function onScroll() {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== active) setActive(idx)
  }

  function goTo(i: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full shrink-0 snap-center px-0.5">
            {child}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 18 : 6,
              background: i === active ? 'var(--accent-link)' : 'var(--track)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
