<script>
	import { getContext } from "svelte";
	import * as d3 from "d3";

	const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let r = 4;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;

	const regressionLine = $data[1];

	const priceAVG = d3.mean($data[0], d => d.price);
	const ratingAVG = d3.mean($data[0], d => d.rating);
	

	console.log($xScale.domain(), $yScale.domain())
	console.log($xScale.range(), $yScale.range())
	// console.log($data[1])
	// console.log($xScale(regressionLine[0][0]), $yScale(regressionLine[0][1]));
	
	const path = d3.line()
		.x(d => $xScale(d[0]))
		.y(d => $yScale(d[1]))
		(regressionLine);

		console.log('Generated path:', path);
</script>

<g>
	{#each $data[0] as d}
		{@const cx = $xGet(d)}
		{@const cy = $yGet(d)}
		<circle {cx} {cy} {r} {fill} {stroke} stroke-width={strokeWidth} />
	{/each}
</g>
<g class="lines">
	<line class="priceAVG" x1={0} y1={$yScale(d3.mean($data[0], d => d.price))} x2={250} y2={$yScale(d3.mean($data[0], d => d.price))} />
	<line class="ratingAVG" x1={$xScale(d3.mean($data[0], d => d.rating))} y1={0} x2={$xScale(d3.mean($data[0], d => d.rating))} y2={220} />
	<line class="regression" x1={$xScale($data[1][0].x)} y1={$yScale($data[1][0].y)} x2={$xScale($data[1][1].x)} y2={$yScale($data[1][1].y)} />
	<path class="expRegression" d={path} />
</g>

<style>
	circle {
		opacity: 0.75;
		stroke-width: 1;
		stroke: white;
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
</style>
