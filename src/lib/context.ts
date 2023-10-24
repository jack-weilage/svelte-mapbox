import type { Layer, Map, Marker } from 'mapbox-gl'
import type { Writable } from 'svelte/store'

export const mapContextKey = {}
export interface MapContext {
	mapStore: Writable<Map>
}

export const sourceContextKey = {}
export interface SourceContext {
	sourceID: string
}

export const layerContextKey = {}
export interface LayerContext {
	layerStore: Writable<Layer>
}

export const markerContextKey = {}
export interface MarkerContext {
	markerStore: Writable<Marker>
}
