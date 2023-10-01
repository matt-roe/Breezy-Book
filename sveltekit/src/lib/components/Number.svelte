<script lang="ts">
	export let number: number;
	export let locale = 'en';

	$: formattedNumber = number.toLocaleString(locale, {
		notation: 'standard',
		compactDisplay: 'long'
	});
</script>

<span>{formattedNumber}</span>

<style>
	span {
		font-variant-numeric: tabular-nums;
	}
</style>
