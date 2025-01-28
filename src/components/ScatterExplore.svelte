<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Canvas } from "layercake";
    import ScatterSvgExplore from "$components/layercake/ScatterExplore.svg.svelte";
    import ScatterCanvas from "$components/layercake/Scatter.canvas.svelte";
    import Voronoi from "$components/layercake/Voronoi.svelte";
    import { bigScatterData, highlightWine } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import flippedExponential from "$utils/flippedExponential";
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';


    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");
    const curve = d3.curveLinear;
    const yKey = 'rating';
    const xKey = 'price';
    const xKeyReg = d => +d.price;
    const yKeyReg = d => +d.rating;

    $bigScatterData.forEach(d => {
        d[xKey] = +d[xKey];
        d[yKey] = +d[yKey];
    });

    const r = 4;
    const padding = 10;
    const color = '#d0c8a8';

    const tweenOptions = {
		duration: 300,
		easing: eases.cubicInOut
	};

    // Regression Line
    const regression = flippedExponential()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y) // Accessor for y value
        .domain([0,150]);

    $: points = $bigScatterData.map(d => ({
        x: +d.price,  // Convert price to a number
        y: +d.rating  // Convert rating to a number
    }))

    $: trendLine = regression(points);

    $: console.log({$bigScatterData})
</script>

<section id="scatter-explore">
    <div class="chart-wrapper">
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                {#key [filteredRawData, trendLine]}
                <LayerCake
                    padding={{ top: 20, right: 20, bottom: 20, left: 0 }}
                    x={xKey}
                    y={yKey}
                    data={[filteredRawData, trendLine]}
                    yDomain={[2,5]}
                    xDomain={[0,150]}
                >
                    <Svg>
                        <AxisX gridlines={true} />
                        <AxisY gridlines={true} ticks={4} />
                    </Svg>

                    <Canvas>
                        <ScatterCanvas r={r * 1.5} fill="#0cf" />
                    </Canvas>

                    <Svg>
                        <ScatterSvgExplore {r} fill={color} addRandom={true} />
                        <Voronoi stroke="#333"/>
                    </Svg>
                </LayerCake>
                {/key}
        </div>
    </div>
    <div class="tooltip-details">
        {#if $highlightWine !== undefined}
            <p>{$highlightWine.year}</p>
            <p>{$highlightWine.name}</p>
            <p>Winery: {$highlightWine.winery}</p>
            <p>Type: {$highlightWine.type}</p>
            <p>Country:{$highlightWine.country}</p>
            <p>Animal: {$highlightWine.topgroup}</p>
            <p>Price: ${$highlightWine.price}</p>
            <p>Rating: {$highlightWine.rating}</p>
            <img src="https://{$highlightWine.imageUrl}" />
        {/if}
    </div>
</section>

<style>
    #scatter-explore {
        width: 100%;
        max-width: 1200px;
        height: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 0 auto 5rem auto;
    }
    .report {
        background: var(--color-gray-100);
        width: 100%;
        padding: 1rem;
    }
    .tooltip-details {
        width: 300px;
        height: 100%;
        padding: 32px 0;
        color: var(--color-white);
        font-family: var(--sans);
    }
    .chart-wrapper {
        width: calc(100% - 300px);
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 2rem;
    }
    .chart-top {
        max-width: 500px;
    }
    h3 {
        font-family: var(--sans);
        font-size: var(--14px);
        font-weight: 700;
        text-align: center;
        margin: 0;
    }

    .tot-count {
        font-family: var(--sans);
        font-size: var(--14px);
        text-align: center;
        margin: 0 0;
        font-size: 0.8rem;
    }

    .chart-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .chart-top .chart-container {
        height: 480px;
        padding-right: 3px;
    }
</style>