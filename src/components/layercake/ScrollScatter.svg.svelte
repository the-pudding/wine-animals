<script>
	import { getContext, onMount } from "svelte";
	import * as d3 from "d3";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

	export let r = 30;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 2;

    console.log({$data})

</script>
<g>
	{#each $data[0] as d, i}
        {@const cx = $xGet(d)}
        {@const cy = $yGet(d)}
        {@const imageSize = 40}
        {@const animal = d.topGroup.replace(/[/\-\s].*/, '')}
        <circle 
            cx={cx} 
            cy={cy} 
            r={r} 
            fill={d.topGroup !== "no animals" && d.topGroup !== "all animals" && d.topGroup !== "all wines" ? fill : "transparent"} 
            stroke={d.topGroup !== "no animals" && d.topGroup !== "all animals" && d.topGroup !== "all wines" ? "no animals" : "#9D0432"} 
            stroke-width={strokeWidth} 
        />
        {#if d.topGroup !== "no animals" && d.topGroup !== "all animals" && d.topGroup !== "all wines" }
            <image 
                href={`assets/images/icons/${animal}.png`} 
                x={cx - imageSize / 2} 
                y={cy - imageSize / 2} 
                width={imageSize} 
                height={imageSize} 
            />
        {/if}
        {#if d.topGroup == "no animals" || d.topGroup == "all animals" || d.topGroup == "all wines" }
            <text 
                class="label"
                x={cx} 
                y={cy + 2} 
                text-anchor="middle" 
                fill={fill}>
                {d.topGroup}
            </text>
        {/if}
    {/each}
</g>

<style>
	circle {
        opacity: 0.85;
		pointer-events: auto;
        stroke-dasharray: 4;
	}

    .label {
        text-transform: uppercase;
        font-weight: 700;
        font-family: var(--sans);
        font-size: var(--14px);
    }
</style>
