<script>
	import { getContext, onMount } from "svelte";
	import { line } from 'd3-shape';
	import { median } from 'd3-array';
	import rawData from "$data/wineData.csv";
	import { stealPriceNum, stealRatingNum } from "$stores/misc.js";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

	$: regressionLine = $data[1];

	let path;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	$: path = line()
		.x(d => $xScale(d[0]))
		.y(d => $yScale(d[1]))
		(regressionLine);
</script>

<g class="median-markings">
	<rect
		class="highlight-quadrant"
		x={$xScale(4)}
		y={$yScale(29.99)}
		width={$width - $xScale(4)}
		height={$height - $yScale(29.99)}
		fill="#363B45"
		opacity=0.3
	/>
</g>
<g class="card-wine-circle">
	{#each $data[0] as d, i}
        {@const cx = $xGet(d)}
        {@const cy = $yGet(d)}
        <circle 
			id={`card-wine-circle-${d.id}`}
			data-d={JSON.stringify(d)}
            cx={cx} 
            cy={cy} 
            r={5} 
            fill={(
                d.price <= 29.99 
                && d.rating >= 4
                ? "#3E5C4B" : "#475171")} 
        />
    {/each}
</g>

<g class="median-markings">
	{#if path}
		<path class="expRegression" d={path} />
	{/if}
    <line class="priceAVG" x1={0} y1={$yScale(median(rawData, d => d.price))} x2={$width + $padding.right} y2={$yScale(median(rawData, d => d.price))} />
    <line class="ratingAVG" x1={$xScale(median(rawData, d => d.rating))} y1={0} x2={$xScale(median(rawData, d => d.rating))} y2={$height} />
</g>

<style>
	circle {
		pointer-events: auto;
	}
	.expRegression {
		stroke-width: 2;
		stroke: var(--wine-red);
		fill: none;
	}

	.priceAVG, .ratingAVG {
		stroke-width: 2;
		stroke: var(--wine-tan);
	}
</style>
