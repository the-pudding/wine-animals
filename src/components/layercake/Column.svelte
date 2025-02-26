<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { hideTooltip } from "$stores/misc.js";
	import * as d3 from "d3";

	const { data, xGet, yGet, yRange, xScale, xDomain, y, x, height } = getContext("LayerCake");

    const dispatch = createEventDispatcher();

	$: columnWidth = (d) => {
		const vals = $xGet(d);
		return Math.max(0, vals[1] - vals[0]);
	};

	$: columnHeight = (d) => {
		return $yRange[0] - $yGet(d);
	};

	$: localHeight = $height;

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
		let color = diff < -5 ? "#8F7233" : diff > 5 ? "#9D0432" : "#38425D"
		return color;
	}

	function handleMouseover(e, d) {
		hideTooltip.set(false);
		let tooltip = d3.select(".tooltip");

		// Get bounding box of `#distribution`
		let containerBounds = document.getElementById("distribution").getBoundingClientRect();

		// Mouse position relative to `#distribution`
		let mouseX = e.clientX - containerBounds.left; // X relative to container
		let mouseY = e.clientY - containerBounds.top; // Y relative to container

		// Get tooltip size
		const tooltipWidth = tooltip.node().offsetWidth;
		const tooltipHeight = tooltip.node().offsetHeight;

		// Default tooltip position (right of cursor)
		let left = mouseX + 15;
		let top = mouseY - tooltipHeight / 2;

		// Prevent tooltip from going off the right edge
		if (mouseX + tooltipWidth + 20 > containerBounds.width) {
			left = mouseX - tooltipWidth - 15; // Move left instead
		}

		// Prevent tooltip from going off the bottom edge
		if (mouseY + tooltipHeight + 20 > containerBounds.height) {
			top = containerBounds.height - tooltipHeight - 15; // Keep it within bounds
		}

		// Prevent tooltip from going off the top
		if (mouseY - tooltipHeight < 0) {
			top = 15; // Keep it inside
		}

		// Set tooltip position relative to `#distribution`
		tooltip
			.style("left", `${left}px`)
			.style("top", `${top}px`)
			.style("opacity", 1)
			.html(
				`<p class="animal"><span class="bolded">${d.animalGroup}</span></p>
				<p class="details"><span class="bolded">${Math.round(d.percent)}%</span> of the wines with this animal are <span class="bolded">${d.bucket}</span> wines</p>`
			);

		// Highlight hovered bar
		d3.selectAll("rect").classed("notHover", true);
		e.target.classList.add("hover");
	}



	function handleMouseleave() {
		hideTooltip.set(true);
		d3.select(".tooltip").style("opacity", 0); // Hide tooltip smoothly
		d3.selectAll("rect").classed("notHover", false).classed("hover", false);
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
			<text class="bucket-text {d.category}-text" x={x + width / 2} y={localHeight + 24} text-anchor="middle">{d.bucket}</text>
		{/if}
	{/each}
</g>

<style>
	rect {
		cursor: pointer;
	}
	rect.notHover {
		opacity: 0.3;
	}

	rect.hover {
		opacity: 1;
	}

	.bucket-text {
		font-size: 14px;
		font-weight: 500;
		font-family: var(--sans);
		fill: var(--wine-tan);
	}

	.price-text:not(:nth-of-type(5n)) {
		display: none;
	}

	.price-text:first-of-type {
		display: inline-block;
	}
</style>