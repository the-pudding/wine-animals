<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Canvas } from "layercake";
    import ScatterSvgExplore from "$components/layercake/ScatterExplore.svg.svelte";
    import ScatterCanvas from "$components/layercake/Scatter.canvas.svelte";
    import Voronoi from "$components/layercake/ExploreVoronoi.svelte";
    import { bigScatterData } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
	import * as eases from 'svelte/easing';
	import { searchedWineSTORE } from "../stores/misc";


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
                {#key [$bigScatterData, trendLine]}
                <LayerCake
                    padding={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    x={xKey}
                    y={yKey}
                    data={[$bigScatterData, trendLine]}
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
</section>

<style>
    #scatter-explore {
        width: 100%;
        height: 60svh;
        margin: 4rem auto;
    }

    .chart-wrapper {
        width: 100%;
        height: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 2rem auto;
    }

    .chart-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>