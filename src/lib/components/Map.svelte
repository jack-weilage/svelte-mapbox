<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css'

	import type { MapboxEvent, MapboxOptions } from 'mapbox-gl'
	import type { MapContext } from '../context.js'

	import Mapbox from 'mapbox-gl'
	import { createEventDispatcher, onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { mapContextKey } from '../context.js'

	const dispatch = createEventDispatcher()
	const { mapStore } = setContext<MapContext>(mapContextKey, { mapStore: writable() })
	let container: HTMLDivElement

	export let options: Omit<MapboxOptions, 'container'> = {}
	export const map = mapStore

	onMount(() => {
		function onLoad(ev: MapboxEvent) {
			dispatch('load', ev)

			$mapStore = ev.target
		}

		new Mapbox.Map({ container, ...options }).on('load', onLoad)

		return () => {
			$mapStore?.off('load', onLoad)
		}
	})
</script>

<div bind:this={container} {...$$restProps}>
	{#if $mapStore}
		<slot />
	{/if}
</div>
