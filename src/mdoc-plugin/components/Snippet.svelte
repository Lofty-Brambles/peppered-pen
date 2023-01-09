<script lang="ts">
	import type { SvelteComponent } from "svelte";

	export let element: typeof SvelteComponent;
</script>

<svelte:component this={element}>
	<slot />
</svelte:component>
