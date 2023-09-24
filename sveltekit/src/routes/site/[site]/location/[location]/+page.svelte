<script lang="ts">
	// TO-DO: add some input to the rooms section for filters. First off would be adults and children, then pets/smoking type criteria, we may want those inputs to filter the rooms.

	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Number from '$lib/components/Number.svelte';

	import InputField from '$lib/components/InputField.svelte';

	import { Swipe, SwipeItem } from 'svelte-swipe';

	// TO-DO: use some animation to flip to a card back if possible. We could also just do an expand link/button or other method to hide the additional room details.
	import { flip } from 'svelte/animate';

	// TO-DO: https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements
	import { goto } from '$app/navigation';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from '$lib/stripe';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data: any = {};

	// TO-DO: maybe replace with https://github.com/react2svelte/swipeable and a better carousel with part of other items showing
	const swipeConfig = {
		autoplay: false,
		delay: 5000,
		showIndicators: true,
		transitionDuration: 1000,
		defaultIndex: 0
	};

	let active_item = 0;
	let swipe_holder_height = 600;

	function heightChanged({ detail }) {
		console.log(detail.height);
		swipe_holder_height = detail.height;
		console.log(swipe_holder_height);
		// under swipe item goes: on:swipe_item_height_change={heightChanged}>
	}

	let formData = {
		name: '',
		surname: '',
		email: '',
		phone: '',
		stripeCustomerId: '',
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
			let thanksPath = '/site/' + data.site + '/location/' + data.location.id + '/thanks';
			goto(thanksPath);
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

	let steps: Array<string> = ['Select', 'Info', 'Review', 'Pay'],
		currentActive: number = 1,
		progressBar: any;

	let has_error = false;

	const handleProgress = (stepIncrement: number) => {
		console.log({ currentActive });
		console.log({ stepIncrement });
		// if statements per step
		if (currentActive == 1) {
			if (formData.selected_rooms.length >= 1) {
				console.log('looping through each room selected');
				formData.selected_rooms.forEach((selected) => {
					console.log('find matching id in list');
					data.rooms.forEach((room) => {
						if (selected == room.id) {
							console.log(
								'room id matched, adding: ' + room.attributes.baseNightPrice + ' for id: ' + room.id
							);
							roomTotal += room.attributes.baseNightPrice * 100;
						}
					});
				});
				console.log({ roomTotal });
			} else {
				console.log('No room selected not progressing.');
				document.getElementById('room_error_modal').showModal();
				return;
			}
		}
		if (currentActive == 2) {
			// create customer
		}
		progressBar.handleProgress(stepIncrement);
		console.log({ currentActive });
	};

	const handleSubmit = () => {
		console.log('Your form data => ', formData);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Breezy Book" />
</svelte:head>
<dialog id="room_error_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-white text-lg">Oops!</h3>
		<p class="py-4 text-white">You must select a room to proceed.</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
<main class="w-screen h-fit flex-col grid place-content-center overflow-visible">
	<h1 class="text-center">{data.location.attributes.Name}</h1>
	<div class="mt-10 overflow-visible">
		<div class="w-full">
			<ProgressBar {steps} bind:currentActive bind:this={progressBar} />
		</div>
		<form class="w-full overflow-visible" on:submit={handleSubmit}>
			{#if currentActive == 1}
				<div class="w-full overflow-visible" style="height:{swipe_holder_height}px">
					<Swipe bind:active_item {...swipeConfig}>
						{#each data.rooms as item, index}
							<SwipeItem active={active_item == index} allow_dynamic_height={true}>
								<div class="card w-7/12 shadow-2xl" style="height:{item.attributes.height}px">
									<figure class="">
										<img src={item.attributes.image_url} alt="" class="img rounded-xl" />
									</figure>
									<div class="card-body">
										<h2 class="card-title">{item.attributes.title}</h2>
										<p>{item.attributes.Description}</p>
										<p>
											Room price per night: $<Number
												number={item.attributes.baseNightPrice}
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
													value={item.id}
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
				<InputField label={'First Name'} bind:value={formData.name} />
				<InputField label={'Last Name'} bind:value={formData.surname} />
				<InputField label={'Email'} bind:value={formData.email} />
				<InputField label={'Phone'} bind:value={formData.phone} />
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

		<div class="step-button mt-10">
			<button
				class="btn btn-secondary w-64 rounded-full"
				on:click={() => handleProgress(-1)}
				disabled={currentActive == 1}>Prev</button
			>
			<button
				class="btn btn-secondary w-64 rounded-full"
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
	.has-pointer-event {
		pointer-events: fill;
	}
	:root {
		--sv-swipe-panel-height: inherit;
		--sv-swipe-panel-width: inherit;
		--sv-swipe-panel-wrapper-index: 2;
		--sv-swipe-indicator-active-color: rgb(159, 255, 150);
		--sv-swipe-handler-top: 0px;
	}
</style>
