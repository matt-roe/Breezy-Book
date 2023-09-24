/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:1337/api/sites/'+params.site+'?populate[0]=locations&populate[1]=locations.rooms');
    const response = await res.json();
    const site = response.data
    const locations = site.attributes.locations.data
	return {
        site: site,
        locations: locations
	}
}