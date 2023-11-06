<script lang="ts">
	import type { Map } from 'mapbox-gl'
	import type { MapContext } from '../context.js'

	import { getContext, onDestroy } from 'svelte'
	import { mapContextKey } from '../context.js'

	type ImageArguments = Parameters<Map['addImage']>

	const { mapStore } = getContext<MapContext>(mapContextKey)

	export let id: string
	export let image: ImageArguments[1] | string | URL
	export let options: ImageArguments[2]

	async function update_image(
		id: string,
		image: ImageArguments[1] | string | URL,
		options: ImageArguments[2],
	) {
		if (typeof image === 'string' || image instanceof URL) {
			image = await new Promise<HTMLImageElement>((resolve, reject) => {
				const img = new Image()
				img.addEventListener('load', () => resolve(img))
				img.addEventListener('error', reject)

				img.src = image.toString()
			})
		}

		if ($mapStore.hasImage(id)) {
			$mapStore.updateImage(id, image)
			return
		}

		$mapStore.addImage(id, image, options)
	}

	$: update_image(id, image, options)

	onDestroy(() => {
		$mapStore.removeImage(id)
	})
</script>
