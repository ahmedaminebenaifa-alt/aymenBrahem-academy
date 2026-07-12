import React, { useId } from 'react';

/**
 * Reusable Alhambra-style engraved نقوش background layer.
 * Drop it as the first child of any `relative` container — it fills via absolute inset-0.
 *
 * @param {string} color - stroke color (hex or CSS var), defaults to gold for dark surfaces
 * @param {number} opacity - overall layer opacity, defaults tuned for dark surfaces (0.15)
 * @param {boolean} animated - whether the ambient pan animation runs
 */
export default function EngravedBackground({
  color = '#d4af37',
  opacity = 0.15,
  animated = true,
}) {
  // useId ensures unique SVG def IDs even if this component renders multiple times on one page —
  // duplicate <pattern>/<filter> ids across instances would silently break rendering.
  const uid = useId();
  const filterId = `carved-depth-${uid}`;
  const patternId = `alhambra-engraving-${uid}`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        width="100%"
        height="100%"
        className={`absolute inset-0 ${animated ? 'animate-ambient-pan' : ''}`}
        style={{ opacity }}
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#00140d" floodOpacity="0.8" />
            <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.5" floodColor="#ffffff" floodOpacity="0.1" />
          </filter>

          <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <g stroke={color} fill="none" filter={`url(#${filterId})`}>
              <path strokeWidth="1" d="M60 0 L75 25 L100 25 L85 45 L95 70 L60 55 L25 70 L35 45 L20 25 L45 25 Z" opacity="0.6" />
              <path strokeWidth="1.5" d="M60 120 L75 95 L100 95 L85 75 L95 50 L60 65 L25 50 L35 75 L20 95 L45 95 Z" opacity="0.6" />
              <path strokeWidth="0.5" d="M0 60 L25 75 L25 100 L45 85 L70 95 L55 60 L70 25 L45 35 L25 20 L25 45 Z" opacity="0.4" />
              <path strokeWidth="0.5" d="M120 60 L95 75 L95 100 L75 85 L50 95 L65 60 L50 25 L75 35 L95 20 L95 45 Z" opacity="0.4" />
              <circle cx="60" cy="60" r="22" strokeWidth="0.75" opacity="0.5" />
              <circle cx="60" cy="60" r="14" strokeWidth="1" />
              <path strokeWidth="0.5" d="M46 46 L74 74 M46 74 L74 46 M60 38 L60 82 M38 60 L82 60" opacity="0.4" />
              <path strokeWidth="0.5" d="M30 0 L0 30 L0 90 L30 120 L90 120 L120 90 L120 30 L90 0 Z" opacity="0.3" strokeDasharray="4 2" />
            </g>
          </pattern>
        </defs>
        <rect width="200%" height="200%" fill={`url(#${patternId})`} transform="translate(-50, -50)" />
      </svg>
    </div>
  );
}