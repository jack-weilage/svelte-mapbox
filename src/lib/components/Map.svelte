<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css'

	import type { MapContext } from '../context.js'
	import type { MapboxEvent, MapboxOptions } from 'mapbox-gl'

	import { Map } from 'mapbox-gl'
	import { mapContextKey } from '../context.js'
	import { onMount, setContext, createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'

	const dispatch = createEventDispatcher()

	export let map: Omit<MapboxOptions, 'container'> = {}

	const { mapStore } = setContext<MapContext>(mapContextKey, { mapStore: writable() })
	let container: HTMLDivElement

	onMount(() => {
		function onLoad(ev: MapboxEvent) {
			dispatch('load', ev)

			$mapStore = ev.target
		}

		new Map({ container, ...map }).on('load', onLoad)

		return () => {
			$mapStore?.off('load', onLoad)
		}
	})
</script>

<div bind:this={container} {...$$restProps}>
	{#if $mapStore}
		<slot element={container} map={$mapStore} />
	{/if}
</div>
