/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:1337/api/sites/1?populate=*');
    const response = await res.json();
    console.log({response});
    const site = response.data
    console.log({site});
    const locations = site.attributes.locations.data
    console.log({locations});

	return {
        site: site,
        locations: locations,
	}
}