import React, { useState } from 'react';
import { CountryId } from '../types/trade';
import { COUNTRIES } from '../data/countriesData';
import { soundManager } from '../utils/audio';

interface WorldTradeMapProps {
  selectedCountryId: CountryId;
  activePartnerId?: CountryId;
  onSelectCountry?: (id: CountryId) => void;
  onSelectPartner?: (id: CountryId) => void;
  showAllRoutes?: boolean;
}

// Normalized map coordinates for 1000 x 560 SVG
const MAP_COORDINATES: Record<CountryId, { x: number; y: number; label: string; code: string }> = {
  saudi_arabia: { x: 380, y: 260, label: 'Saudi Arabia', code: 'SA' },
  indonesia: { x: 670, y: 360, label: 'Indonesia', code: 'ID' },
  south_korea: { x: 740, y: 210, label: 'South Korea', code: 'KR' },
  japan: { x: 800, y: 195, label: 'Japan', code: 'JP' },
  australia: { x: 790, y: 440, label: 'Australia', code: 'AU' },
};

export const WorldTradeMap: React.FC<WorldTradeMapProps> = ({
  selectedCountryId,
  activePartnerId,
  onSelectPartner,
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<CountryId | null>(null);

  const homeCoord = MAP_COORDINATES[selectedCountryId];
  const partnerIds = (Object.keys(MAP_COORDINATES) as CountryId[]).filter(
    (id) => id !== selectedCountryId
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-indigo-950 border border-sky-800/60 shadow-xl select-none">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/30">
          <span className="text-sm font-semibold text-sky-200">
            Home Port: {COUNTRIES[selectedCountryId].flag} {COUNTRIES[selectedCountryId].name}
          </span>
          <span className="text-xs text-sky-400">· Maritime Trade Routes</span>
        </div>
        <div className="text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/30">
          Tap any country on the map to negotiate or trade!
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 1000 560"
        className="w-full h-auto block"
        style={{ minHeight: '340px' }}
      >
        <defs>
          {/* Radial ocean gradient */}
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0c2d48" />
            <stop offset="70%" stopColor="#071a2c" />
            <stop offset="100%" stopColor="#040e18" />
          </radialGradient>

          {/* Glowing filter for routes */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Route gradients */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="1000" height="560" fill="url(#oceanGrad)" />

        {/* Subtle Latitude/Longitude Grid Lines */}
        <g stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="4 6">
          <line x1="50" y1="140" x2="950" y2="140" />
          <line x1="50" y1="280" x2="950" y2="280" />
          <line x1="50" y1="420" x2="950" y2="420" />
          <line x1="250" y1="50" x2="250" y2="510" />
          <line x1="500" y1="50" x2="500" y2="510" />
          <line x1="750" y1="50" x2="750" y2="510" />
        </g>

        {/* Stylized Continents / Landmass outlines (Asia, Australia, Middle East, Africa, Pacific) */}
        <g fill="#1e293b" stroke="#334155" strokeWidth="1.5" opacity="0.85">
          {/* Eurasia / Middle East landmass hint */}
          <path d="M 220 80 Q 280 60 360 70 Q 450 70 520 90 Q 620 100 700 130 Q 760 150 770 190 Q 750 240 700 240 Q 640 230 600 260 Q 560 280 500 270 Q 420 280 370 230 Q 320 240 310 200 Q 250 180 220 140 Z" />

          {/* Arabian Peninsula */}
          <path d="M 330 220 Q 390 210 430 250 Q 420 320 370 330 Q 330 300 330 220 Z" fill="#2d3748" />

          {/* Indian Subcontinent */}
          <path d="M 480 230 Q 540 240 560 290 Q 540 350 510 370 Q 480 320 480 230 Z" />

          {/* Southeast Asian Mainland */}
          <path d="M 590 230 Q 650 250 670 310 Q 640 330 610 320 Q 590 270 590 230 Z" />

          {/* Indonesian Archipelago islands */}
          <ellipse cx="610" cy="355" rx="35" ry="8" transform="rotate(-15 610 355)" fill="#334155" /> {/* Sumatra */}
          <ellipse cx="665" cy="375" rx="32" ry="7" fill="#334155" /> {/* Java */}
          <path d="M 660 320 Q 685 305 700 330 Q 690 355 665 350 Z" fill="#334155" /> {/* Borneo */}
          <path d="M 720 330 Q 740 325 735 355 Q 715 360 720 330 Z" fill="#334155" /> {/* Sulawesi */}
          <ellipse cx="780" cy="365" rx="42" ry="12" fill="#334155" /> {/* Papua */}

          {/* Japan archipelago */}
          <path d="M 780 220 Q 805 190 820 160 Q 830 180 815 210 Q 795 235 780 220 Z" fill="#334155" />
          <ellipse cx="830" cy="140" rx="20" ry="14" transform="rotate(-15 830 140)" fill="#334155" /> {/* Hokkaido */}

          {/* Korean Peninsula */}
          <path d="M 735 185 Q 755 195 745 230 Q 730 235 730 200 Z" fill="#334155" />

          {/* Australia Continent */}
          <path d="M 710 400 Q 770 380 830 395 Q 875 425 870 475 Q 820 515 750 510 Q 695 480 700 435 Z" fill="#2d3748" />
          <ellipse cx="800" cy="530" rx="14" ry="9" fill="#334155" /> {/* Tasmania */}

          {/* Africa outline hint on west */}
          <path d="M 180 180 Q 250 190 280 250 Q 280 340 240 430 Q 180 470 140 400 Q 120 300 140 210 Z" opacity="0.6" />
        </g>

        {/* Trade Routes (Maritime Curves from Home Port to each other Country) */}
        {partnerIds.map((pid, idx) => {
          const targetCoord = MAP_COORDINATES[pid];
          const isSelectedPartner = activePartnerId === pid;
          const isHovered = hoveredCountry === pid;

          // Compute quadratic bezier curve control point
          const midX = (homeCoord.x + targetCoord.x) / 2;
          const midY = (homeCoord.y + targetCoord.y) / 2;
          // Offset control point to create an oceanic curved arc
          const dx = targetCoord.x - homeCoord.x;
          const dy = targetCoord.y - homeCoord.y;
          const curveOffset = idx % 2 === 0 ? -45 : 45;
          const ctrlX = midX - (dy / 300) * curveOffset;
          const ctrlY = midY + (dx / 300) * curveOffset;

          const pathD = `M ${homeCoord.x} ${homeCoord.y} Q ${ctrlX} ${ctrlY} ${targetCoord.x} ${targetCoord.y}`;

          return (
            <g key={pid}>
              {/* Route Path Background Glow */}
              <path
                d={pathD}
                fill="none"
                stroke={isSelectedPartner ? '#38bdf8' : isHovered ? '#34d399' : '#0284c7'}
                strokeWidth={isSelectedPartner ? 3.5 : isHovered ? 2.5 : 1.8}
                strokeDasharray="6 8"
                opacity={isSelectedPartner ? 0.95 : isHovered ? 0.8 : 0.45}
                filter="url(#routeGlow)"
              />

              {/* Animated Cargo Vessel traveling along the route */}
              <circle r={isSelectedPartner ? 4.5 : 3.5} fill={isSelectedPartner ? '#38bdf8' : '#34d399'}>
                <animateMotion
                  path={pathD}
                  dur={`${7 + idx * 2}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
            </g>
          );
        })}

        {/* Country Markers & Clickable Interactive Targets */}
        {(Object.keys(MAP_COORDINATES) as CountryId[]).map((cid) => {
          const coord = MAP_COORDINATES[cid];
          const country = COUNTRIES[cid];
          const isHome = cid === selectedCountryId;
          const isPartner = cid === activePartnerId;
          const isHover = hoveredCountry === cid;

          return (
            <g
              key={cid}
              className="cursor-pointer transition-transform duration-200"
              transform={`translate(${coord.x}, ${coord.y})`}
              onClick={() => {
                soundManager.playShipHorn();
                if (!isHome && onSelectPartner) {
                  onSelectPartner(cid);
                }
              }}
              onMouseEnter={() => setHoveredCountry(cid)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {/* Ripple ping for Home or Active partner */}
              {(isHome || isPartner) && (
                <circle
                  r="24"
                  fill="none"
                  stroke={isHome ? '#34d399' : '#38bdf8'}
                  strokeWidth="2"
                  opacity="0.4"
                  className="animate-ping"
                />
              )}

              {/* Outer halo */}
              <circle
                r={isHome ? 20 : isPartner || isHover ? 18 : 15}
                fill={
                  isHome
                    ? 'rgba(16, 185, 129, 0.25)'
                    : isPartner
                    ? 'rgba(14, 165, 233, 0.35)'
                    : isHover
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(15, 23, 42, 0.7)'
                }
                stroke={
                  isHome
                    ? '#10b981'
                    : isPartner
                    ? '#38bdf8'
                    : isHover
                    ? '#f59e0b'
                    : '#64748b'
                }
                strokeWidth={isHome || isPartner ? 2.5 : 1.5}
              />

              {/* Inner core */}
              <circle
                r={isHome ? 12 : 10}
                fill={isHome ? '#059669' : isPartner ? '#0284c7' : '#334155'}
              />

              {/* Flag Emoji */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isHome ? 14 : 12}
                y={-0.5}
              >
                {country.flag}
              </text>

              {/* Country Badge Label */}
              <g transform="translate(0, 26)">
                <rect
                  x="-55"
                  y="-10"
                  width="110"
                  height="20"
                  rx="6"
                  fill={isHome ? '#064e3b' : isPartner ? '#0c4a6e' : '#0f172a'}
                  stroke={isHome ? '#34d399' : isPartner ? '#38bdf8' : '#334155'}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fontWeight="600"
                  fill={isHome ? '#a7f3d0' : isPartner ? '#bae6fd' : '#e2e8f0'}
                >
                  {isHome ? `★ ${country.name}` : country.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-sky-900/50 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Your Home Country</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
            <span>Selected Partner</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-sky-400 inline-block"></span>
            <span>Ocean Cargo Routes</span>
          </div>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Trade Zone: Indo-Pacific Maritime Network
        </div>
      </div>
    </div>
  );
};
