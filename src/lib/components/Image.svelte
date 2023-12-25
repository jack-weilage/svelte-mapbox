<script lang="ts">
	import type { Map } from 'mapbox-gl'
	import type { MapContext } from '../context.js'

	import { getContext, onDestroy } from 'svelte'
	import { mapContextKey } from '../context.js'

	type ImageArguments = Parameters<Map['addImage']>

	const { mapStore } = getContext<MapContext>(mapContextKey)

	export let id: string
	export let src: ImageArguments[1] | string | URL
	export let options: ImageArguments[2] = undefined

	async function update_image(
		id: string,
		src: ImageArguments[1] | string | URL,
		options: ImageArguments[2],
	) {
		if (typeof src === 'string' || src instanceof URL) {
			src = await new Promise<HTMLImageElement>((resolve, reject) => {
				const img = new Image()
				img.addEventListener('load', () => resolve(img))
				img.addEventListener('error', reject)

				img.src = src.toString()
			})
		}

		if ($mapStore.hasImage(id)) {
			$mapStore.updateImage(id, src)
			return
		}

		$mapStore.addImage(id, src, options)
	}

	$: update_image(id, src, options)

	onDestroy(() => {
		$mapStore.removeImage(id)
	})
</script>
