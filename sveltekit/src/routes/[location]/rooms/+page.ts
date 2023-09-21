/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:1337/api/locations?populate=*&filters[id][$eq]='+params.location);
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