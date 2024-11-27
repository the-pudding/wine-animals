<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Canvas } from "layercake";
    import ScatterSvgExplore from "$components/layercake/ScatterExplore.svg.svelte";
    import ScatterCanvas from "$components/layercake/Scatter.canvas.svelte";
    import Voronoi from "$components/layercake/Voronoi.svelte";
    import { bigScatterData } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';


    const filteredRawData = rawData.filter(d => d.price <= 100 && d.topgroup !== "none");
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

    $: console.log({$bigScatterData})

    // Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    $: points = $bigScatterData.map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))
    $: trendLine = regression(points);
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
                    yDomain={[0,100]}
                >
                    <Svg>
                        <AxisX gridlines={true} ticks={5}/>
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
</section>

<style>
    #scatter-explore {
        width: 100%;
        max-width: 800px;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin: 0 auto 5rem auto;
    }
    .report {
        background: var(--color-gray-100);
        width: 100%;
        padding: 1rem;
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