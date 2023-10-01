<script lang="ts">
	// TO-DO: add some input to the units section for filters. First off would be adults and children, then pets/smoking type criteria, we may want those inputs to filter the units.

	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Number from '$lib/components/Number.svelte';

	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';

	let options = { loop: true };
	let plugins = [Autoplay()];

	// TO-DO: use some animation to flip to a card back if possible. We could also just do an expand link/button or other method to hide the additional unit details.
	import { flip } from 'svelte/animate';

	// TO-DO: https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements
	import { goto } from '$app/navigation';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Address, Elements, LinkAuthenticationElement, PaymentElement } from '$lib/stripe';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data: any = {};

	let formData = {
		adults: 1,
		children: 0,
		breakfast: '',
		commPref: '',
		stripeCustomerId: '',
		selected_units: []
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

	let unitTotal: number = 0;

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
		let variables = { unitTotal: unitTotal, numNights: numNights };
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
			if (formData.selected_units.length >= 1) {
				console.log('looping through each unit selected');
				formData.selected_units.forEach((selected) => {
					console.log('find matching id in list');
					data.units.forEach((unit: any) => {
						if (selected == unit.id) {
							console.log(
								'unit id matched, adding: ' + unit.attributes.PricePerNight + ' for id: ' + unit.id
							);
							unitTotal += unit.attributes.PricePerNight * 100;
						}
					});
				});
				console.log({ unitTotal });
			} else {
				console.log('No unit selected not progressing.');
				document.getElementById('unit_error_modal').showModal();
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
<dialog id="unit_error_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-white text-lg">Oops!</h3>
		<p class="py-4 text-white">You must select a unit to proceed.</p>
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
<main class="w-screen h-fit flex-col grid place-content-center overflow-hidden">
	<div class="place-content-around" style="width: 97vw;">
		<h1 class="text-center">{data.location.attributes.Title}</h1>
		<h1 class="text-center">{data.location.attributes.Description}</h1>
		<br />
		<div class="p-2 w-full">
			<ProgressBar {steps} bind:currentActive bind:this={progressBar} />
		</div>
		<form class="" on:submit={handleSubmit}>
			{#if currentActive == 1}
				<div class="embla" use:emblaCarouselSvelte={{ options, plugins }}>
					<div class="embla__container">
						{#each data.units as item, index}
							<div class="embla__slide">
								<div class="card shadow-2xl">
									<figure class="">
										<img src={item.attributes.ImageURL} alt="" class="img rounded-xl" />
									</figure>
									<div class="card-body">
										<h2 class="card-title">{item.attributes.Title}</h2>
										<h3>{item.attributes.Description}</h3>
										<h3>
											unit price per night: $<Number
												number={item.attributes.PricePerNight}
												{locale}
											/>
										</h3>
										<div class="card-actions form-control has-pointer-event justify-center">
											<label class="label cursor-pointer">
												<span class="label-text">Stay here</span>
												<input
													type="checkbox"
													checked={false}
													bind:group={formData.selected_units}
													value={item.id}
													class="checkbox checkbox-primary"
												/>
											</label>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="w-full">
					<h4>{formData.selected_units}</h4>
				</div>
			{:else if currentActive == 2}
				<h3>Date range picker here!</h3>
			{:else if currentActive == 3}
				<h3>Adults</h3>
				<input
					bind:value={formData.adults}
					type="range"
					min="1"
					max="10"
					class="range range-primary"
				/>
				<h3>Children</h3>
				<input
					bind:value={formData.children}
					type="range"
					min="1"
					max="10"
					class="range range-primary"
				/>
				<h3>Breakfast</h3>
				<select bind:value={formData.breakfast} class="select select-primary w-full max-w-xs">
					<option disabled selected>Breakfast option:</option>
					<option>None</option>
					<option>Basic</option>
					<option>Premium</option>
				</select>
				<h3>{formData.breakfast}</h3>
				<h3>Communication</h3>
				<select bind:value={formData.commPref} class="select select-primary w-full max-w-xs">
					<option disabled selected>Communication preference:</option>
					<option>Phone</option>
					<option>Email</option>
				</select>
				<h3>{formData.commPref}</h3>
			{:else if currentActive == 4}
				{#await prepClientSecret()}
					<p>Loading...</p>
				{:then result}
					<p>unit price per night: $<Number number={unitTotal / 100} {locale} /></p>
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
		<div class="step-button flex-auto">
			<button
				class="btn btn-secondary w-64 rounded-full justify-center"
				on:click={() => handleProgress(-1)}
				disabled={currentActive == 1}>Prev</button
			>
			<button
				class="btn btn-secondary w-64 rounded-full justify-center"
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
	/*  https://www.embla-carousel.com/examples/predefined/ */
	.embla__container {
		display: flex;
	}
	.embla__slide {
		flex: 0 0 30%; /* Slide covers 50% of the viewport */
		margin: 2%;
		padding-bottom: 30px;
	}
</style>
