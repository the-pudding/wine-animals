<script>
	import { getContext, onMount } from "svelte";
    import { tick } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
	import * as d3 from "d3";

	const { data, xGet, yGet, xScale, yScale, width, height, padding, xDomain, yDomain } = getContext("LayerCake");

	export let r = 30;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 2;
    export let chartScrollIndex;
</script>

{#if chartScrollIndex >= 4}
    {#each $data[1] as d, i}
    {@const cx = chartScrollIndex >= 5 ? $xGet(d) : $xGet($data[0][4])}
    {@const cy = chartScrollIndex >= 5 ? $yGet(d) : $yGet($data[0][4])}
    {@const animal = d.topgroup}
        <g class="wine-circle wine-circle-{animal}">
            <circle 
                cx={cx} 
                cy={cy} 
                r={4} 
                fill={fill} 
                stroke={"none"} 
                stroke-width={strokeWidth} 
            />
        </g>
    {/each}
{/if}

{#if chartScrollIndex <= 5 || chartScrollIndex == undefined}
    {#each $data[0] as d, i}
    {@const cx = $xGet(d)}
    {@const cy = $yGet(d)}
    {@const imageSize = chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                    chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" || chartScrollIndex == 3 && animal == "cat" ? r+30 : r+10}
    {@const animal = d.topGroup.replace(/[/\-\s].*/, '')}
        {#if d.topGroup == "no animals" || d.topGroup == "all animals" || d.topGroup == "all wines" }
            {#if chartScrollIndex == undefined || chartScrollIndex < 4 }
                <g class="medians active"
                class:hidden={chartScrollIndex >= 3}>
                    <circle 
                        cx={cx} 
                        cy={cy} 
                        r={r} 
                        fill={"transparent"} 
                        stroke={"#9D0432"} 
                        stroke-width={strokeWidth} 
                    />
                    <text 
                        class="label"
                        x={cx} 
                        y={cy + 2} 
                        text-anchor="middle" 
                        fill={fill}>
                        {d.topGroup}
                    </text>
                </g>
            {/if}
        {:else}
        <g id={`${animal}-group`} 
            class="groupings"
            class:active={
                chartScrollIndex == undefined || 
                chartScrollIndex == 0 || 
                chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" ||
                chartScrollIndex >= 3 && animal == "cat"}
            class:hidden={chartScrollIndex >= 3 && animal !== "cat" || chartScrollIndex >= 5}>
            <circle 
                cx={cx} 
                cy={cy} 
                r={chartScrollIndex == 1 && animal == "cattle" || chartScrollIndex == 1 && animal == "pig" ||
                    chartScrollIndex == 2 && animal == "cat" || chartScrollIndex == 2 && animal == "bear" || chartScrollIndex == 2 && animal == "mythical" || chartScrollIndex == 3 && animal == "cat" ? 40 : 
                    chartScrollIndex == undefined || chartScrollIndex < 5 ? r : 4} 
                fill={fill} 
                stroke={"none"} 
                stroke-width={strokeWidth} 
            />
            {#if chartScrollIndex == undefined || chartScrollIndex < 5}
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
{/if}

<style>
    g.active {
        opacity: 1;
    }

    g.hidden {
        opacity: 0;
    }

    g {
        opacity: 0.125;
        transition: opacity 0.4s linear;
    }

	circle {
        opacity: 0.85;
		pointer-events: auto;
        stroke-dasharray: 4;
        transition: all 0.4s ease-out;
	}

    g.wine-circle {
        opacity: 0.5;
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
        font-size: var(--14px);
    }
</style>
