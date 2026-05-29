'use client'

import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

function getColor(avg: number, min: number, max: number) {
  if (!avg) return '#E8E6E1'

  const ratio = max === min ? 0.5 : (avg - min) / (max - min)

  const start = { r: 188, g: 222, b: 210 }
  const end = { r: 14, g: 90, b: 80 }

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
    <div className="relative h-full w-full bg-[#F8F7F4]">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 920 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name
                const stateData = stateMap[stateName]
                const color = stateData ? getColor(stateData.avg, min, max) : '#E8E6E1'
                const hasData = Boolean(stateData)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#F5F4F1"
                    strokeWidth={1.2}
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
                        transition: 'fill 200ms ease',
                      },
                      hover: {
                        outline: 'none',
                        fill: hasData ? '#0A5A50' : '#D4D1CA',
                        cursor: hasData ? 'pointer' : 'default',
                        filter: hasData ? 'drop-shadow(0 2px 8px rgba(14,90,80,0.3))' : 'none',
                      },
                      pressed: {
                        outline: 'none',
                        fill: hasData ? '#073D36' : '#D4D1CA',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-5 rounded-2xl border border-[#E2E8EF] bg-white/95 px-6 py-3.5 shadow-[0_8px_24px_rgba(7,17,38,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[rgb(188,222,210)]" />
            <span className="text-sm font-medium text-[#8D9AA7]">
              Lower pay · ${min.toFixed(0)}/hr
            </span>
          </div>

          <div
            className="h-2 w-24 rounded-full"
            style={{ background: 'linear-gradient(to right, rgb(188,222,210), rgb(14,90,80))' }}
          />

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[rgb(14,90,80)]" />
            <span className="text-sm font-medium text-[#8D9AA7]">
              Higher pay · ${max.toFixed(0)}/hr
            </span>
          </div>

          <div className="h-4 w-px bg-[#E2E8EF]" />

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E8E6E1]" />
            <span className="text-sm font-medium text-[#8D9AA7]">No reports yet</span>
          </div>
        </div>
      </div>
    </div>
  )
}