<script>
	import { getContext } from "svelte";
	import { tooltipType, tooltipData, tooltipVisible } from "$stores/misc.js";
	import summaryData from "$data/wineData_summary.csv";
	import viewport from "$stores/viewport.js";

	// SCREENSIZE
	$: w = $viewport.width;
	$: h = $viewport.height;
	$: isMobile = w <= 500;

	const { data, xGet, yGet, yRange, xScale, height } = getContext("LayerCake");

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

	export let stroke = "#000";
	export let strokeWidth = 0;
	export let allWineData;

	function findMatch(object, data) {
		let match = data.find((item) => {
			return item.bucket === object.bucket
		})
		return match
	}

	function colorByCompare(d, i) {
		let match = findMatch(d, allWineData[1]);
		let diff = d.percent - match.percent;

		const isSignificant = d.significant == "true";

		let color = isSignificant && diff > 0 ? "#3E5C4B" 
			: isSignificant && diff < 0 ? "#7b0439"
			: "#38425D";

		return color;
	}

	function handleMouseover(e, d) {
		tooltipType.set("histo")
		let categoryChart = e.target.closest(".chart-wrapper");

		let animalData = $data.filter(v => v.bucket == d.bucket);
		let allData = allWinesSummaryData.filter(v => v.bucket == d.bucket);

		setTooltip([animalData, allData])

		// Highlight hovered bar only within this chart
		categoryChart.querySelectorAll("rect").forEach(rect => rect.classList.add("notHover"));
		e.target.classList.add("hover");
	}

	function setTooltip(data) {
		tooltipVisible.set(true);
		tooltipData.set([data]);
		tooltipType.set("histo");
	}

	function handleMouseleave(e) {
		let parentChart = e.target.closest("#distribution");
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
				role="button"
				tabindex="0"
				aria-label={`Data for ${d.bucket}, ${d.percent}%`}
				class={d.bucket}
				class:active={!isMobile}
				data-id={i}
				{x}
				{y}
				{width}
				{height}
				fill={colorByCompare(d, i)}
				{stroke}
				stroke-width={strokeWidth}
				on:mouseover|preventDefault={(e) => {
					if(!isMobile) handleMouseover(e,d)
				}}
				on:focus={(e) => {
					if(!isMobile) handleMouseover(e,d)
				}}
				on:mouseleave={(e) => {
					if(!isMobile) handleMouseleave(e)
				}}
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
	rect.active {
		cursor: pointer;
	}
	rect.notHover {
		opacity: 0.3;
	}

	rect.hover {
		opacity: 1;
	}

	rect:focus {
		outline: none
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