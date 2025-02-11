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
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';


    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");
    const curve = d3.curveLinear;
    const yKey = 'price';
    const xKey = 'rating';
    const xKeyReg = d => +d.rating;
    const yKeyReg = d => +d.price;

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

    // $: console.log({$bigScatterData})

    // Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    $: points = $bigScatterData.map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))
    $: trendLine = regression(points);
    // $: console.log($highlightWine)
</script>

<section id="scatter-explore">
    <div class="chart-wrapper">
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                {#key [filteredRawData, trendLine]}
                <LayerCake
                    padding={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    x={xKey}
                    y={yKey}
                    data={[filteredRawData, trendLine]}
                    xDomain={[2,5]}
                    yDomain={[0,150]}
                >
                    <Svg>
                        <AxisX gridlines={true} ticks={5}/>
                        <AxisY gridlines={true} ticks={4} />
                    </Svg>

                    <Canvas>
                        <ScatterCanvas r={10} fill="#38425D" />
                    </Canvas>

                    <Svg>
                        <ScatterSvgExplore r={6} fill={"#38425D"} addRandom={true} />
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
        height: 100%;
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
        width: 100%;
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