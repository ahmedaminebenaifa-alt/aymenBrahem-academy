import React, { useId } from 'react';

export default function EngravedBackground({
  color = '#e2b4bd',
  opacity = 0.25,
  animated = false,
}) {
  const uid = useId();
  const filterId = `luxury-depth-${uid}`;
  const patternId = `premium-lattice-${uid}`;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        width="100%"
        height="100%"
        className={`absolute inset-0 ${animated ? 'animate-ambient-pan' : ''}`}
        style={{ opacity }}
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.95" />
            <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.8" floodColor="#ffffff" floodOpacity="0.15" />
          </filter>

          <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <g stroke={color} fill="none" filter={`url(#${filterId})`}>
              <path strokeWidth="0.8" opacity="0.4" d="M0 0 L120 120 M120 0 L0 120 M60 0 L60 120 M0 60 L120 60" />

              <path strokeWidth="1.2" opacity="0.6" d="M60 0 L120 60 L60 120 L0 60 Z" />
              <path strokeWidth="0.8" opacity="0.4" d="M30 0 L120 90 M0 30 L90 120 M90 0 L0 90 M120 30 L30 120" />
              
              <path strokeWidth="1.5" opacity="0.9" d="M60 15 L73 47 L105 60 L73 73 L60 105 L47 73 L15 60 L47 47 Z" />
              <path strokeWidth="1.2" opacity="0.7" d="M30 30 L60 42 L90 30 L78 60 L90 90 L60 78 L30 90 L42 60 Z" />

              <circle cx="60" cy="60" r="32" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
              <circle cx="60" cy="60" r="20" strokeWidth="1" opacity="0.8" />
              <circle cx="60" cy="60" r="8" strokeWidth="1.5" opacity="1" />

              <path strokeWidth="1" opacity="0.6" d="M0 25 L18 18 L25 0" />
              <circle cx="0" cy="0" r="16" strokeWidth="1" opacity="0.5" />
              
              <path strokeWidth="1" opacity="0.6" d="M120 25 L102 18 L95 0" />
              <circle cx="120" cy="0" r="16" strokeWidth="1" opacity="0.5" />
              
              <path strokeWidth="1" opacity="0.6" d="M0 95 L18 102 L25 120" />
              <circle cx="0" cy="120" r="16" strokeWidth="1" opacity="0.5" />
              
              <path strokeWidth="1" opacity="0.6" d="M120 95 L102 102 L95 120" />
              <circle cx="120" cy="120" r="16" strokeWidth="1" opacity="0.5" />

              <path strokeWidth="0.8" opacity="0.3" d="M30 0 L30 120 M90 0 L90 120 M0 30 L120 30 M0 90 L120 90" />
            </g>
          </pattern>
        </defs>
        <rect width="200%" height="200%" fill={`url(#${patternId})`} transform="translate(-50, -50)" />
      </svg>
    </div>
  );
}