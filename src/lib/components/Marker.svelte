<script lang="ts">
	import type { LngLatLike, MarkerOptions } from 'mapbox-gl'
	import type { MapContext, MarkerContext } from '../context.js'

    import Mapbox from 'mapbox-gl'
	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { mapContextKey, markerContextKey } from '../context.js'

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { markerStore } = setContext<MarkerContext>(markerContextKey, { markerStore: writable() })

	export let lngLat: LngLatLike
	export let options: MarkerOptions = {}
	export const marker = markerStore

	$: $markerStore?.setLngLat(lngLat)
	$: $markerStore?.setDraggable(options.draggable ?? false)
	$: $markerStore?.setOccludedOpacity(options.occludedOpacity ?? 0.2)
	$: $markerStore?.setOffset(options.offset ?? [0, 0])
	$: $markerStore?.setPitchAlignment(options.pitchAlignment ?? 'auto')
	$: $markerStore?.setRotation(options.rotation ?? 0)
	$: $markerStore?.setRotationAlignment(options.rotationAlignment ?? 'auto')

	onMount(() => {
		$markerStore = new Mapbox.Marker(options).setLngLat(lngLat).addTo($mapStore)

		return () => {
			$markerStore.remove()
		}
	})
</script>

{#if $markerStore}
	<slot />
{/if}
