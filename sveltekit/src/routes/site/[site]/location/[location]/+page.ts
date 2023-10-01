/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:1337/api/locations?populate[0]=units&populate[1]=units.images&populate[2]=units.images.media&filters[id][$eq]='+params.location);
    const response = await res.json();
    const location = response.data[0]
    const units = location.attributes.units.data
    console.log(location);
    console.log(units);
    units.forEach(unit => {
        console.log(unit);
        unit.attributes.Images
    });

	return {
        siteId: params.site,
        location: location,
        units: units,
	}
}