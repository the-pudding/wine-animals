<script>
	import { onMount, createEventDispatcher } from "svelte";
	import { range, format } from "d3";
	import { fade } from 'svelte/transition';
	import Icon from "$components/helpers/Icon.svelte";
	import { stealPriceNum, stealRatingNum } from "$stores/misc.js";
	import { get } from "svelte/store";
	export let min = 0;
	export let max = 700;
	export let step = 1;
	export let showTicks = false;
	export let label = "";
	export let metric;
	export let rangeW;
	export let rangeH;
	export let padding;

	let thumbOffset = 0;
	let labelElement;
	let rangeInput;

	const dispatch = createEventDispatcher();

	let boundStore = metric === "price" ? stealPriceNum : stealRatingNum;

	let value = get(boundStore);

	$: boundStore.set(value);

	function handleInput(event) {
        value = +event.target.value; // Ensure value is a number
        dispatch("input", value);    // Dispatch value directly, not wrapped in an object
    }

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

<div class="range" id="range-{metric}" 
	style="width: calc({metric == "price" ? rangeH : rangeW }px - {padding}px">
	<input 
        type="range" 
        aria-label={label} 
        {min} 
        {max} 
        {step} 
        bind:value 
		bind:this={rangeInput}
        on:input={handleInput} />
		<div class="thumb-label" style="left: {thumbOffset}px;">
			<p>
				{#if metric == "price"}
					${value}
				{:else}
					{value}
				{/if}
			</p>
		</div>
</div>

<style>
	#range-price {
		position: absolute;
		transform: rotate(-90deg) translate(-100%, 0);
		transform-origin: left top;
		top: 4.25rem;
		left: calc(100% - 6rem);
		pointer-events: auto;
		overflow: visible;
	}

	#range-rating {
		position: absolute;
		pointer-events: auto;
		left: 78px;
	}

	.thumb-label {
		position: absolute;
		top: -36px;
		width: 60px;
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

	#range-price .thumb-label {
		transform: rotate(90deg) translate(0, -6px);
		transform-origin: left top;
		top: 24px;
		justify-content: flex-start;
	}

	.thumb-label p {
		margin: 0;
		line-height: 1;
		text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
	}

	.range {
		--thumb-width: 36px;
		--tick-font-size: 12px;
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
		/* background: blue; */
		position: relative;
		outline: none;
	}

	input[type="range"]:disabled {
		cursor: not-allowed;
		opacity: 0.6;       
	}

	/* input[type="range"]:focus {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	}

	input[type="range"]:focus::-webkit-slider-thumb,
	input[type="range"]:focus::-moz-range-thumb,
	input[type="range"]:focus::-ms-thumb {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	} */

	input[type="range"]::-webkit-slider-runnable-track {
		width: 100%;
		height: calc(var(--thumb-width) / 8);
		background: transparent;
		border-radius: 4px;
	}

	#range-price input[type="range"]::-webkit-slider-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
  		appearance: none;
		border-radius: 50%;
		background: url("/assets/images/range-vert.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border: 3px solid var(--wine-black);
		appearance: none;
		margin-left: calc(var(--thumb-width) / -3);
		margin-top: -18px;
		position: relative;
	}

	#range-rating input[type="range"]::-webkit-slider-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
  		appearance: none;
		border-radius: 50%;
		background: url("/assets/images/range-vert.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border: 3px solid var(--wine-black);
		appearance: none;
		margin-top: calc(var(--thumb-width) / -3);
		position: relative;
	}

	/* input[type="range"]:focus::-webkit-slider-runnable-track {
		background: var(--wine-med-gray);
	} */

	input[type="range"]::-moz-range-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: var(--wine-med-gray);
		border-radius: 4px;
	}

	input[type="range"]::-moz-range-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		appearance: none;
		background: url("/assets/images/range-vert.png");
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
		background: url("./assets/images/icons/cat.png");
	}

	/* input[type="range"]:focus::-ms-fill-lower,
	input[type="range"]:focus::-ms-fill-upper {
		background: var(--wine-med-gray);
	} */

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

	@media(max-width: 700px) {
		#range-price {
			left: calc(100% - 4rem);
			top: 2.25rem;
		}

		#range-rating {
			left: 3rem;
		}
	}
</style>