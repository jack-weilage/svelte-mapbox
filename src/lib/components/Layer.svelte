<script lang="ts">
	import type { AnyLayer } from 'mapbox-gl'
	import type { LayerContext, MapContext, SourceContext } from '../context.js'

	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { layerContextKey, mapContextKey, sourceContextKey } from '../context.js'

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { sourceID } = getContext<SourceContext>(sourceContextKey)
	const { layerStore } = setContext<LayerContext>(layerContextKey, { layerStore: writable() })

	export let options: AnyLayer
	export const layer = layerStore

	onMount(() => {
		$mapStore.addLayer({
			//@ts-expect-error - source doesn't exist on some layers
			source: sourceID,
			...options,
		})
		$layerStore = $mapStore.getLayer(options.id)

		return () => {
			// The parent source may have already removed this layer before destruction.
			if ($mapStore.getLayer(options.id)) {
				$mapStore.removeLayer(options.id)
			}
		}
	})
</script>

{#if $layerStore}
	<slot />
{/if}
