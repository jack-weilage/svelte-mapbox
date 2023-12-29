<script lang="ts">
	import type { LngLatLike, PopupOptions } from 'mapbox-gl'
	import type { MapContext, MarkerContext } from '../context.js'

	import Mapbox from 'mapbox-gl'
	import { createEventDispatcher, getContext, onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { mapContextKey, markerContextKey } from '../context.js'

	const dispatch = createEventDispatcher()

	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { markerStore } = getContext<MarkerContext | undefined>(markerContextKey) ?? {
		markerStore: undefined,
	}
	let popupStore = writable<Mapbox.Popup>()
	let element: HTMLElement

	export let lngLat: LngLatLike = undefined!
	export let content: HTMLElement | string = undefined!
	export let options: PopupOptions = {}
	export const popup = popupStore

	$: lngLat && $popupStore?.setLngLat(lngLat)
	$: $popupStore?.setMaxWidth(options.maxWidth ?? '240px')
	$: typeof content === 'string'
		? $popupStore?.setHTML(content)
		: $popupStore?.setDOMContent(content ?? element)
	$: $popupStore?.setOffset(options.offset)

	let lastClasses = options.className ?? ''
	$: {
		const oldClassList = lastClasses.split(' ')
		const newClassList = (options.className ?? '').split(' ')

		$popupStore?.addClassName(
			newClassList.filter((className) => !oldClassList.includes(className)).join(' '),
		)
		$popupStore?.removeClassName(
			oldClassList.filter((className) => !newClassList.includes(className)).join(' '),
		)

		lastClasses = options.className ?? ''
	}

	onMount(() => {
		$popupStore = new Mapbox.Popup(options)

		// If the popup is inside a marker, add it to the marker
		if ($markerStore) {
			$markerStore.setPopup($popupStore)
		} else {
			$popupStore.addTo($mapStore)
		}

		const onOpen = (ev: unknown) => dispatch('open', ev as { target: Mapbox.Popup })
		const onClose = (ev: unknown) => dispatch('close', ev as { target: Mapbox.Popup })

		$popupStore.on('open', onOpen)
		$popupStore.on('close', onClose)

		return () => {
			$popupStore.off('open', onOpen)
			$popupStore.off('close', onClose)

			$popupStore.remove()
		}
	})
</script>

{#if !content}
	<div bind:this={element} {...$$restProps}>
		<slot />
	</div>
{/if}
