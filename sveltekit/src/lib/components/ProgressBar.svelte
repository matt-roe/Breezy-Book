<script lang="ts">
	export let steps: Array<string> = [],
		currentActive = 1;
	let circles: any, progress: any;

	export const handleProgress = (stepIncrement: number) => {
		circles = document.querySelectorAll('.circle');
		if (stepIncrement == 1) {
			currentActive++;

			if (currentActive > circles.length) {
				currentActive = circles.length;
			}
		} else {
			currentActive--;

			if (currentActive < 1) {
				currentActive = 1;
			}
		}

		update();
	};

	function update() {
		circles.forEach((circle: any, idx: number) => {
			if (idx < currentActive) {
				circle.classList.add('active');
			} else {
				circle.classList.remove('active');
			}
		});

		const actives = document.querySelectorAll('.active');

		progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';
	}
</script>

<div class="progress-container" bind:this={circles}>
	<div class="progress" bind:this={progress} />
	{#each steps as step, i}
		<div class="circle {i == 0 ? 'active' : ''}" data-title={step}>{i + 1}</div>
	{/each}
</div>

<style>
	.progress-container {
		display: flex;
		justify-content: space-between;
		position: relative;
		margin-bottom: 20px;
		max-width: 100%;
		width: inherit;
	}

	.progress-container::before {
		content: '';
		background-color: #e0e0e0;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 100%;
		z-index: -1;
	}

	.progress {
		background-color: #3498db;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 4px;
		width: 0%;
		z-index: -1;
		transition: 0.4s ease;
	}

	.circle {
		background-color: #fff;
		color: #999;
		border-radius: 50%;
		height: 37px;
		width: 37px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #e0e0e0;
		transition: 0.4s ease;
		cursor: pointer;
	}

	.circle::after {
		content: attr(data-title) ' ';
		position: absolute;
		bottom: 35px;
		color: #999;
		transition: 0.4s ease;
	}

	.circle.active::after {
		color: #242424;
	}

	.circle.active {
		border-color: #92ff97;
	}
</style>
