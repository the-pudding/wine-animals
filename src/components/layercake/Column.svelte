<script>
	import { getContext, createEventDispatcher } from "svelte";

	const { data, xGet, yGet, yRange, xScale } = getContext("LayerCake");
      
    const dispatch = createEventDispatcher();

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

	function findMatch(object, data) {
		return data.find(item => item.priceBucket === object.priceBucket);
	}

	function colorByCompare(d, i) {
		let match = findMatch(d, allWineData)
		let diff = d.percent - match.percent;
		let color = diff < -5 ? "#448b81" : diff > 5 ? "#c35e34" : "#f0ebd7"
		return color;
	}
</script>

<g on:mouseout={(e) => dispatch("mouseout")}>
	{#each $data as d, i}
		{#if d.priceBucket !== "all"}
			{@const x = $xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}
			{@const y = $yGet(d)}
			{@const width = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
			{@const height = columnHeight(d)}
			<rect
				class={d.priceBucket}
				data-id={i}
				{x}
				{y}
				{width}
				{height}
				fill={colorByCompare(d, i)}
				{stroke}
				stroke-width={strokeWidth}
				on:mouseover={(e) => dispatch("mousemove", { e, props: d })}
			/>
		{/if}
	{/each}
</g>
