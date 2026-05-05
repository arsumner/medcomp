'use client'

import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

function getColor(avg: number, min: number, max: number) {
  if (!avg) return '#E2E8F0'

  const ratio = max === min ? 0.5 : (avg - min) / (max - min)

  const start = { r: 239, g: 246, b: 255 } // #EFF6FF
  const end = { r: 76, g: 111, b: 255 } // #4C6FFF

  const r = Math.round(start.r - ratio * (start.r - end.r))
  const g = Math.round(start.g - ratio * (start.g - end.g))
  const b = Math.round(start.b - ratio * (start.b - end.b))

  return `rgb(${r}, ${g}, ${b})`
}

type StateData = {
  state: string
  avg: number
  count: number
}

type Props = {
  stateMap: Record<string, StateData>
  min: number
  max: number
  onHover: (tooltip: { name: string; avg: number; x: number; y: number } | null) => void
}

export default function UsMap({ stateMap, min, max, onHover }: Props) {
  const router = useRouter()

  function toSlug(s: string) {
    return s.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className="relative h-full w-full">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 860 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name
                const stateData = stateMap[stateName]
                const color = stateData ? getColor(stateData.avg, min, max) : '#E2E8F0'
                const hasData = Boolean(stateData)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={0.8}
                    onMouseEnter={(e) => {
                      if (hasData) {
                        onHover({
                          name: stateName,
                          avg: stateData.avg,
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                    }}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => {
                      if (stateName) router.push(`/state/${toSlug(stateName)}`)
                    }}
                    style={{
                      default: {
                        outline: 'none',
                        transition: 'fill 180ms ease',
                      },
                      hover: {
                        outline: 'none',
                        fill: hasData ? '#3B5BDB' : '#CBD5E1',
                        cursor: hasData ? 'pointer' : 'default',
                      },
                      pressed: {
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-4 right-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white/95 p-3 text-xs shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4C6FFF]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
              Avg hourly rate
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#94A3B8]">
              ${min.toFixed(0)}
            </span>

            <div
              className="h-2 w-28 rounded-full"
              style={{
                background: 'linear-gradient(to right, #EFF6FF, #4C6FFF)',
              }}
            />

            <span className="font-mono text-[10px] text-[#94A3B8]">
              ${max.toFixed(0)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1 border-t border-[#F1F5F9] pt-2">
            <div className="h-2 w-3 rounded-sm bg-[#E2E8F0]" />
            <span className="text-[10px] text-[#94A3B8]">No data</span>
          </div>
        </div>
      </div>
    </div>
  )
}