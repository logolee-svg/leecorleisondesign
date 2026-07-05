import { useState, useEffect } from 'react';

// Placeholder hero montage: 12 cards as randomly-coloured rectangles in a
// mix of 1:1 squares and 16:9 rectangles. Column count is responsive
// (5 / 4 / 3 / 2 by width). Hover pauses the drift, fades the rest, and
// lifts the hovered card — the lift is clamped so it never spills past the
// gutter or the viewport. Real imagery replaces the colours later.

const CARDS = [
  { ratio: 'square', color: '#E8543F' },
  { ratio: 'wide', color: '#3B5BDB' },
  { ratio: 'square', color: '#F2C94C' },
  { ratio: 'wide', color: '#27AE60' },
  { ratio: 'square', color: '#9B51E0' },
  { ratio: 'wide', color: '#2D9CDB' },
  { ratio: 'square', color: '#EB5757' },
  { ratio: 'wide', color: '#F2994A' },
  { ratio: 'square', color: '#56CCF2' },
  { ratio: 'wide', color: '#BB6BD9' },
  { ratio: 'square', color: '#6FCF97' },
  { ratio: 'wide', color: '#F15BB5' },
];

const OFFSETS = [0, 64, 26, 80, 40];
const HOVER_SCALE = 1.4;

function colsForWidth(w) {
  if (w >= 1600) return 5;
  if (w >= 1280) return 4;
  if (w >= 960) return 3;
  return 2;
}

// pick a transform-origin offset (px) so the scaled card stays within
// [boundMin, boundMax] on this axis; prefer centre, fall back to pinning the
// near edge if the scaled card can't fit between the bounds.
function clampAxis(start, size, boundMin, boundMax) {
  const s = HOVER_SCALE;
  const maxO = (start - boundMin) / (s - 1); // near edge ≥ boundMin
  const minO = (start + s * size - boundMax) / (s - 1); // far edge ≤ boundMax
  const lo = Math.max(0, minO);
  const hi = Math.min(size, maxO);
  const center = size / 2;
  if (lo <= hi) return Math.max(lo, Math.min(hi, center));
  return Math.max(0, Math.min(size, maxO)); // too big to fit — keep near edge in
}

export default function Montage({ className = '' }) {
  const [cols, setCols] = useState(() =>
    colsForWidth(typeof window !== 'undefined' ? window.innerWidth : 1440)
  );

  useEffect(() => {
    let raf;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCols(colsForWidth(window.innerWidth)));
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onEnter = (e) => {
    const card = e.currentTarget;
    const fill = card.firstElementChild;
    const montage = card.closest('.montage--curated');
    if (!fill || !montage) return;
    const F = card.getBoundingClientRect();
    // horizontal bounds = the actual extent of the card containers
    let boundLeft = Infinity, boundRight = -Infinity;
    montage.querySelectorAll('.mcard').forEach((c) => {
      const r = c.getBoundingClientRect();
      if (r.left < boundLeft) boundLeft = r.left;
      if (r.right > boundRight) boundRight = r.right;
    });
    // vertical bounds = viewport, clearing the nav at top
    const boundTop = 48;
    const boundBottom = window.innerHeight - 24;
    const ox = clampAxis(F.left, F.width, boundLeft, boundRight);
    const oy = clampAxis(F.top, F.height, boundTop, boundBottom);
    fill.style.transformOrigin = `${ox}px ${oy}px`;
  };

  const columns = Array.from({ length: cols }, (_, c) =>
    CARDS.filter((_, i) => i % cols === c)
  );

  return (
    <div className={`montage montage--curated ${className}`} aria-hidden="true">
      {columns.map((cards, ci) => (
        <div className="mcol" key={ci} style={{ marginTop: `${OFFSETS[ci % OFFSETS.length]}px` }}>
          {cards.map((card, j) => (
            <div className={`mcard mcard--${card.ratio}`} key={`${ci}-${j}`} onMouseEnter={onEnter}>
              <div className="mcard__fill" style={{ background: card.color }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
