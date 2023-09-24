<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any = {};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Breezy Book" />
</svelte:head>
<main class="w-full h-fill flex flex-col items-center place-content-center">
	<h1>{data.site.attributes.Name}</h1>
	<div class="w-11/12">
		{#each data.locations as location}
			<div class="collapse collapse-arrow join-item border border-base-300">
				<input type="radio" name="my-accordion-4" />
				<div class="collapse-title text-xl font-medium">
					{location.attributes.Name}
					<p>List default or active key search criteria / filter criteria for this location.</p>
					<p>
						Maybe detect if a user is signed into the admin panel, and present edit (pencil) and
						create (+) buttons
					</p>
				</div>
				<div class="collapse-content w-10/12">
					{location.attributes.Description}
					<p>List default or active key search criteria / filter criteria for this location.</p>
					<h3>Rooms</h3>
					{#each location.attributes.rooms.data as room}
						<div class="collapse collapse-arrow join-item border border-base-300">
							<input type="radio" name="my-accordion-5" />
							<div class="collapse-title text-xl font-medium">
								<p>{room.attributes.Name}</p>
								<p>List default or active key search criteria / filter criteria for this room.</p>
							</div>
							<div class="collapse-content">
								{room.attributes.Description}
								<p>List default or active key search criteria / filter criteria for this room.</p>
							</div>
						</div>
					{/each}
					<div class="mt-2">
						<a href="/site/{data.site.id}/location/{location.id}">
							<button class="btn btn-primary">Book Now</button>
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
</style>
