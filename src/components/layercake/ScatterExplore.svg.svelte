<script>
	import { getContext, onMount } from "svelte";
	import * as d3 from "d3";
	import * as d3Regression from 'd3-regression';
	import rawData from "$data/wineData.csv";
	import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE } from "$stores/misc.js";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

    const regressionLine = $data[1];
	const filteredRawData = rawData.filter(d => d.price <= 150);

	export let r = 10;
	export let fill = "#4E5B7B";
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
		&& $selectedPriceRangeSTORE[1] == 150
		&& $selectedRatingRangeSTORE[0] == 2.5
		&& $selectedRatingRangeSTORE[1] == 5
		&& $selectedYearRangeSTORE[0] == 1850
		&& $selectedYearRangeSTORE[1] == 2023;
</script>

<g class="median-markings active">
	<rect
		class="highlight-quadrant"
		x={$xScale(d3.mean(filteredRawData, d => d.rating))}
		y={$yScale(d3.mean(filteredRawData, d => d.price))}
		width={$xScale(d3.mean(filteredRawData, d => d.rating))}
		height={$height - $yScale(d3.mean(filteredRawData, d => d.price))}
		fill="#363B45"
		opacity=0.5
	/>
</g>

<g class="lines">
	<line class="priceAVG" x1={0 - $padding.left} y1={$yScale(d3.mean(filteredRawData, d => d.price))} x2={$width + $padding.right} y2={$yScale(d3.mean(filteredRawData, d => d.price))} />
	<line class="ratingAVG" x1={$xScale(d3.mean(filteredRawData, d => d.rating))} y1={0} x2={$xScale(d3.mean(filteredRawData, d => d.rating))} y2={$height} />
</g>
<text 
        class="label"
        x={$width-4} 
        y={$yScale(d3.median(rawData, d => d.price)) - 28}
        text-anchor="end"
        fill="white">
        Med. price (${d3.median(rawData, d => d.price)})
    </text>

    <text 
        class="label"
        x={$xScale(d3.median(rawData, d => d.rating)) - 140}
        y={-20} 
        transform={`rotate(-90, ${$xScale(d3.median(rawData, d => d.rating))}, 0)`} 
        text-anchor="start"
        fill="white">
        Med. rating ({d3.median(rawData, d => d.rating)} stars)
    </text>
<g>
    <!-- Render circles that are not in $bigScatterData first -->
    {#each $data[0] as d, i (d.id)}
        {#if !$bigScatterData.includes(d)}
            {@const cx = $xGet(d)}
            {@const cy = $yGet(d)}
            <circle 
				id={`circle-${d.id}`}
				class="circle-explore inactive"
                cx={cx} 
                cy={cy} 
                r={4} 
                fill="#363B45"
                opacity={0}
            />
        {/if}
    {/each}

    <!-- Render circles in $bigScatterData on top -->
    {#each $data[0] as d, i (d.id)}
        {#if $bigScatterData.includes(d)}
            {@const cx = $xGet(d)}
            {@const cy = $yGet(d)}
            <circle 
				id={`circle-${d.id}`}
				class="circle-explore active"
                cx={cx} 
                cy={cy} 
                r={4} 
                fill={fill} 
                opacity={0.8}
            />
        {/if}
    {/each}
</g>
<!-- {#if addRandom && baseFilters && $bigScatterData.length < 1059 && $bigScatterData.length >= 10}
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
{/if} -->
{#if baseFilters && $bigScatterData.length >= 10}
	<g class="lines">
		{#if path}
			<path class="expRegression" d={path} />
		{/if}
	</g>
{/if}

<style>
	circle {
		pointer-events: auto;
	}
	.regression, .expRegression {
		stroke-width: 2;
		stroke: var(--wine-red);
		fill: none;
	}

	.priceAVG, .ratingAVG {
		stroke-width: 2;
        stroke: var(--wine-tan);
	}
	.fade {
		opacity: 0.5;
		stroke: #363B45;
	}

	.label {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--12px);
        fill: var(--wine-dark-tan);
    }
</style>