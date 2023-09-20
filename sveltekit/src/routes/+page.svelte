<script lang="ts">
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Number from '$lib/components/Number.svelte';

	import InputField from '$lib/components/InputField.svelte';

	import { Swipe, SwipeItem } from 'svelte-swipe';

	import { flip } from 'svelte/animate';

	// TO DO: https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements
	import { goto } from '$app/navigation';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from '$lib/stripe';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	export let data: any = {};

	const swipeConfig = {
		autoplay: false,
		delay: 2000,
		showIndicators: true,
		transitionDuration: 1000,
		defaultIndex: 0
	};

	let swipe_holder_height = 0;

	function heightChanged({ detail }) {
		swipe_holder_height = detail.height;
	}

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

	/**
	 * @type {import("@stripe/stripe-js").Stripe | null}
	 */
	let stripe: any = null;
	/**
	 * @type {import("@stripe/stripe-js").StripeError | null}
	 */
	let error = null;

	let clientSecret: string | null = '';

	let elements: any;
	let processing: boolean = false;

	let roomTotal: number = 0;

	let locale: string = 'en';

	let numNights: number = 7;

	let amount: number = 0;

	let active_item = 0;

	async function submit() {
		// avoid processing duplicates
		if (processing) return;

		processing = true;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging
		console.log({ result });

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page
			goto('thanks');
		}
	}

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
		console.log({ stripe });
	});

	async function prepClientSecret() {
		let variables = { roomTotal: roomTotal, numNights: numNights };
		const response = await fetch('/payment-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				// TO-DO: add the proper client side encryption of data transfered to server endpoints.
				//Authorization: `ApiKey ${SWOP_API_KEY}`
			},
			body: JSON.stringify(variables)
		});
		const stripeData = await response.json();
		clientSecret = stripeData.payment_intent.client_secret;
		amount = stripeData.amount / 100;
		const result = { clientSecret: stripeData.payment_intent.client_secret, amount: amount };
		console.log({ result });
		return result;
	}

	let steps: Array<string> = ['Room', 'Info', 'Payment', 'Confirmation'],
		currentActive: number = 1,
		progressBar: any;

	const handleProgress = (stepIncrement: number) => {
		// if statements per step
		if (currentActive == 1) {
			formData.selected_rooms.forEach((i) => {
				roomTotal += data.rooms[i].baseNightPrice * 100;
			});
			console.log({ roomTotal });
		}
		if (currentActive == 4) {
		}
		console.log({ currentActive });
		progressBar.handleProgress(stepIncrement);
		console.log({ stepIncrement });
		console.log({ currentActive });
	};

	const handleSubmit = () => {
		console.log('Your form data => ', formData);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="w-screen h-screen">
	<h2>{data.location.attributes.Name}</h2>
	<div class="mx-auto grid inline-flex items-baseline mt-10 mb-5 overflow-visible">
		<ProgressBar {steps} bind:currentActive bind:this={progressBar} />
		<form class="overflow-visible" on:submit={handleSubmit}>
			{#if currentActive == 1}
				<div
					class="swipe-holder w-11/12 text-center overflow-visible"
					style="height:{swipe_holder_height}px"
				>
					<Swipe bind:active_item {...swipeConfig}>
						{#each data.rooms as item, index (item.id)}
							<SwipeItem
								active={active_item == index}
								allow_dynamic_height={true}
								allow_infinite_swipe={true}
								on:swipe_item_height_change={heightChanged}
							>
								<div class="card w-5/12 h-full shadow-2xl p-10 m-10">
									<figure class="p-2 m-2">
										<img
											src={data.rooms[index].attributes.image_url}
											alt=""
											class="img rounded-xl"
										/>
									</figure>
									<div class="card-body">
										<h2 class="card-title">{data.rooms[index].attributes.title}</h2>
										<p>{data.rooms[index].attributes.Description}</p>
										<p>
											Room price per night: $<Number
												number={data.rooms[index].attributes.baseNightPrice}
												{locale}
											/>
										</p>
										<div class="card-actions form-control has-pointer-event justify-center">
											<label class="label cursor-pointer">
												<span class="label-text">Stay here</span>
												<input
													type="checkbox"
													checked={false}
													bind:group={formData.selected_rooms}
													value={data.rooms[index].id}
													class="checkbox checkbox-primary"
												/>
											</label>
										</div>
									</div>
								</div>
							</SwipeItem>
						{/each}
					</Swipe>
					<p>{formData.selected_rooms}</p>
				</div>
			{:else if currentActive == 2}
				<h3>Date range picker here!</h3>
			{:else if currentActive == 3}
				<h3>
					Info and configurations for stay, maybe extra costs. Number of people staying in the room,
					etc.
				</h3>
				<InputField label={'Name'} bind:value={formData.name} />
				<InputField label={'Surname'} bind:value={formData.surname} />
				<InputField label={'Email'} bind:value={formData.email} />
				<InputField label={'Address'} bind:value={formData.address} />
				<InputField label={'City'} bind:value={formData.city} />
				<InputField label={'Country'} bind:value={formData.country} />
				<InputField label={'Postcode'} bind:value={formData.postcode} />
			{:else if currentActive == 4}
				{#await prepClientSecret()}
					<p>Loading...</p>
				{:then result}
					<p>Room price per night: $<Number number={roomTotal / 100} {locale} /></p>
					<p>Number of nights: {numNights}</p>
					<p>
						After credit card processing with Stripe (2.9% + 30c) and Breezy Book fee (2%) your
						total is $<Number number={amount} {locale} />
					</p>
					<Elements
						{stripe}
						{clientSecret}
						theme="flat"
						labels="floating"
						variables={{ colorPrimary: '#70acc7' }}
						rules={{ '.Input': { border: 'solid 2px #000000' } }}
						bind:elements
					>
						<form on:submit|preventDefault={submit}>
							<LinkAuthenticationElement />
							<PaymentElement />
							<Address />
							<button class="btn submit" disabled={processing}>
								{#if processing}
									Processing...
								{:else}
									Pay
								{/if}
							</button>
						</form>
					</Elements>
				{:catch error}
					<p>Error: {error.message}</p>
				{/await}
			{/if}
		</form>

		<div class="step-button">
			<button
				class="btn w-64 rounded-full"
				on:click={() => handleProgress(-1)}
				disabled={currentActive == 1}>Prev</button
			>
			<button
				class="btn w-64 rounded-full"
				on:click={() => handleProgress(+1)}
				disabled={currentActive == steps.length}>Next</button
			>
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
	img {
		max-width: 100%;
		height: auto;
		max-height: 300px;
	}
	.swipe-holder {
		margin: 10px;
		height: 500px;
		width: 100%;
	}
	.has-pointer-event {
		pointer-events: fill;
	}
</style>
