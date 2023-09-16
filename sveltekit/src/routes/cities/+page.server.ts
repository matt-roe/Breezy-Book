// https://github.com/ivanhofer/sveltekit-typescript-showcase/blob/main/src/routes/products/%5Bid%5D/%2Bpage.server.ts
import type { PageServerLoad } from './$types'
import type { Product } from '$lib/models/product.model'

type OutputType = { northern_cities: any, product: Product }

// We have imported the `PageServerLoad` type from the relative `./$types` folder that
// is hidden in the generated `.svelte-kit` folder. Those generated types
// contain a `PageServerLoad` type with a `params` object that matches our route.
// You need to run the dev server or `svelte-kit sync` to generate them.
export const load: PageServerLoad<OutputType> = async ({ params, locals }) => {
	// usually here you would fetch the data from a DB
	const product: Product = {
		name: `product`,
		color: 'green',
	}

    const res = await fetch('http://localhost:1337/pfapi/northern-cities?filters%5Biso3%5D=USA');
    const northern_cities = await res.json();
    console.log({northern_cities});

	return {
        northern_cities,
		product,
		//username: locals.user ? locals.user.name : '',
	}
}