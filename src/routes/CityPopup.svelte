<script lang="ts">
	import type { LayerContext, MapContext } from '$lib/context.js'
	import type { MapboxGeoJSONFeature } from 'mapbox-gl'

	import Popup from '$lib/components/Popup.svelte'
	import { layerContextKey, mapContextKey } from '$lib/context.js'
	import { getContext, onMount, tick } from 'svelte'

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { layerStore } = getContext<LayerContext>(layerContextKey)

	interface CityProperties {
		scalerank: number
		name: string
		website: string
		natlscale: number
		featureClass: string
	}
	let selectedCity:
		| {
				properties: CityProperties
				coordinates: [number, number]
		  }
		| undefined

	function onClose() {
		selectedCity = undefined
	}
	async function onClick({ features }: { features?: MapboxGeoJSONFeature[] }) {
		if (!features?.[0]?.properties || features[0].geometry.type !== 'Point') {
			return
		}

		//TODO: This is a nasty hack that removes the previous popup before adding a new one. This should be fixed in Popup.svelte
		await tick()

		selectedCity = {
			coordinates: features[0].geometry.coordinates as [number, number],
			properties: features[0].properties as CityProperties,
		}
	}
	onMount(() => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises -- This will work, so whatever
		$mapStore.on('click', $layerStore.id, onClick)

		return () => {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises -- This will work, so whatever
			$mapStore.off('click', $layerStore.id, onClick)
		}
	})
</script>

{#if selectedCity}
	<Popup on:close={onClose} lngLat={selectedCity.coordinates}>
		<h2>
			<a href={selectedCity.properties.website}>{selectedCity.properties.name}</a>
		</h2>
	</Popup>
{/if}
