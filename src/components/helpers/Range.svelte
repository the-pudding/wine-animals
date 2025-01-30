<script>
	import { onMount } from "svelte";
	import { range, format } from "d3";
	export let min = 0;
	export let max = 700;
	export let step = 1;
	export let showTicks = false;
	export let value = min;
	export let label = "";

	let rangeInput;
	let labelElement;
	let thumbOffset = 0;

	const getDecimalCount = (value) => {
		if (Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	};

	$: decimals = getDecimalCount(step);
	$: ticks = showTicks ? range(min, max + step, 100).filter(d => d <= max) : [];
	
	function updateThumbOffset(value) {
		if (rangeInput && labelElement) {
			const percent = (value - min) / (max - min);
			const thumbPosition = percent * rangeInput.offsetHeight;

			console.log(percent)

			thumbOffset = -thumbPosition;
		}
	}

	onMount(() => {
		updateThumbOffset(value);
	});

	$: updateThumbOffset(value);
</script>

<div class="range">
	<div class="ticks">
		{#each ticks as tick}
			<span class="tick">${format(`.${decimals}f`)(tick)}</span>
		{/each}
	</div>
	<input type="range" aria-label={label} {min} {max} {step} bind:value bind:this={rangeInput} />
	<div class="thumb-label" bind:this={labelElement} style="transform: translateY({thumbOffset}px)">
		<p>${value}</p>
		<p>Bionic Frog</p>
	</div>
</div>

<style>
	.range {
		--thumb-width: 24px;
		--tick-font-size: 12px;
		position: relative;
		margin-bottom: calc(var(--thumb-width) * 2);
	}

	.thumb-label {
		position: absolute;
		right: 50%;
		transform: translateX(-50%);
		color: var(--wine-tan);
		border-radius: 4px;
		font-size: var(--20px);
		font-family: var(--sans);
		font-weight: bold;
		margin-right: 1rem;
		text-align: right;
		text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
		pointer-events: none; /* Prevents interactions */
		/* transition: transform 0.1s ease-out; */
	}

	.thumb-label p {
		margin: 0;
		line-height: 1;
		min-width: 200px;
	}

	input[type="range"] {
		display: block;
		height: 80svh;
		appearance: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		background: transparent;
		position: relative;
		outline: none;
		writing-mode: vertical-lr;
		direction: rtl;
	}

	input[type="range"]:focus {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	}

	input[type="range"]:focus::-webkit-slider-thumb,
	input[type="range"]:focus::-moz-range-thumb,
	input[type="range"]:focus::-ms-thumb {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	}

	input[type="range"]::-webkit-slider-runnable-track {
		height: 100%;
		width: 2px;
		background: var(--wine-med-gray);
	}

	input[type="range"]::-webkit-slider-thumb {
		width: var(--thumb-width);
		height: var(--thumb-width);
		border-radius: 50%;
		background: var(--wine-tan);
		appearance: none;
		margin-left: calc(var(--thumb-width) / -2.25);
	}

	input[type="range"]:focus::-webkit-slider-runnable-track {
		background: var(--wine-med-gray);
	}

	input[type="range"]::-moz-range-track {
		height: 100%;
		width: 2px;
		background: var(--wine-med-gray);
		border-radius: 4px;
	}

	input[type="range"]::-moz-range-thumb {
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--wine-tan);
	}

	input[type="range"]::-ms-track {
		width: 2px;
		height: 100%;
		background: transparent;
		border-color: transparent;
		border-width: 16px 0;
		color: transparent;
	}

	input[type="range"]::-ms-fill-lower,
	input[type="range"]::-ms-fill-upper {
		background: var(--color-gray-300);
		border: 0.2px solid var(--color-black);
		border-radius: 4px;
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
	}

	input[type="range"]::-ms-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--wine-tan);
	}

	input[type="range"]:focus::-ms-fill-lower,
	input[type="range"]:focus::-ms-fill-upper {
		background: var(--color-gray-300);
	}

	.ticks {
		height: 100%;
		width: auto;
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-between; /* This evenly spaces them */
		align-items: flex-end; /* Align to the left */
		position: absolute;
		left: calc(var(--thumb-width) * -1.5);
	}

	.tick {
		display: flex;
		align-items: center;
		font-size: var(--tick-font-size);
		line-height: 1;
		text-align: right;
		color: var(--wine-tan);
		position: relative;
		width: auto;
		font-family: var(--sans);
	}

	.tick:before {
		display: block;
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(var(--thumb-width) / 3);
	}

	.tick:first-of-type {
		transform: translate(-1px, 0);
	}

	.tick:last-of-type {
		transform: translate(1px, 0);
	}
</style>