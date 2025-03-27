<script>
	import { getContext } from "svelte";
	import { line } from 'd3-shape';
	import { median } from 'd3-array';
	import rawData from "$data/wineData.csv";
	import { bigScatterData, selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE } from "$stores/misc.js";

	const { data, xGet, yGet, xScale, yScale, width, height, padding } = getContext("LayerCake");

    const regressionLine = $data[1];

    let path;

    $: path = line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(regressionLine);

    const maxLength = 99;
    const generations = Array.from({ length: maxLength + 1 }, (_, i) => i);

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
		x={$xScale(median(rawData, d => d.rating))}
		y={$yScale(median(rawData, d => d.price))}
		width={$xScale(median(rawData, d => d.rating))}
		height={$height - $yScale(median(rawData, d => d.price))}
		fill="#363B45"
		opacity=0.5
	/>
</g>
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
                r={5} 
                fill={(
					d.price <= 29.99 
					&& d.rating >= 4
					? "#3E5C4B" : "#475171")}  
                opacity={0.8}
            />
        {/if}
    {/each}
</g>

{#if baseFilters && $bigScatterData.length >= 10}
	<g class="lines">
		{#if path}
			<path class="expRegression" d={path} />
		{/if}
	</g>
{/if}

<g class="lines">
	<line class="priceAVG" x1={0 - $padding.left} y1={$yScale(median(rawData, d => d.price))} x2={$width + $padding.right} y2={$yScale(median(rawData, d => d.price))} />
	<line class="ratingAVG" x1={$xScale(median(rawData, d => d.rating))} y1={0} x2={$xScale(median(rawData, d => d.rating))} y2={$height} />
</g>
<text 
        class="label"
        x={$width-4} 
        y={$yScale(median(rawData, d => d.price)) - 10}
        text-anchor="end">
        Med. price (${median(rawData, d => d.price)})
    </text>

    <text 
        class="label"
        x={$xScale(median(rawData, d => d.rating)) - 140}
        y={-13} 
        transform={`rotate(-90, ${$xScale(median(rawData, d => d.rating))}, 0)`} 
        text-anchor="start">
        Med. rating ({median(rawData, d => d.rating)} stars)
    </text>

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

	.label {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--12px);
        fill: var(--wine-dark-tan);
    }
</style>