import type {ReactNode} from 'react';

interface CoordinateSystemProps {
  sourceWidth?: number;
  sourceHeight?: number;
  printArea?: {x: number; y: number; width: number; height: number};
  artwork?: {x: number; y: number; width: number; height: number};
}

export default function CoordinateSystem({
  sourceWidth = 200,
  sourceHeight = 252,
  printArea = {x: 50, y: 73, width: 80, height: 88},
  artwork = {x: 55, y: 80, width: 60, height: 60},
}: CoordinateSystemProps): ReactNode {

  const scale = 2;
  const svgW = sourceWidth * scale + 40;
  const svgH = sourceHeight * scale + 40;
  const ox = 20;
  const oy = 20;

  const s = (v: number) => v * scale;

  return (
    <div style={{margin: '2rem 0', overflowX: 'auto'}}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width={svgW}
        height={svgH}
        style={{maxWidth: '100%', height: 'auto'}}
      >
        {/* Source image outline */}
        <rect
          x={ox} y={oy}
          width={s(sourceWidth)} height={s(sourceHeight)}
          fill="none"
          stroke="var(--ifm-color-emphasis-400)"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          rx={4}
        />
        <text x={ox + 4} y={oy + 12} fontSize={10} fill="var(--ifm-color-emphasis-500)" fontFamily="monospace">
          (0,0)
        </text>
        <text
          x={ox + s(sourceWidth) - 4} y={oy + s(sourceHeight) - 4}
          fontSize={10} fill="var(--ifm-color-emphasis-500)" fontFamily="monospace" textAnchor="end"
        >
          ({sourceWidth},{sourceHeight})
        </text>
        <text
          x={ox + s(sourceWidth) / 2} y={oy - 6}
          fontSize={10} fill="var(--ifm-color-emphasis-500)" fontFamily="monospace" textAnchor="middle"
        >
          sourceImage ({sourceWidth}x{sourceHeight})
        </text>

        {/* Print area */}
        <rect
          x={ox + s(printArea.x)} y={oy + s(printArea.y)}
          width={s(printArea.width)} height={s(printArea.height)}
          fill="rgba(16, 185, 129, 0.08)"
          stroke="#10b981"
          strokeWidth={1.5}
          rx={3}
        />
        <text
          x={ox + s(printArea.x) + s(printArea.width) / 2}
          y={oy + s(printArea.y) - 6}
          fontSize={9} fill="#10b981" fontFamily="monospace" textAnchor="middle" fontWeight={600}
        >
          printArea ({printArea.width}x{printArea.height})
        </text>
        {/* Print area coordinates */}
        <text
          x={ox + s(printArea.x) + 3} y={oy + s(printArea.y) + 11}
          fontSize={8} fill="#10b981" fontFamily="monospace"
        >
          ({printArea.x},{printArea.y})
        </text>

        {/* Artwork */}
        <rect
          x={ox + s(artwork.x)} y={oy + s(artwork.y)}
          width={s(artwork.width)} height={s(artwork.height)}
          fill="rgba(99, 102, 241, 0.12)"
          stroke="#6366f1"
          strokeWidth={1.5}
          rx={2}
        />
        <text
          x={ox + s(artwork.x) + s(artwork.width) / 2}
          y={oy + s(artwork.y) + s(artwork.height) / 2 + 3}
          fontSize={10} fill="#6366f1" fontFamily="monospace" textAnchor="middle" fontWeight={600}
        >
          ARTE
        </text>
        {/* Artwork coordinate label */}
        <text
          x={ox + s(artwork.x) + 3} y={oy + s(artwork.y) + 10}
          fontSize={8} fill="#6366f1" fontFamily="monospace"
        >
          ({artwork.x},{artwork.y})
        </text>

        {/* Dimension arrows for print area x offset */}
        <line
          x1={ox} y1={oy + s(printArea.y) + s(printArea.height) + 16}
          x2={ox + s(printArea.x)} y2={oy + s(printArea.y) + s(printArea.height) + 16}
          stroke="var(--ifm-color-emphasis-400)" strokeWidth={1} markerEnd="url(#arrowhead)"
        />
        <text
          x={ox + s(printArea.x) / 2}
          y={oy + s(printArea.y) + s(printArea.height) + 28}
          fontSize={8} fill="var(--ifm-color-emphasis-500)" fontFamily="monospace" textAnchor="middle"
        >
          x={printArea.x}px
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="var(--ifm-color-emphasis-400)" />
          </marker>
        </defs>

        {/* Legend */}
        <rect x={ox} y={oy + s(sourceHeight) + 12} width={10} height={10} fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth={1} rx={2} />
        <text x={ox + 14} y={oy + s(sourceHeight) + 21} fontSize={9} fill="var(--ifm-color-emphasis-600)" fontFamily="monospace">
          printArea
        </text>

        <rect x={ox + 90} y={oy + s(sourceHeight) + 12} width={10} height={10} fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth={1} rx={2} />
        <text x={ox + 104} y={oy + s(sourceHeight) + 21} fontSize={9} fill="var(--ifm-color-emphasis-600)" fontFamily="monospace">
          artwork (x, y, scale)
        </text>
      </svg>
    </div>
  );
}
