// need to switch this to a form submit. Likely a +page.server.ts instead. 
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const res = await fetch('http://localhost:1337/api/admin/create-author');
    const response = await res.json();
    console.log({response});
    const data = response.data
    console.log({data});
    // redirect to strapi login after form is successful.
}