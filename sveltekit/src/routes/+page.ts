// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

import type { PageLoad, PageServerData } from './$types'

// `PageServerData` will contain everything from the layouts and also the
// `data` from the `+page.server.ts` file.
//type OutputProps = Pick<PageServerData, 'product'> & { id: string }

// We have imported the `PageLoad` type from the relative `./$types` folder that
// is hidden in the generated `.svelte-kit` folder. Those generated types
// contain a `PageLoad` type with a `params` and `data` object that matches our route.
// You need to run the dev server or `svelte-kit sync` to generate them.
export const load: PageLoad<any> = async ({
	params,
	data,
}) => {
	//if (data.username) {
	//	console.log(`Request from '${data.username}`)
	//}
    //console.log({params});
    //console.log({data});
    const res = await fetch('http://localhost:1337/api/locations?populate=*&filters[id][$eq]=2');
    const response = await res.json();
    const location = response.data[0]
    const rooms = location.attributes.rooms.data
    console.log(location);
    console.log(rooms);

	return {
        location: location,
        rooms: rooms,
	}
}