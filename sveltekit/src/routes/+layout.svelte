<script>
	import Header from '$lib/components/Header.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import '$lib/styles.css';
	import '../app.css';
</script>

<div class="justify-items-center">
	<Header />
	<Breadcrumb />
	<main>
		<slot />
	</main>

	<footer>
		<p>
			Own a rental? Create your own <a href="http://localhost:1337/admin/register-admin"
				>Breezy Book</a
			> page for free!
		</p>
	</footer>
</div>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
