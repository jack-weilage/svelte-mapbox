<script lang="ts">
	import type { MapContext, MarkerContext } from '$lib/context'
	import type { LngLatLike, MarkerOptions } from 'mapbox-gl'

	import { mapContextKey, markerContextKey } from '$lib/context'
	import { Marker } from 'mapbox-gl'
	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let lngLat: LngLatLike
	export let marker: MarkerOptions = {}

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { markerStore } = setContext<MarkerContext>(markerContextKey, { markerStore: writable() })

	$: $markerStore?.setLngLat(lngLat)
	$: $markerStore?.setDraggable(marker.draggable ?? false)
	$: $markerStore?.setOccludedOpacity(marker.occludedOpacity ?? 0.2)
	$: $markerStore?.setOffset(marker.offset ?? [0, 0])
	$: $markerStore?.setPitchAlignment(marker.pitchAlignment ?? 'auto')
	$: $markerStore?.setRotation(marker.rotation ?? 0)
	$: $markerStore?.setRotationAlignment(marker.rotationAlignment ?? 'auto')

	onMount(() => {
		$markerStore = new Marker(marker).setLngLat(lngLat).addTo($mapStore)

		return () => {
			$markerStore.remove()
		}
	})
</script>

{#if $markerStore}
	<slot marker={$markerStore} />
{/if}
