import { SECRET_STRIPE_KEY } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(SECRET_STRIPE_KEY, {
  apiVersion: '2023-08-16',
});

export const actions = {
	default: async ({ request }) => {
    const data = Object.fromEntries(await request.formData()) as unknown as {
      amount: number
    }
    console.log('in account default form action');
		//const data = await request.formData();
    console.log({data});
		const payment_intent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: 'usd',
    })
    return payment_intent
	}
};