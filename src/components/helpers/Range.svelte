<script>
	import { onMount, createEventDispatcher } from "svelte";
	import { range, format } from "d3";
	import { fade } from 'svelte/transition';
	export let min = 0;
	export let max = 700;
	export let step = 1;
	export let showTicks = false;
	export let value = min;
	export let label = "";
	export let pricesLocked;
	export let actualPrice;
	export let skipLocked;

	let thumbOffset = 0;
	let labelElement;
	let rangeInput;

	const dispatch = createEventDispatcher();

	const getDecimalCount = (value) => {
		if (Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	};

	$: decimals = getDecimalCount(step);
	$: ticks = [0, 700];

	function handleInput(event) {
        value = +event.target.value; // Ensure value is a number
        dispatch("input", value);    // Dispatch value directly, not wrapped in an object
    }

	$: actualPricePosition = ((actualPrice - min) / (max - min)) * 100;

    function updateThumbOffset(value) {
		if (rangeInput) {
			const rangeWidth = rangeInput.offsetWidth;
			const thumbWidth = parseInt(getComputedStyle(rangeInput).getPropertyValue('--thumb-width'), 10) || 24;
			const percent = (value - min) / (max - min);
			
			// Correct calculation to center the label on the thumb
			thumbOffset = percent * rangeWidth;
		}
	}

	onMount(() => {
		updateThumbOffset(value);
	});

	$: updateThumbOffset(value);
</script>

<div class="range" class:skipped={skipLocked}>
	<div class="ticks">
		{#each ticks as tick}
			<span class="tick">${format(`.${decimals}f`)(tick)}</span>
		{/each}
	</div>
	<input 
        type="range" 
        aria-label={label} 
        {min} 
        {max} 
        {step} 
        bind:value 
		bind:this={rangeInput}
        on:input={handleInput}
		disabled={pricesLocked} />
		<div class="thumb-label" style="left: {thumbOffset}px;">
			<p>${value}</p>
		</div>
		{#if pricesLocked}
			<div transition:fade class="actualPrice" style="left: {actualPricePosition}%">
				<p>${format(`.${decimals}f`)(actualPrice)}</p>
			</div>
    	{/if}
</div>

<style>
	.actualPrice {
		position: absolute;
		top: 0;
		left: 0;
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: transparent;
		border: 2px dashed var(--wine-red);
		appearance: none;
		margin-top: calc(var(--thumb-width) / -3);
	}

	.actualPrice p {
		position: absolute;
		top: -2.75rem;
		left: 50%;
		font-size: 0.75rem;
		color: var(--wine-red);
		font-size: var(--18px);
		font-weight: 700;
		font-family: var(--sans);
		text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
	}

	.thumb-label {
		position: absolute;
		top: -31px;
		width: 50px;
		left: 0;
        transform: translateX(-50%);
		color: var(--wine-tan);
		border-radius: 4px;
		font-size: var(--18px);
		font-family: var(--sans);
		font-weight: bold;
		text-align: right;
		text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
		pointer-events: none; 
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.thumb-label p {
		margin: 0;
		line-height: 1;
		text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
	}

	.range {
		--thumb-width: 24px;
		--tick-font-size: 12px;
		position: relative;
		margin-bottom: calc(var(--thumb-width) * 2);
	}

	.range.skipped input[type="range"]::-webkit-slider-thumb, .range.skipped .thumb-label  {
		opacity: 0;
	}

	input[type="range"] {
		display: block;
		width: 100%;
		appearance: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		background: transparent;
		position: relative;
		outline: none;
	}

	input[type="range"]:disabled {
		cursor: not-allowed;
		opacity: 0.6;       
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
		width: 100%;
		height: calc(var(--thumb-width) / 8);
		background: var(--wine-med-gray);
		border-radius: 4px;
	}

	input[type="range"]::-webkit-slider-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--wine-tan);
		border: 3px solid var(--wine-black);
		appearance: none;
		margin-top: calc(var(--thumb-width) / -3);
	}

	input[type="range"]::-webkit-slider-thumb::after {
		content: "name";
		color: white;
	}

	input[type="range"]:focus::-webkit-slider-runnable-track {
		background: var(--wine-med-gray);
	}

	input[type="range"]::-moz-range-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: var(--wine-med-gray);
		border-radius: 4px;
	}

	input[type="range"]::-moz-range-thumb {
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--color-gray-900);
	}

	input[type="range"]::-ms-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: transparent;
		border-color: transparent;
		border-width: 16px 0;
		color: transparent;
	}

	input[type="range"]::-ms-fill-lower,
	input[type="range"]::-ms-fill-upper {
		background: var(--wine-med-gray);
		border: 0.2px solid var(--color-black);
		border-radius: 4px;
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
	}

	input[type="range"]::-ms-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--color-gray-900);
	}

	input[type="range"]:focus::-ms-fill-lower,
	input[type="range"]:focus::-ms-fill-upper {
		background: var(--wine-med-gray);
	}

	.ticks {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0 calc(var(--thumb-width) / 2);
		margin: 0;
		user-select: none;
		position: absolute;
		left: 0;
		bottom: -0.25rem;
		transform: translate(0, 100%);
	}

	.tick {
		display: flex;
		justify-content: center;
		font-size: var(--tick-font-size);
		line-height: 1;
		text-align: center;
		width: 1px;
		background: transparent;
		color: var(--wine-tan);
		padding-top: calc(var(--thumb-width) / 2);
		position: relative;
		font-family: var(--sans);
		font-size: var(--14px);
	}

	.tick:first-of-type {
		transform: translate(-5px, 0);
	}

	.tick:last-of-type {
		transform: translate(-3px, 0);
	}
</style>