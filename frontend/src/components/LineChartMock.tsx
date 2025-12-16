import { useState, useRef } from 'react';
import { SensorReading } from '../data/mockData';

interface LineChartMockProps {
  data: SensorReading[];
  color?: string;
  title: string;
}

// helper: create a smooth path using Catmull-Rom to Bezier conversion
function catmullRom2bezier(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  const d = [] as string[];

  for (let i = 0; i < points.length; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1] || p1;
    const p3 = points[i + 2] || p2;

    if (i === 0) {
      d.push(`M ${p1.x} ${p1.y}`);
    }

    const bp1x = p1.x + (p2.x - p0.x) / 6;
    const bp1y = p1.y + (p2.y - p0.y) / 6;
    const bp2x = p2.x - (p3.x - p1.x) / 6;
    const bp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${bp1x} ${bp1y}, ${bp2x} ${bp2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(' ');
}

export function LineChartMock({ data, color = '#14b8a6', title }: LineChartMockProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const padding = 8;
  const width = 100;
  const height = 100;

  const pts = data.map((reading, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = padding + (1 - (reading.value - minValue) / range) * (height - 2 * padding);
    return { x, y };
  });

  const pathD = catmullRom2bezier(pts);
  const areaPath = `M ${padding} ${height - padding} L ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${width - padding} ${height - padding} Z`;

  const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

  const avg = (values.reduce((s, v) => s + v, 0) / values.length) || 0;

  function clientToViewBox(e: React.MouseEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    return { x, y };
  }

  function handleMove(e: React.MouseEvent) {
    const vb = clientToViewBox(e);
    if (!vb) return;
    setMousePos(vb);

    // find nearest point
    let nearest = 0;
    let dist = Infinity;
    pts.forEach((p, i) => {
      const dx = vb.x - p.x;
      const dy = vb.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < dist) {
        dist = d2;
        nearest = i;
      }
    });
    setHoverIdx(nearest);
  }

  function handleLeave() {
    setHoverIdx(null);
    setMousePos(null);
  }

  const ticks = 4;
  const tickLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const t = i / ticks;
    const y = padding + t * (height - 2 * padding);
    const value = (1 - t) * range + minValue;
    return { y, value };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>

      <div className="relative h-56 md:h-64 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-900/30 rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full absolute inset-0"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0.03" />
            </linearGradient>
            <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
            </filter>
          </defs>

          {tickLines.map((t, i) => (
            <g key={i}>
              <line x1={padding} x2={width - padding} y1={t.y} y2={t.y} stroke="rgba(0,0,0,0.06)" strokeWidth={0.6} />
              <text x={padding - 1} y={t.y - 1} fontSize="3.2" fill="rgba(0,0,0,0.5)" textAnchor="end">
                {t.value.toFixed(1)}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} filter="url(#softShadow)" />

          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={hoverIdx === i ? 1.6 : 0.9} fill={hoverIdx === i ? '#fff' : color} stroke={hoverIdx === i ? color : 'transparent'} strokeWidth={hoverIdx === i ? 0.8 : 0} />
          ))}
        </svg>

        <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
          Last 24h
        </div>

        {hoverIdx !== null && mousePos && (
          (() => {
            const p = pts[hoverIdx];
            const reading = data[hoverIdx];
            const left = `${(p.x / width) * 100}%`;
            return (
              <div style={{ left }} className="absolute -translate-x-1/2" aria-hidden>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-xs text-gray-700 dark:text-gray-200 shadow">
                    <div className="font-medium">{reading.value.toFixed(2)}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{new Date(reading.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ height: 8 }} />
              </div>
            );
          })()
        )}
      </div>

      <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>Min: <span className="font-medium text-gray-700 dark:text-gray-200">{minValue.toFixed(2)}</span></div>
        <div>Avg: <span className="font-medium text-gray-700 dark:text-gray-200">{avg.toFixed(2)}</span></div>
        <div>Max: <span className="font-medium text-gray-700 dark:text-gray-200">{maxValue.toFixed(2)}</span></div>
      </div>
    </div>
  );
}
