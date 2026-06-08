export type Position = [number, number]

export type PolygonGeometry = {
  type: 'Polygon'
  coordinates: Position[][]
}

export type MultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: Position[][][]
}

export type Geometry = PolygonGeometry | MultiPolygonGeometry

export type ProvinceFeature = {
  geometry: Geometry
  properties: {
    id: string
    name: string
  }
}

export type GeoCollection = {
  features: ProvinceFeature[]
}

export type Bounds = {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

export type ProvinceSummary = {
  province: string
  totalMahasiswa: number
  fillClassName?: string
}

export type ProvinceSummaryMap = Partial<Record<string, ProvinceSummary>>

export type ProvincePathData = {
  id: string
  province: string
  totalMahasiswa: number
  paths: { d: string; fill: string }[]
  x: number
  y: number
  centerX: number
  centerY: number
  fillClassName: string
}

export type GeneratedMapData = {
  svgWidth: number
  svgHeight: number
  provinces: ProvincePathData[]
}
