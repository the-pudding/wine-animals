<script>
	import { getContext, onMount } from "svelte";
    import { tick } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
	import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import rawData from "$data/wineData.csv";
    import { bottleSelected, animalSelected, stealPriceNum, stealRatingNum, stealData, stealPercent } from "$stores/misc.js";
	import { stealTopgroupCounts } from "../../stores/misc";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");
    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");

    const topgroups = ["amphibian/reptile", "bear", "bird", "canine", "cat", "cattle/camelus",
		"deer-like", "fish-like", "horse", "insect",
		"marine invertebrate", "mythical", "pachyderm",
		"rabbit", "ram-like", "suid"
	];

	export let r = 30;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 2;
    export let chartScrollIndex;

    $: selectedWine = $animalSelected == "cat" ? "159436402"
        : $animalSelected == "frog" ? "156622800"
        :  "165876644";

    // Trendline
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    $: points = $data[1].map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))
    $: trendLine = regression(points);

    $: path = d3.line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(trendLine );

    // Compare lines
    const maxLength = 99;
    const generations = Array.from({ length: maxLength + 1 }, (_, i) => i);

    // Generate random subsets from rawData with length matching $bigScatterData
	let randomDataForGenerations = filteredRawData !== 0 
        ? generateRandomDataForGenerations(filteredRawData, $data[1]?.length || 0, generations)
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

    function setStealData($stealPriceNum, $stealRatingNum) {
        return rawData.filter(d => 
            d.price <= $stealPriceNum &&
            d.rating >= $stealRatingNum &&
            d.topgroup !== "none" &&
            d.topgroup !== "human" &&
            d.price <= 150
        )
    }

    $: steals = setStealData($stealPriceNum, $stealRatingNum);
    $: stealsPercent = steals.length/filteredRawData.length*100;

    $: stealData.set(steals);
    $: stealPercent.set(stealsPercent);

    $: topgroupCounts = [];

	$: {
		// Temporary map for counting occurrences
		let countMap = new Map();

		$stealData.forEach(d => {
			// Split topgroup string into an array
			const groups = d.topgroup.split(",").map(g => g.trim());

			// Check for matches and update count
			groups.forEach(group => {
				if (topgroups.includes(group)) {
					countMap.set(group, (countMap.get(group) || 0) + 1);
				}
			});
		});

		// Convert map to array
		topgroupCounts = Array.from(countMap, ([group, count]) => ({ group, count }))
			.sort((a, b) => b.count - a.count);
	}

    $: console.log({topgroupCounts, $stealData})

    $: stealTopgroupCounts.set(topgroupCounts)
    $: console.log($stealTopgroupCounts)

    $: if ($data[1]?.length) {
        tick().then(() => {
            randomDataForGenerations = generateRandomDataForGenerations(filteredRawData, $data[1].length, generations);
        });
    }
</script>

<!-- {#if randomDataForGenerations}
<g class="compare-wrapper"
    class:hidden={chartScrollIndex == 14}>
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
		<g class="compare-lines" class:active={chartScrollIndex >= 8}>
			{#if pathLocal}
				<path class="expRegression fade" d={pathLocal} />
			{/if}
		</g>
	{/each}
</g>
{/if} -->

<g class="median-markings" class:active={chartScrollIndex >= 7}>
    {#if chartScrollIndex >= 8}
        <rect
            class="highlight-quadrant"
            x={$xScale($stealRatingNum)}
            y={$yScale($stealPriceNum)}
            width={$width - $xScale($stealRatingNum)}
            height={$height - $yScale($stealPriceNum)}
            fill="#363B45"
            opacity=0.5
        />
    {/if}
</g>

{#if chartScrollIndex >= 4}
  <g class="wines-wrapper">
    {#each $data[1] as d, i}
      {#if selectedWine !== d.id}
        {@const cx = chartScrollIndex >= 5 ? $xGet(d) : $xGet($data[0][4])}
        {@const cy = chartScrollIndex >= 5 ? $yGet(d) : $yGet($data[0][4])}
        {@const animal = d.topgroup}
        <g class="wine-circle wine-circle-{animal}" 
            class:hidden={chartScrollIndex == 9 && d.topgroup !== "bird" ||
                chartScrollIndex == 10 && d.topgroup !== "amphibian/reptile" ||
                chartScrollIndex == 11 && d.topgroup !== "cat"}
        >
          <circle 
            cx={cx} 
            cy={cy} 
            r={4} 
            fill={"#38425D"} 
            stroke="none" 
            stroke-width={strokeWidth} 
          />
        </g>
      {/if}
    {/each}

    {#each $data[1] as d, i}
      {#if selectedWine === d.id}
        {@const cx = chartScrollIndex >= 5 ? $xGet(d) : $xGet($data[0][4])}
        {@const cy = chartScrollIndex >= 5 ? $yGet(d) : $yGet($data[0][4])}
        {@const animal = d.topgroup}
        <g class="wine-circle wine-circle-{animal}" class:hidden={chartScrollIndex == 14}>
          <circle 
            id="selected-circle"
            cx={cx} 
            cy={cy} 
            r={chartScrollIndex >= 5 ? 6 : 4} 
            fill={"#38425D"}  
            stroke={chartScrollIndex >= 5 ? "#9D0432" : "none"} 
            stroke-width={strokeWidth} 
          />
        </g>
      {/if}
    {/each}
  </g>
{/if}

{#if chartScrollIndex <= 5 || chartScrollIndex == undefined}
    <g class="medians-wrapper">
        {#each $data[0] as d, i}
        {@const cx = $xGet(d)}
        {@const cy = $yGet(d)}
        {@const imageSize = chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                        chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" ? r+30 : r+10}
        {@const animal = d.topGroup.replace(/[/\-\s].*/, '')}
            {#if d.topGroup == "all animals" || d.topGroup == "all wines" }
                {#if chartScrollIndex == undefined || chartScrollIndex < 5}
                    <g class="medians active"
                    class:hidden={chartScrollIndex >= 5}>
                        <circle 
                            cx={cx} 
                            cy={cy} 
                            r={chartScrollIndex == undefined || chartScrollIndex < 3 
                                ? r 
                                : chartScrollIndex == 3 ? 40
                                : 4} 
                            fill={"transparent"} 
                            stroke={"#9D0432"} 
                            stroke-width={strokeWidth} 
                        />
                        {#if chartScrollIndex == undefined || chartScrollIndex <= 3}
                            <text 
                                class="label"
                                x={cx} 
                                y={cy + 2} 
                                text-anchor="middle" 
                                fill={fill}>
                                {d.topGroup}
                            </text>
                        {/if}
                    </g>
                {/if}
            {:else if d.topGroup !== "no animals"}
            <g id={`${animal}-group`} 
                class="groupings"
                class:active={
                    chartScrollIndex == undefined || 
                    chartScrollIndex == 0 || 
                    chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                    chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" ||
                    chartScrollIndex >= 4 }
                class:hidden={chartScrollIndex >= 5}>
                <circle 
                    cx={cx} 
                    cy={cy} 
                    r={chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                        chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" ? 40 : 
                        chartScrollIndex == undefined || chartScrollIndex <= 3 ? r : 4} 
                    fill={fill} 
                    stroke={"none"} 
                    stroke-width={strokeWidth} 
                />
                {#if chartScrollIndex == undefined || chartScrollIndex < 4}
                    <image 
                        href={`assets/images/icons/${animal}.png`} 
                        x={cx - imageSize / 2} 
                        y={cy - imageSize / 2} 
                        width={imageSize} 
                        height={imageSize} 
                    />
                {/if}
            </g>
            {/if}
        {/each}
    </g>
{/if}

<g class="median-markings" class:active={chartScrollIndex >= 7}>
    <line class="priceAVG-gray" x1={0} y1={$yScale(d3.median(rawData, d => d.price))} x2={$width + $padding.right} y2={$yScale(d3.median(rawData, d => d.price))} />
    <line class="ratingAVG-gray" x1={$xScale(d3.median(rawData, d => d.rating))} y1={0} x2={$xScale(d3.median(rawData, d => d.rating))} y2={$height} />

    <line class="priceAVG" x1={0} y1={$yScale($stealPriceNum)} x2={$width + $padding.right} y2={$yScale($stealPriceNum)} />
    <line class="ratingAVG" x1={$xScale($stealRatingNum)} y1={0} x2={$xScale($stealRatingNum)} y2={$height} />
    <text 
        class="label"
        x={$width} 
        y={$yScale(d3.median(rawData, d => d.price)) - 10}
        text-anchor="end"
        fill="white">
        Med. price (${d3.median(rawData, d => d.price)})
    </text>

    <text 
        class="label"
        x={$xScale(d3.median(rawData, d => d.rating)) - 140}
        y={17} 
        transform={`rotate(-90, ${$xScale(d3.median(rawData, d => d.rating))}, 0)`} 
        text-anchor="start"
        fill="white">
        Med. rating ({d3.median(rawData, d => d.rating)} stars)
    </text>
</g>

<g class="trendline" 
    class:active={chartScrollIndex == 6}>
    {#if path}
        <path class="expRegression" d={path} />
    {/if}
</g>

<style>
    .wines-wrapper g.active, .medians-wrapper g.active {
        opacity: 1;
    }

    .wines-wrapper g.hidden, .medians-wrapper g.hidden {
        opacity: 0;
    }

    .wines-wrapper g, .medians-wrapper g {
        opacity: 1;
        transition: opacity 0.4s linear;
    }

	circle {
        opacity: 0.5;
		pointer-events: auto;
        transition: all 0.4s ease-out;
	}

    .medians-wrapper circle {
        opacity: 0.3; 
    }

    .medians-wrapper .active circle {
        opacity: 0.95; 
    }

    #selected-circle {
        opacity: 1;
    }

    image {
        transition: 
            width 0.4s ease-out, 
            height 0.4s ease-out, 
            x 0.4s ease-out, 
            y 0.4s ease-out;
    }

    .label {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--12px);
        fill: var(--wine-dark-tan);;
    }
    .compare-wrapper.hidden {
        opacity: 0;
        transition: opacity 0.4s linear;
    }

    g.trendline, g.compare-lines {
        opacity: 0;
        transition: opacity 0.4s linear;
    }

    g.trendline.active {
        opacity: 1;
    }

    g.compare-lines.active{
        opacity: 0.125;
    }

    g.trendline path {
        stroke: var(--wine-red);
        fill: none;
        stroke-width: 3;
    }

    g.compare-lines path {
        stroke: var(--color-gray-600);
        fill: none;
        stroke-width: 1;
    }

    .priceAVG, .ratingAVG {
        stroke-width: 2;
        stroke: var(--wine-tan);
    }

    .priceAVG-gray, .ratingAVG-gray {
        stroke-width: 2;
        stroke: var(--wine-dark-tan);
    }

    .median-markings {
        opacity: 0;
        transition: opacity 0.4s linear;
    }

    .median-markings.active {
        opacity: 1;
    }

</style>
