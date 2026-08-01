'use client'

import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

function getColor(avg: number, min: number, max: number) {
  if (!avg) return '#E8EAED'

  const ratio = max === min ? 0.5 : (avg - min) / (max - min)

  const start = { r: 191, g: 224, b: 219 }
  const end = { r: 15, g: 118, b: 110 }

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
    <div className="relative h-full w-full bg-[#FAFBFD]">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 920 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name
              const stateData = stateMap[stateName]
              const color = stateData ? getColor(stateData.avg, min, max) : '#E8EAED'
              const hasData = Boolean(stateData)

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
                  stroke="#F6F9FC"
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
                      fill: hasData ? '#0F766E' : '#D8DCE1',
                      cursor: hasData ? 'pointer' : 'default',
                    },
                    pressed: {
                      outline: 'none',
                      fill: hasData ? '#0B5A54' : '#D8DCE1',
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded bg-white/85 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-xs font-medium text-[#94A3B8]">${min.toFixed(0)}/hr</span>

          <div
            className="h-1.5 w-20 rounded-full"
            style={{ background: 'linear-gradient(to right, rgb(191,224,219), rgb(15,118,110))' }}
          />

          <span className="text-xs font-medium text-[#94A3B8]">${max.toFixed(0)}/hr</span>

          <span className="ml-1 flex items-center gap-1.5 border-l border-[#E1E8EF] pl-3 text-xs font-medium text-[#94A3B8]">
            <span className="h-1.5 w-1.5 bg-[#E8EAED]" />
            No reports
          </span>
        </div>
      </div>
    </div>
  )
}