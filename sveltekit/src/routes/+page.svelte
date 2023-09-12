<script lang="ts">
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Number from '$lib/components/Number.svelte';

	import { flip } from 'svelte/animate';
	import InputField from '$lib/components/InputField.svelte';

	// TO DO: https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from '$lib/stripe';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { select_options } from 'svelte/internal';

	let active_step: string;

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

	let room_list = [
		{
			id: 0,
			title: 'Room 1',
			per_night: 5000,
			image_url:
				'https://c1.wallpaperflare.com/preview/812/711/788/terrace-landscape-cottages-vacation-rentals-tuscany.jpg'
		},
		{
			id: 1,
			title: 'Room 2',
			per_night: 10000,
			image_url:
				'https://c1.wallpaperflare.com/preview/812/711/788/terrace-landscape-cottages-vacation-rentals-tuscany.jpg'
		}
	];

	/** @type {import('./$types').PageData} */
	export let data: any = {};

	/** @type {import('./$types').ActionData} */
	export let form: any = {};

	/**
	 * @type {import("@stripe/stripe-js").Stripe | null}
	 */
	let stripe: any = null;
	/**
	 * @type {string | null}
	 */
	let clientSecret = '';
	/**
	 * @type {string | null}
	 */
	let selectedPlan = null;
	/**
	 * @type {string | null}
	 */
	let priceId = '';
	/**
	 * @type {import("@stripe/stripe-js").StripeError | null}
	 */
	let error = null;
	/**
	 * @type {any}
	 */
	let elements: any;
	let processing = false;

	let roomTotal = 0;

	let locale: string = 'en';

	let numNights = 7;

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
		data = await response.json();
		clientSecret = data.payment_intent.client_secret;
		amount = data.amount / 100;
		const result = { clientSecret: data.payment_intent.client_secret, amount: amount };
		console.log({ result });
		return result;
	}

	let steps: Array<string> = ['Room', 'Info', 'Payment', 'Confirmation'],
		currentActive: number = 1,
		progressBar: any;

	const handleProgress = (stepIncrement: number) => {
		// if statements per step
		if (currentActive == 3) {
			formData.selected_rooms.forEach((roomId) => {
				roomTotal += room_list[roomId].per_night;
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

<main>
	<div class="container">
		<ProgressBar {steps} bind:currentActive bind:this={progressBar} />

		<form class="form-container" on:submit={handleSubmit}>
			{#if currentActive == 1}
				<div class="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
					{#each room_list as item, index (item.id)}
						<div class="carousel-item card w-96 bg-base-100 shadow-xl">
							<figure>
								<img src={room_list[index].image_url} alt="Shoes" class="img" />
							</figure>
							<div class="card-body">
								<h2 class="card-title">{room_list[index].title}</h2>
								<p>If a dog chews shoes whose shoes does he choose?</p>
								<div class="card-actions form-control justify-end">
									<label class="label cursor-pointer">
										<span class="label-text">Stay here</span>
										<input
											type="checkbox"
											checked={false}
											bind:group={formData.selected_rooms}
											value={room_list[index].id}
											class="checkbox checkbox-primary"
										/>
									</label>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if currentActive == 2}
				<h3>Date range picker here! numNights</h3>
			{:else if currentActive == 3}
				<h3>
					Configurations for stay, like extra costs. Number of people staying in the room, etc.
				</h3>
				<InputField label={'Name'} bind:value={formData.name} />
				<InputField label={'Surname'} bind:value={formData.surname} />
				<InputField label={'Email'} bind:value={formData.email} />
				<InputField label={'Address'} bind:value={formData.address} />
				<InputField label={'City'} bind:value={formData.city} />
				<InputField label={'Country'} bind:value={formData.country} />
				<InputField label={'Postcode'} bind:value={formData.postcode} />
				<form
					id="prep_intent"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							await applyAction(result);
							console.log({ result });
							clientSecret = result.data.client_secret;
						};
					}}
				>
					<input type="hidden" name="roomTotal" value={roomTotal} />
					<input type="hidden" name="numNights" value={numNights} />
				</form>
			{:else if currentActive == 4}
				{#await prepClientSecret()}
					<p>Loading...</p>
				{:then result}
					<p>roomTotal: {roomTotal}</p>
					<p>numNights: {numNights}</p>
					<p>total_amount: {result.amount}</p>
					<p>
						<Number number={amount} {locale} />
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
			<button class="btn" on:click={() => handleProgress(-1)} disabled={currentActive == 1}
				>Prev</button
			>
			<button
				class="btn"
				on:click={() => handleProgress(+1)}
				disabled={currentActive == steps.length}>Next</button
			>
		</div>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');

	* {
		box-sizing: border-box;
	}

	main {
		font-family: 'Muli', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		margin: 0;
	}

	.btn {
		background-color: #3498db;
		color: #fff;
		border: 0;
		border-radius: 6px;
		cursor: pointer;
		font-family: inherit;
		padding: 8px 30px;
		margin: 5px;
		font-size: 14px;
	}

	.btn:active {
		transform: scale(0.98);
	}

	.btn:focus {
		outline: 0;
	}

	.btn:disabled {
		background-color: #e0e0e0;
		cursor: not-allowed;
	}

	.step-button {
		margin-top: 1rem;
		text-align: center;
	}

	.form-container {
		text-align: center;
		max-width: 100%;
		min-width: 200px;
	}
	.img {
		width: 300px;
	}
	.submit {
		background: linear-gradient(to bottom, #44c767 5%, #50b01c 100%);
		background-color: #44c767;
	}
	.submit:hover {
		background: linear-gradient(to bottom, #50b01c 5%, #44c767 100%);
		background-color: #50b01c;
	}
	.message {
		text-align: center;
	}
</style>
