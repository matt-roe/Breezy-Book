<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any = {};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Breezy Book" />
</svelte:head>
<main class="w-screen h-fill">
	<h1>{data.site.attributes.Name}</h1>
	{#each data.locations as item, index}
		<br />
		<a href="/site/{data.site.id}/location/{item.id}">{item.attributes.Name}</a>
	{/each}
</main>

<style>
</style>
