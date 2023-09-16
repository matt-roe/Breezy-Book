import type { StripeElements, Stripe } from '@stripe/stripe-js'

export interface ElementsContext {
  elements: StripeElements
  stripe: Stripe
}

export interface EndpointOutput<Body extends DefaultBody = DefaultBody> {
	status?: number;
	headers?: Headers | Partial<ResponseHeaders>;
	body?: Body;
}