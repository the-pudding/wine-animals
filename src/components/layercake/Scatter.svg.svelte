<script>
	import { getContext, onMount } from "svelte";
	import * as d3 from "d3";
	import * as d3Regression from 'd3-regression';
	import { topgroupSelect } from "$stores/misc.js";
	import rawData from "$data/wineData.csv"

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

	export let r = 4;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;
	export let addRandom = false;

	const meanData = rawData.filter(d => d.price <= 150);

	const regressionLine = $data[1];

	const priceAVG = d3.mean(meanData, d => d.price);
	const ratingAVG = d3.mean(meanData, d => d.rating);

	let path;
	let mounted = false;
	let randomCountNode;
	let randomSteepnessNode;

	onMount(() => {
       path = d3.line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(regressionLine);

		mounted = true;
	});

	const maxLength = 99;
    const generations = Array.from({ length: maxLength + 1 }, (_, i) => i);

	function generateRandomComparison(data) {
        let filteredData = data.filter(d => 
			!d.topgroup.includes($topgroupSelect) && 
			d.topgroup !== "none" && 
			d.topgroup !== "human" && 
			d.price <= 150
		);
		let animalData = data.filter(d => 
			d.topgroup.includes($topgroupSelect) && d.price <= 150
		)
        let shuffled = [...filteredData].sort(() => 0.5 - Math.random());
        let randomData = shuffled.slice(0,animalData.length);

        return randomData
    }

	// Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

	let steepnessValues = [];
	let randomAvgSlope;
	let randomCount;

	function calcSteepness(data, randomData) {
        let sumSlopes = 0;
        data.forEach(point => {
            const [x, y] = point;
            const slope = data.a * data.b * Math.exp(data.b * x);
            sumSlopes += slope;
        });
        const averageSteepness = sumSlopes / data.length;
		steepnessValues.push(averageSteepness)

		if (steepnessValues.length == generations.length) {
			randomAvgSlope = d3.mean(steepnessValues, d => d);
			randomCount = randomData.length;	
		}

        return averageSteepness;
    }

	$: if (mounted) {
		randomSteepnessNode = d3.selectAll("#random-steepness-text");
		if (randomSteepnessNode.node() && randomAvgSlope) {
			randomSteepnessNode.text(`${Math.round(randomAvgSlope)} avg. random steepness`);
        }
    }
</script>

<g class="rect">
	<rect
		class="highlight-quadrant"
		x={$xScale(d3.mean(meanData, d => d.rating))}
		y={$yScale(d3.mean(meanData, d => d.price))}
		width={250 - 23 - $xScale(d3.mean(meanData, d => d.rating))}
		height={210 - $yScale(d3.mean(meanData, d => d.price))}
		fill="#dfdfdf"
		opacity="0.7"
	/>
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
{#if addRandom == true}
	{#each generations as generation, i}
		{@const randomData = generateRandomComparison(meanData)}
		{@const points = randomData.map(d => ({
			x: +d.rating,  // Convert price to a number
			y: +d.price  // Convert rating to a number
		}))}
		{@const trendLine = regression(points)}
		{@const steepness = calcSteepness(trendLine, randomData)}
		{@const pathLocal = d3.line()
			.x(d => $xScale(d[0]))
			.y(d => $yScale(d[1]))
			(trendLine)}
		<g class="lines">
			{#if pathLocal}
				<path class="expRegression fade" d={pathLocal} />
			{/if}
		</g>
	{/each}
{/if}
<g class="lines">
	<line class="priceAVG" x1={0 - $padding.left} y1={$yScale(d3.mean(meanData, d => d.price))} x2={$width + $padding.right} y2={$yScale(d3.mean(meanData, d => d.price))} />
	<line class="ratingAVG" x1={$xScale(d3.mean(meanData, d => d.rating))} y1={0} x2={$xScale(d3.mean(meanData, d => d.rating))} y2={$height} />
	{#if path}
		<path class="expRegression" d={path} />
	{/if}
</g>

<style>
	circle {
		opacity: 0.75;
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
		stroke-width: 1;
		stroke: #000000;
	}
	.fade {
		opacity: 0.25;
		stroke: var(--color-gray-200);
	}
</style>
