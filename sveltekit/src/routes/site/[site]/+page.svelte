<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any = {};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Breezy Book" />
</svelte:head>
<main class="w-full h-fill flex flex-col items-center place-content-center">
	<h1>{data.site.attributes.Title}</h1>
	<h3>{data.site.attributes.Description}</h3>
	<div class="w-11/12">
		{#each data.locations as location}
			<div class="collapse collapse-arrow join-item border border-base-300">
				<input type="radio" name="my-accordion-4" />
				<div class="collapse-title text-xl font-medium">
					{location.attributes.Title}
					<p>List default or active key search criteria / filter criteria for this location.</p>
					<p>
						Maybe detect if a user is signed into the admin panel, and present edit (pencil) and
						create (+) buttons
					</p>
				</div>
				<div class="collapse-content w-10/12">
					<div class="flex">
						<div class="flex-none w-1/12" />
						<div class="flex-auto w-3/12">
							<p>{location.attributes.Description}</p>
							<p>List default or active key search criteria / filter criteria for this location.</p>
							<div class="stack">
								<img src={location.attributes.ImageURL} alt="Image 1" class="rounded" />
								<img src={location.attributes.ImageURL} alt="Image 2" class="rounded" />
								<img src={location.attributes.ImageURL} alt="Image 3" class="rounded" />
							</div>
						</div>
						<div class="flex-none w-1/12" />
						<div class="flex-auto w-5/12">
							<h3>Units</h3>
							{#each location.attributes.units.data as unit}
								<div class="collapse collapse-arrow join-item border border-base-300">
									<input type="radio" name="my-accordion-5" />
									<div class="collapse-title text-xl font-medium">
										<p>{unit.attributes.Title}</p>
										<p>
											List default or active key search criteria / filter criteria for this room.
										</p>
									</div>
									<div class="collapse-content">
										{unit.attributes.Description}
										<p>
											List default or active key search criteria / filter criteria for this room.
										</p>
										<div class="stack w-3/12">
											<img src={unit.attributes.ImageURL} alt="Image 1" class="rounded" />
											<img src={unit.attributes.ImageURL} alt="Image 2" class="rounded" />
											<img src={unit.attributes.ImageURL} alt="Image 3" class="rounded" />
										</div>
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
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
</style>
