<script lang="ts">
	import type { MapContext, SourceContext } from '../context.js'
	import type { AnySourceData, MapSourceDataEvent, Source } from 'mapbox-gl'

	import { mapContextKey, sourceContextKey } from '../context.js'
	import { getContext, onMount, setContext } from 'svelte'

	export let id: string
	export let source: AnySourceData

	const { mapStore } = getContext<MapContext>(mapContextKey)
	setContext<SourceContext>(sourceContextKey, { sourceID: id })

	let sourceInstance: Source

	$: if (sourceInstance?.type === 'geojson' && source.type === 'geojson') {
		//@ts-expect-error - Bad types! Not my problem!
		// console.log(sourceInstance)
		sourceInstance.setData(source.data)
	}

	onMount(() => {
		$mapStore.addSource(id, source)

		function onSourceData({ sourceId }: MapSourceDataEvent) {
			if (sourceId !== id) {
				return
			}

			$mapStore.off('sourcedata', onSourceData)
			sourceInstance = $mapStore.getSource(id)
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

{#if sourceInstance}
	<slot source={sourceInstance} />
{/if}
