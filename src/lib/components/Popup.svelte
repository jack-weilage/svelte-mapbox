<script lang="ts">
	import type { MapContext, MarkerContext } from '../context.js'
	import type { LngLatLike, PopupOptions } from 'mapbox-gl'

	import { mapContextKey, markerContextKey } from '../context.js'
	import { Popup } from 'mapbox-gl'
	import { getContext, onMount, createEventDispatcher } from 'svelte'

	export let lngLat: LngLatLike = undefined!
	export let content: HTMLElement | string = undefined!
	let element: HTMLElement
	export let popup: PopupOptions = {}

	const dispatch = createEventDispatcher()

	let popupInstance: Popup
	const { mapStore } = getContext<MapContext>(mapContextKey)
	const { markerStore } = getContext<MarkerContext | undefined>(markerContextKey) ?? {
		markerStore: undefined,
	}

	$: lngLat && popupInstance?.setLngLat(lngLat)
	$: popupInstance?.setMaxWidth(popup.maxWidth ?? '240px')
	$: typeof content === 'string'
		? popupInstance?.setHTML(content)
		: popupInstance?.setDOMContent(content ?? element)
	$: popupInstance?.setOffset(popup.offset)

	let lastClasses = popup.className ?? ''
	$: {
		const oldClassList = lastClasses.split(' ')
		const newClassList = (popup.className ?? '').split(' ')

		popupInstance?.addClassName(
			newClassList.filter((className) => !oldClassList.includes(className)).join(' ')
		)
		popupInstance?.removeClassName(
			oldClassList.filter((className) => !newClassList.includes(className)).join(' ')
		)

		lastClasses = popup.className ?? ''
	}

	onMount(() => {
		popupInstance = new Popup(popup)

		if ($markerStore) {
			$markerStore.setPopup(popupInstance)
		} else {
			popupInstance.addTo($mapStore)
		}

		const onOpen = (ev: unknown) => dispatch('open', ev as { target: Popup })
		const onClose = (ev: unknown) => dispatch('close', ev as { target: Popup })

		popupInstance.on('open', onOpen)
		popupInstance.on('close', onClose)

		return () => {
			popupInstance.off('open', onOpen)
			popupInstance.off('close', onClose)

			popupInstance.remove()
		}
	})
</script>

{#if !content}
	<div bind:this={element} {...$$restProps}>
		<slot {element} popup={popupInstance} />
	</div>
{:else}
	<slot element={popupInstance?.getElement()} popup={popupInstance} />
{/if}
