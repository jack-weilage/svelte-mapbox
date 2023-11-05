<script lang="ts">
	import Control from '$lib/components/Control.svelte'

	let i = 0
</script>

<Control position="top-left">
	<button on:click={() => i++}>Clicked {i} times</button>
</Control>
