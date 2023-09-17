<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	import { Swipe, SwipeItem } from 'svelte-swipe';
	console.log({ data });
	let northern_cities = data.northern_cities;
	console.log({ northern_cities });

	let formData = {
		name: '',
		surname: '',
		email: '',
		password: '',
		address: '',
		city: '',
		country: '',
		postcode: '',
		account_name: '',
		card_no: '',
		selected_rooms: []
	};
	const swipeConfig = {
		autoplay: false,
		delay: 2000,
		showIndicators: true,
		transitionDuration: 1000,
		defaultIndex: 0
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="w-screen h-screen">
	<p>
		This is my usage of the Strapi API to load all the cities of Alaska, USA. Cities are the
		existing example data from the Redis powered pfapi extension setup/install. I will likely need
		to hit regular API endpoints without the Redis cache setup at first, as I think the
		configuration of those cached endpoints is a bit confusing.
	</p>
	<h1>product <strong>{data}</strong></h1>
	{JSON.stringify(data.product)}
	<div class="container mx-auto h-fit grid inline-flex items-baseline">
		<div class="swipe-holder">
			<Swipe {...swipeConfig}>
				{#each data.northern_cities.items as item, index (item.id)}
					<SwipeItem>
						<div class="card text-center shadow-2xl">
							<div class="card-body">
								<h2 class="card-title">{data.northern_cities.items[index].name}</h2>
								<p>{data.northern_cities.items[index].population}</p>
								<p>
									{data.northern_cities.items[index].lat}
									{data.northern_cities.items[index].lng}
								</p>
								<div class="card-actions form-control has-pointer-event justify-center">
									<label class="label cursor-pointer">
										<span class="label-text">Stay here</span>
										<input
											type="checkbox"
											checked={false}
											bind:group={formData.selected_rooms}
											value={data.northern_cities.items[index].id}
											class="checkbox checkbox-primary"
										/>
									</label>
								</div>
							</div>
						</div>
					</SwipeItem>
				{/each}
			</Swipe>
		</div>
	</div>
</main>

<style>
	.swipe-holder {
		height: 50vh;
		width: 100%;
	}
	img {
		max-width: 100%;
		height: auto;
		max-height: 200px;
	}
	.has-pointer-event {
		pointer-events: fill;
	}
</style>
