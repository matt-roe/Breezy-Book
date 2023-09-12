import { SECRET_STRIPE_KEY } from '$env/static/private'
import Stripe from 'stripe'

const stripe = Stripe(SECRET_STRIPE_KEY)

export async function POST() {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd'
  })
  const clientSecret = paymentIntent.client_secret;
  return clientSecret
}