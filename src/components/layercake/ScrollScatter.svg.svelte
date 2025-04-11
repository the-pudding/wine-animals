<script>
	import { getContext, onMount } from "svelte";
    import { tick } from "svelte";
    import { writable } from 'svelte/store';
	import { line } from 'd3-shape';
	import { median } from 'd3-array';
    import * as d3Regression from 'd3-regression';
    import rawData from "$data/wineData.csv";
    import { animalSelected, stealPriceNum, stealRatingNum, stealData, withFiltersData } from "$stores/misc.js";
	import { stealTopgroupCounts } from "../../stores/misc";

    export let r = Math.min(36, Math.max(20, $width / 20));
	export let strokeWidth = 2;
    export let chartScrollIndex;

	const { data, xGet, yGet, xScale, yScale, width, height } = getContext("LayerCake");

    const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "human",
		"marine invertebrate", "mythical creature", "none", "pachyderm", "pig",
		"rabbit", "sheep"
	];

    $: r = Math.min(30, Math.max(20, $width / 30));
    $: smallestR = 5;
    $: expandedSmallestR = 10;
    $: selectedWine = $animalSelected == "cat" ? "161008470"
        : $animalSelected == "bird" ? "173188559"
        : $animalSelected == "pig" ?"171574314"
        : "161239002";

    // Trendline
    const regression = d3Regression.regressionLog()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    $: pointData = chartScrollIndex == 9
        ? $data[1].filter(d => d.topgroup.includes("amphibian/reptile"))
        : chartScrollIndex == 10
        ? $data[1].filter(d => d.topgroup.includes("pig"))
        : chartScrollIndex == 11
        ? $data[1].filter(d => d.topgroup.includes("cat") || !d.topgroup.includes("cattle"))
        : chartScrollIndex == 12
        ? $data[1].filter(d => d.topgroup.includes("bird"))
        : $data[1];

    $: points = pointData.map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))

    $: trendLine = regression(points);

    $: path = line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(trendLine);

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

    $: stealTopgroupCounts.set(topgroupCounts);
</script>

<g class="median-markings" class:active={chartScrollIndex >= 7 || chartScrollIndex == "exit"}>
    <rect
        class="highlight-quadrant"
        x={$xScale($stealRatingNum)}
        y={$yScale($stealPriceNum)}
        width={$width - $xScale($stealRatingNum)}
        height={$height - $yScale($stealPriceNum)}
        fill="#363B45"
        opacity={chartScrollIndex >= 8 ? 0.3 : 0}
    />
</g>

{#if chartScrollIndex >= 4 || chartScrollIndex == "exit"}
  <g class="wines-wrapper">
    {#each $data[1] as d, i}
      {#if selectedWine !== d.id}
        {@const cx = chartScrollIndex >= 5 || chartScrollIndex == "exit" ? $xGet(d) : $xGet($data[0][4])}
        {@const cy = chartScrollIndex >= 5 || chartScrollIndex == "exit" ? $yGet(d) : $yGet($data[0][4])}
        {@const animal = d.topgroup}
        <g class="wine-circle wine-circle-{animal}" 
            class:hidden={chartScrollIndex == 9 && !d.topgroup.includes("amphibian/reptile") ||
                chartScrollIndex == 10 && !d.topgroup.includes("pig") ||
                chartScrollIndex == 11 && !d.topgroup.includes("cat") 
                || chartScrollIndex == 12 && !d.topgroup.includes("bird")
                || chartScrollIndex == 13 && !d.topgroup.includes("bird")} 
            class:filteredOut={
                !$withFiltersData.some(f => f.id === d.id) && (chartScrollIndex == 14 || chartScrollIndex == "exit")
            }
        >
          <circle 
            id={`circle-${d.id}`}
            cx={cx} 
            cy={cy} 
            r={smallestR} 
            fill={(
                d.price <= $stealPriceNum 
                && d.rating >= $stealRatingNum
                && (chartScrollIndex >= 8 || chartScrollIndex =="exit") ? "#3E5C4B" : "#475171")} 
            stroke="none" 
            stroke-width={strokeWidth} 
            opacity={0.8}
          />
        </g>
      {/if}
    {/each}

    {#each $data[1] as d, i}
      {#if selectedWine === d.id}
        {@const cx = chartScrollIndex >= 5 || chartScrollIndex == "exit" ? $xGet(d) : $xGet($data[0][4])}
        {@const cy = chartScrollIndex >= 5 || chartScrollIndex == "exit" ? $yGet(d) : $yGet($data[0][4])}
        {@const animal = d.topgroup}
        <g class="wine-circle wine-circle-{animal} selected-circle" 
            class:hidden={chartScrollIndex == 9 && !d.topgroup.includes("amphibian/reptile") ||
               chartScrollIndex == 10 && !d.topgroup.includes("pig") ||
               chartScrollIndex == 11 && !d.topgroup.includes("cat") 
               || chartScrollIndex == 12 && !d.topgroup.includes("bird")
               || chartScrollIndex == 13 && !d.topgroup.includes("bird")} 
            class:filteredOut={
                !$withFiltersData.some(f => f.id === d.id) && (chartScrollIndex == 14 || chartScrollIndex == "exit")
            }
               >
          <circle 
            id={`circle-${d.id}`}
            cx={cx} 
            cy={cy} 
            r={chartScrollIndex >= 5 && chartScrollIndex < 14 ? expandedSmallestR : smallestR} 
            class:filteredOut={
                !$withFiltersData.some(f => f.id === d.id) && (chartScrollIndex == 14 || chartScrollIndex == "exit")
            }
            fill={(
                d.price <= $stealPriceNum 
                && d.rating >= $stealRatingNum
                && chartScrollIndex >= 8) ? "#3E5C4B" : "#475171"} 
            stroke={chartScrollIndex >= 5 && chartScrollIndex < 14 ? "#F7B956" : "none"} 
            stroke-width={strokeWidth} 
            opacity={chartScrollIndex == 14 || chartScrollIndex == "exit" ? 1 : 1}
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
        {@const imageSize = chartScrollIndex == 2 && animal == "cattle" || chartScrollIndex == 2 && animal == "pig" || chartScrollIndex == 2 && animal == "sheep" ||
                        chartScrollIndex == 3 && animal == "cat" || chartScrollIndex == 3 && animal == "bear" || chartScrollIndex == 3 && animal == "mythicalcreature" ? r+20 : r+10}
        {@const animal = d.topGroup.replace(/[^a-zA-Z0-9]/g, "")}
            {#if d.topGroup == "animal wines" || d.topGroup == "all wines" }
                {#if chartScrollIndex == undefined || chartScrollIndex < 5}
                    <g class="medians active"
                    class:hidden={chartScrollIndex >= 5}>
                        <circle 
                            cx={cx} 
                            cy={cy} 
                            r={chartScrollIndex == undefined || chartScrollIndex == 0 || chartScrollIndex == 2 || chartScrollIndex == 3
                                ? r 
                                : chartScrollIndex == 1 ? r+5
                                : smallestR} 
                            fill={"transparent"} 
                            stroke={"#7b0439"} 
                            stroke-width={strokeWidth} 
                        />
                        {#if chartScrollIndex == undefined || chartScrollIndex <= 3}
                            <text 
                                class="label-dashed"
                                x={cx + r+4} 
                                y={cy + 22} 
                                text-anchor="start" 
                                fill={"#CFCABF"}>
                                {d.topGroup}
                            </text>
                        {/if}
                    </g>
                {/if}
            {:else if d.topGroup !== "all" && d.topGroup !== "animal wines"}
            <g id={`${animal}-group`} 
                class="groupings"
                class:active={
                    chartScrollIndex == undefined || 
                    chartScrollIndex == 0 || 
                    chartScrollIndex == 2 && animal == "cattle" || chartScrollIndex == 2 && animal == "pig" || chartScrollIndex == 2 && animal == "sheep" ||
                    chartScrollIndex == 3 && animal == "cat" || chartScrollIndex == 3 && animal == "bear" || chartScrollIndex == 3 && animal == "mythicalcreature" ||
                    chartScrollIndex >= 4 }
                class:hidden={chartScrollIndex >= 5}>
                <circle 
                    cx={cx} 
                    cy={cy} 
                    r={chartScrollIndex == 2 && animal == "cattle" || chartScrollIndex == 2 && animal == "pig" || chartScrollIndex == 2 && animal == "sheep" ||
                        chartScrollIndex == 3 && animal == "cat" || chartScrollIndex == 3 && animal == "bear" || chartScrollIndex == 3 && animal == "mythicalcreature" ? r+5 : 
                        chartScrollIndex == undefined || chartScrollIndex <= 3 ? r : smallestR} 
                    fill={"#CFCABF"} 
                    stroke={$animalSelected == d.topGroup ? "#F7B956" : "none"} 
                    stroke-width={3} 
                />
                {#if chartScrollIndex == undefined || chartScrollIndex < 4}
                    <image 
                        href={`assets/images/icons/${animal.replace(/[^a-zA-Z0-9]/g, "")}.png`} 
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

<g class="trendline" 
    class:active={chartScrollIndex >= 6 || chartScrollIndex == "exit"}>
    {#if path}
        <path class="expRegression" d={path} />
    {/if}
</g>

<g class="median-markings" class:active={chartScrollIndex >= 7 || chartScrollIndex == "exit"}>
    <line class="priceAVG-gray" x1={0} y1={$yScale(29.99)} x2={$width} y2={$yScale(29.99)} />
    <line class="ratingAVG-gray" x1={$xScale(median(rawData, d => d.rating))} y1={0} x2={$xScale(median(rawData, d => d.rating))} y2={$height} />

    <line class="priceAVG" x1={0} y1={$yScale($stealPriceNum)} x2={$width} y2={$yScale($stealPriceNum)} />
    <line class="ratingAVG" x1={$xScale($stealRatingNum)} y1={0} x2={$xScale($stealRatingNum)} y2={$height} />
    <text 
        class="label"
        x={$width-20} 
        y={$yScale(29.99) - 10}
        text-anchor="end"
        fill="white">
        Med. price ($29.99)
    </text>

    <text 
        class="label"
        x={$xScale(median(rawData, d => d.rating)) - 160}
        y={17} 
        transform={`rotate(-90, ${$xScale(median(rawData, d => d.rating))}, 0)`} 
        text-anchor="start"
        fill="white">
        Med. rating ({median(rawData, d => d.rating)} stars)
    </text>
</g>

<style>
    .highlight-quadrant {
        transition: opacity var(--500ms);
    }
    .wines-wrapper g.active, .medians-wrapper g.active {
        opacity: 1;
    }

    .wines-wrapper g.hidden, .medians-wrapper g.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .wines-wrapper g.filteredOut {
        opacity: 0.1;
        pointer-events: none;
    }

    .wines-wrapper g, .medians-wrapper g {
        opacity: 1;
        transition: opacity var(--750ms) linear;
    }

	circle {
        opacity: 0.5;
		pointer-events: auto;
        transition: all var(--500ms) ease-out;
	}

    .selected-circle circle {
        opacity: 1;
    }

    .medians-wrapper circle {
        opacity: 0.3; 
    }

    .medians circle {
        stroke-dasharray: 3px;
    }

    .medians-wrapper .active circle {
        opacity: 0.95; 
    }

    image {
        transition: 
            width var(--500ms) ease-out, 
            height var(--500ms) ease-out, 
            x var(--500ms) ease-out, 
            y var(--500ms) ease-out;
    }

    .label {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--12px);
        fill: var(--wine-dark-tan);
    }

    .label-dashed {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--12px);
        fill: #a10f50;
    }
    .compare-wrapper.hidden {
        opacity: 0;
        transition: opacity var(--500ms) linear;
    }

    g.trendline, g.compare-lines {
        opacity: 0;
        transition: opacity var(--500ms) linear;
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
        stroke-width: 2;
    }

    .priceAVG, .ratingAVG {
        stroke-width: 1;
        stroke: var(--wine-tan);
    }

    .priceAVG-gray, .ratingAVG-gray {
        stroke-width: 1;
        stroke: var(--wine-dark-tan);
        stroke-dasharray: 3;
    }

    .median-markings {
        opacity: 0;
        transition: opacity var(--500ms) linear;
    }

    .median-markings.active {
        opacity: 1;
    }

</style>
