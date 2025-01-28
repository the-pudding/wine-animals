<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { hideTooltip } from "$stores/misc.js";
	import * as d3 from "d3";

	const { data, xGet, yGet, yRange, xScale, xDomain } = getContext("LayerCake");

    const dispatch = createEventDispatcher();

	console.log({$data})

	$: columnWidth = (d) => {
		const vals = $xGet(d);
		return Math.max(0, vals[1] - vals[0]);
	};

	$: columnHeight = (d) => {
		return $yRange[0] - $yGet(d);
	};

	export let fill = "#c6c6c6";
	export let stroke = "#000";
	export let strokeWidth = 0;
	export let allWineData;

	let isHovered = false;

	function findMatch(object, data) {
		let match = data.find((item) => {
			return item.bucket === object.bucket
		})
		return match
	}

	function colorByCompare(d, i) {
		let match = findMatch(d, allWineData[1])
		let diff = d.percent - match.percent;
		let color = diff < -5 ? "#448b81" : diff > 5 ? "#c35e34" : "#f0ebd7"
		return color;
	}

	function handleMouseover(e, d) {
		isHovered = true;
		hideTooltip.set(false)
		let tooltip = d3.select(".tooltip");
		if (tooltip) {
			tooltip.html(
				`<p class="animal"><span class="bolded">${d.animalGroup}</span></p>
				<p class="details"><span class="bolded">${Math.round(d.percent)}%</span> of the wines with this animal are <span class="bolded">${d.bucket}</span> wines</p>`
			);
			tooltip.style("top", `${e.pageY+10}px`).style("left", `${e.pageX+10}px`);
			d3.selectAll("rect").classed("notHover", true)
			e.target.classList.add("hover");
		}
	}

	function handleMouseleave() {
		hideTooltip.set(true)
		d3.selectAll("rect").classed("notHover", false).classed("hover", false)
	}
</script>

<g>
	{#each $data as d, i}
		{#if d.bucket !== "all"}
			{@const x = $xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}
			{@const y = $yGet(d)}
			{@const width = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
			{@const height = columnHeight(d)}
			<rect
				class={d.bucket}
				data-id={i}
				{x}
				{y}
				{width}
				{height}
				fill={colorByCompare(d, i)}
				{stroke}
				stroke-width={strokeWidth}
				on:mouseover|preventDefault={(e) => handleMouseover(e,d)}
				on:mouseleave={handleMouseleave}
			/>
		{/if}
	{/each}
</g>

<style>
	rect.notHover {
		opacity: 0.6;
	}

	rect.hover {
		opacity: 1;
	}
</style>