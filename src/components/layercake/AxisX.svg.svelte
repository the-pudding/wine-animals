<script>
	import { getContext } from "svelte";
	const { width, height, xScale, yScale, yRange } = getContext("LayerCake");

	export let gridlines = true;
	export let tickMarks = false;
	export let baseline = false;
	export let snapTicks = false;
	export let yTick = 16;
	export let formatTick = (d) => d;
	export let ticks = [0,25,50,75,100,125,150];
	/** If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $xScale.domain()
		: typeof ticks === 'function'
			? ticks($xScale.ticks())
			: $xScale.ticks(ticks);

	const textAnchor = (i) => {
		if (snapTicks === true) {
			if (i === 0) {
				return "start";
			}
			if (i === tickVals.length - 1) {
				return "end";
			}
		}
		return "middle";
	};

	function tickCheck(tick, i, width) {
		return $xScale(tick) + (width/5/2)
	}
</script>

<g class="axis x-axis" class:snapTicks>
	{#each tickVals as tick, i}
		<g
			class="tick tick-{i}"
			transform="translate({$xScale(tick)},{$yRange[0]})"
		>
			{#if gridlines !== false}
				<line class="gridline" y1={$height * -1} y2="0" x1="0" x2="0" />
			{/if}
			{#if tickMarks === true}
				<line class="tick-mark" y1={0} y2={6} x1={0} x2={0} />
			{/if}
			<text x={0} y={yTick} dx="" dy="" text-anchor={textAnchor(i)}
				>{formatTick(tick)}</text
			>
		</g>
	{/each}
	{#if baseline === true}
		<line
			class="baseline"
			y1={$height + 0.5}
			y2={$height + 0.5}
			x1="0"
			x2={$width}
		/>
	{/if}
</g>

<style>
	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	line,
	.tick line {
		stroke: var(--wine-med-gray);
		stroke-dasharray: 2px 2px;
	}

	.tick text {
		fill: var(--wine-tan);
		font-family: var(--sans);
		font-size: 14px;
	}

	.tick .tick-mark,
	.baseline {
		stroke-dasharray: 0;
	}

	.x-axis .tick.tick-0 text {
		transform: translateX(6px);
	}

	.x-axis .tick:last-child text {
		transform: translateX(-6px);
	}
</style>
