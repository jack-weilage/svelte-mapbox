<script lang="ts">
	import type { AnySourceData, MapSourceDataEvent, Source } from 'mapbox-gl'
	import type { MapContext, SourceContext } from '../context.js'

	import { getContext, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { mapContextKey, sourceContextKey } from '../context.js'

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const sourceStore = writable<Source>()

	export let id: string
	export let options: AnySourceData
	export const source = $sourceStore

	setContext<SourceContext>(sourceContextKey, { sourceID: id })

	$: if ($sourceStore?.type === 'geojson' && options.type === 'geojson') {
		//@ts-expect-error - Bad types! Not my problem!
		// console.log(sourceInstance)
		$sourceStore.setData(options.data)
	}

	onMount(() => {
		$mapStore.addSource(id, options)

		function onSourceData({ sourceId }: MapSourceDataEvent) {
			if (sourceId !== id) {
				return
			}

			$mapStore.off('sourcedata', onSourceData)
			$sourceStore = $mapStore.getSource(id)
		}

		$mapStore.on('sourcedata', onSourceData)

		return () => {
			$mapStore.off('sourcedata', onSourceData)

			for (const layer of $mapStore.getStyle().layers) {
				//@ts-expect-error - source doesn't exist on some layers.
				if (layer.source !== id) {
					continue
				}

				$mapStore.removeLayer(layer.id)
			}

			$mapStore.removeSource(id)
		}
	})
</script>

{#if $sourceStore}
	<slot />
{/if}
