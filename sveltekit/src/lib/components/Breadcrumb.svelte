<script lang="ts">
	import { page } from '$app/stores';

	let crumbs: Array<{ label: string; href: string }> = [];

	$: {
		// Remove zero-length tokens.
		const tokens = $page.url.pathname.split('/').filter((t) => t !== '');

		// Create { label, href } pairs for each token.
		let tokenPath = '';
		crumbs = tokens.map((t) => {
			tokenPath += '/' + t;
			t = t.charAt(0).toUpperCase() + t.slice(1);
			return { label: t, href: tokenPath };
		});

		// Add a way to get home too.
		crumbs.unshift({ label: 'Home', href: '/' });
	}
</script>

<div class="breadcrumb">
	{#each crumbs as c, i}
		{#if i == 1}
			<a href={crumbs[2].href}>{c.label}</a> &gt;&nbsp;
		{/if}
		{#if i == 3}
			<a href={crumbs[4].href}>{c.label}</a>
		{/if}
	{/each}
</div>

<style lang="scss">
	.breadcrumb {
		position: relative;
		margin-top: -35px;
		margin-left: 70px;
		a {
			color: grey;
			padding: -10px 1rem;
		}
	}
</style>
