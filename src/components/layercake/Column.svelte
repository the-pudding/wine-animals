<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { tooltipType } from "$stores/misc.js";
	import * as d3 from "d3";
	import summaryData from "$data/wineData_summary.csv";

	const { data, xGet, yGet, yRange, xScale, xDomain, y, x, height } = getContext("LayerCake");

    const dispatch = createEventDispatcher();

	const countryAbbrev = [
        {country: "France", abbrev: "FR"},
        {country: "United States", abbrev: "US"},
        {country: "Italy", abbrev: "IT"},
        {country: "Spain", abbrev: "ES"},
        {country: "Argentina", abbrev: "AR"},
        {country: "Portugal", abbrev: "PT"},
        {country: "South Africa", abbrev: "ZA"},
        {country: "Australia", abbrev: "AU"},
        {country: "Germany", abbrev: "DE"},
        {country: "Chile", abbrev: "CL"},
        {country: "New Zealand", abbrev: "NZ"},
        {country: "Austria", abbrev: "AT"},
    ];

	const allWinesSummaryData = summaryData.filter(d => d.animalGroup == "all");

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
		let color = diff < -5 ? "#7b0439" : diff > 5 ? "#4b6a1e" : "#38425D"
		return color;
	}

	function handleMouseover(e, d) {
		let categoryChart = e.target.closest(".chart-wrapper");

		tooltipType.set("histo")

		setTooltip(d)

		// Highlight hovered bar only within this chart
		categoryChart.querySelectorAll("rect").forEach(rect => rect.classList.add("notHover"));
		e.target.classList.add("hover");
	}

	function setTooltip(d) {
		let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", true);

		let relevantData = allWinesSummaryData.filter(v => v.bucket == d.bucket);

		console.log(relevantData)

		let text = d.category == "price" 
			? `<p class="details">
					<span class="bolded">${Math.round(d.percent)}%</span> 
					of <span class="bolded">${d.animalGroup}</span> wines 
					cost between <span class="bolded">$${d.bucket}</span>,
					compared to <span class="bolded">${Math.round(relevantData[0].percent)}%</span> of all wines 
					</p>`
			: d.category == "rating" 
			? `<p class="details">
					<span class="bolded">${Math.round(d.percent)}%</span> 
					of <span class="bolded">${d.animalGroup}</span> wines 
					are rated between <span class="bolded">${d.bucket} stars</span>,
					compared to <span class="bolded">${Math.round(relevantData[0].percent)}%</span> of all wines 
					</p>`
			: d.category == "type"
			? `<p class="details">
					<span class="bolded">${Math.round(d.percent)}%</span> 
					of <span class="bolded">${d.animalGroup}</span> wines 
					are <span class="bolded">${d.bucket}</span> wines,
					compared to <span class="bolded">${Math.round(relevantData[0].percent)}%</span> of all wines 
					</p>`
			: `<p class="details">
					<span class="bolded">${Math.round(d.percent)}%</span> 
					of <span class="bolded">${d.animalGroup}</span> wines 
					are from <span class="bolded">${d.bucket}</span>,
					compared to <span class="bolded">${Math.round(relevantData[0].percent)}%</span> of all wines 
					</p>` 
		;

		tooltip.select(".summary").html(text)
		
	}




function handleMouseleave(e) {

    let parentChart = e.target.closest("#distribution");
    let tooltip = parentChart?.querySelector(".tooltip");

    if (tooltip) tooltip.style.opacity = 0; // Hide tooltip smoothly
    parentChart?.querySelectorAll("rect").forEach(rect => rect.classList.remove("notHover", "hover"));
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
			<text class="bucket-text {d.category}-text" x={x + width / 2} y={localHeight + 24} text-anchor="middle">
				{#if d.category == "country"}
					{countryAbbrev[i].abbrev}
				{:else if d.category == "price"}
					{#if d.bucket == "50–59.99" || d.bucket == "100–109.99" || d.bucket == "150+"}
						${d.bucket}
					{:else if d.bucket == "<10"}
						{"<$10"}
					{/if}
				{:else}
					{d.bucket}
				{/if}
			</text>
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
		fill: var(--wine-dark-tan);
	}

	@media (max-width: 700px) {
		.bucket-text {
			font-size: var(--12px);
		}
	}

	/* .price-text:not(:nth-of-type(5n)) {
		display: none;
	}

	.price-text:first-of-type {
		display: inline-block;
	} */
</style>