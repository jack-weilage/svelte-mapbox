<script lang="ts">
	import type { IControl } from 'mapbox-gl'
	import type { MapContext } from '../context.js'

	import { getContext, onMount } from 'svelte'
	import { mapContextKey } from '../context.js'

	let element: HTMLDivElement

	class SvelteControl implements IControl {
		onAdd() {
			return element
		}
		onRemove() {}
	}

	export let control: IControl = new SvelteControl()
	export let position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'

	const { mapStore } = getContext<MapContext>(mapContextKey)

	onMount(() => {
		$mapStore.addControl(control, position)

		return () => {
			$mapStore.removeControl(control)
		}
	})
</script>

{#if control instanceof SvelteControl}
	<div class="mapboxgl-ctrl mapboxgl-ctrl-group" {...$$restProps} bind:this={element}>
		<slot />
	</div>
{/if}
