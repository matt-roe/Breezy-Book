import { SECRET_STRIPE_KEY } from '$env/static/private'
import Stripe from 'stripe'
import { json } from '@sveltejs/kit';

const stripe = Stripe(SECRET_STRIPE_KEY)

export async function POST({request, cookies}) {
  const data = await request.json();
  console.log(data);
  const amount = (data.unitTotal * data.numNights) + ((data.unitTotal * data.numNights) * 0.02)
  console.log(amount);
  const payment_intent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  })
  console.log(payment_intent);
  const response = {payment_intent: payment_intent, amount: amount};
  return json(response);
}