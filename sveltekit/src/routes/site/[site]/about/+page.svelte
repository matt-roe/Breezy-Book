<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any = {};
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About {data.site.attributes.Name}</h1>
</div>
