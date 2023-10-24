<script lang="ts">
	import type { MapContext, SourceContext, LayerContext } from '../context.js'
	import type { AnyLayer } from 'mapbox-gl'

	import { mapContextKey, sourceContextKey, layerContextKey } from '../context.js'
	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let layer: Omit<AnyLayer, 'source'>

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { sourceID } = getContext<SourceContext>(sourceContextKey)
	const { layerStore } = setContext<LayerContext>(layerContextKey, { layerStore: writable() })

	onMount(() => {
		//@ts-expect-error - source doesn't exist on some layers
		$mapStore.addLayer({
			source: sourceID,
			...layer,
		})
		$layerStore = $mapStore.getLayer(layer.id)

		return () => {
			// The parent source may have already removed this layer before destruction.
			if ($mapStore.getLayer(layer.id)) {
				$mapStore.removeLayer(layer.id)
			}
		}
	})
</script>

{#if $layerStore}
	<slot layer={layerStore} />
{/if}
