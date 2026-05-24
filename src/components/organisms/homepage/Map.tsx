import mapDataJson from '@/assets/maps/indonesia-map-generated.json'
import { getTextStrokeStyle } from '@/lib/textStroke'
import type { GeneratedMapData } from '@/types/maps'

import MapInteractive from './MapInteractive'

const mapData = mapDataJson as GeneratedMapData

const Map = () => {
  return (
    <section className="bg-yellow-cs-30 z-0 flex min-h-screen w-full flex-col items-center py-10 md:py-16">
      <div className="w-full max-w-[1440px] px-4 md:px-8">
        <h1
          className="font-rubikone text-blue-cs-30 text-center text-5xl tracking-normal"
          style={getTextStrokeStyle({ color: '#ffffff', width: 4 })}
        >
          EVASTRA Maps
        </h1>
      </div>
      <MapInteractive provinces={mapData.provinces} svgWidth={mapData.svgWidth} svgHeight={mapData.svgHeight} />
    </section>
  )
}

export default Map
