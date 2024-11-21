<script>
	import { getContext, onMount } from "svelte";
	import * as d3 from "d3";
	import * as d3Regression from 'd3-regression';
	import { topgroupSelect } from "$stores/misc.js";
	import rawData from "$data/wineData.csv";
	import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE } from "$stores/misc.js";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

    const regressionLine = $data[1];
	const filteredRawData = rawData.filter(d => d.price <= 100);

	export let r = 4;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;
    export let addRandom = false;
    let path;

    $: path = d3.line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(regressionLine);

    const maxLength = 99;
    const generations = Array.from({ length: maxLength + 1 }, (_, i) => i);

    // Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

	// Generate random subsets from rawData with length matching $bigScatterData
	$: randomDataForGenerations = filteredRawData !== 0 
		? generateRandomDataForGenerations(filteredRawData, $bigScatterData.length, generations)
		: undefined;

	function generateRandomSubset(data, targetLength) {
		// Shuffle rawData and select a subset with the same length as $bigScatterData
		return [...data]
			.sort(() => Math.random() - 0.5)
			.slice(0, targetLength);
	}

	function generateRandomDataForGenerations(data, targetLength, generations) {
		return generations.map(() => generateRandomSubset(data, targetLength));
	}

	$: baseFilters = $selectedPriceRangeSTORE[0] == 3
		&& $selectedPriceRangeSTORE[1] == 100
		&& $selectedRatingRangeSTORE[0] == 2.5
		&& $selectedRatingRangeSTORE[1] == 5
		&& $selectedYearRangeSTORE[0] == 1850
		&& $selectedYearRangeSTORE[1] == 2023;
</script>

<g class="rect">
	<rect
		class="highlight-quadrant"
		x={$xScale(d3.mean(filteredRawData, d => d.rating))}
		y={$yScale(d3.mean(filteredRawData, d => d.price))}
		width={$xScale(d3.mean(filteredRawData, d => d.rating))}
		height={$height - $yScale(d3.mean(filteredRawData, d => d.price))}
		fill="#363B45"
		opacity="0.3"
	/>
</g>
<g class="lines">
	<line class="priceAVG" x1={0 - $padding.left} y1={$yScale(d3.mean(filteredRawData, d => d.price))} x2={$width + $padding.right} y2={$yScale(d3.mean(filteredRawData, d => d.price))} />
	<line class="ratingAVG" x1={$xScale(d3.mean(filteredRawData, d => d.rating))} y1={0} x2={$xScale(d3.mean(filteredRawData, d => d.rating))} y2={$height} />
</g>
<g>
	{#each $data[0] as d, i}
        {@const cx = $xGet(d)}
        {@const cy = $yGet(d)}
        <circle 
            cx={cx} 
            cy={cy} 
            r={r} 
            fill={fill} 
            stroke={stroke} 
            stroke-width={strokeWidth} 
        />
    {/each}
</g>
{#if addRandom && baseFilters && $bigScatterData.length < 8472 && $bigScatterData.length >= 10}
	{#each randomDataForGenerations as randomData, i}
		{@const points = randomData.map(d => ({
			x: +d.rating,  // Convert rating to a number
			y: +d.price    // Convert price to a number
		}))}
		{@const trendLine = regression(points)}
		{@const pathLocal = d3.line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(trendLine)}
		<g class="random-lines">
			{#if pathLocal}
				<path class="expRegression fade" d={pathLocal} />
			{/if}
		</g>
	{/each}
{/if}
{#if baseFilters && $bigScatterData.length >= 10}
	<g class="lines">
		{#if path}
			<path class="expRegression" d={path} />
		{/if}
	</g>
{/if}

<style>
	circle {
		opacity: 0.5;
		stroke-width: 1;
		stroke: white;
		pointer-events: auto;
	}
	.regression, .expRegression {
		stroke-width: 2;
		stroke: #c35e34;
		fill: none;
	}

	.priceAVG, .ratingAVG {
		stroke-width: 2;
		stroke: var(--wine-med-gray);
	}
	.fade {
		opacity: 0.05;
		stroke: var(--color-gray-200);
	}
</style>
