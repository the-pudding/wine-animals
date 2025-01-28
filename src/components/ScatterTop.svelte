<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";
    import { animalSelect, topgroupSelect } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv"

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';

    export let data;

    const maxLength = 19;
    const generations = Array.from({ length: maxLength + 1 }, (_, i) => i);

    const curve = d3.curveLinear;
    const yKey = 'price';
    const xKey = 'rating';
    const xKeyReg = d => +d.rating;
    const yKeyReg = d => +d.price;

    data.forEach(d => {
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

    const points = data.map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))
    const trendLine = regression(points);

    function calcSteepness(data) {
        let sumSlopes = 0;
        data.forEach(point => {
            const [x, y] = point;
            const slope = data.a * data.b * Math.exp(data.b * x);
            sumSlopes += slope;
        });
        const averageSteepness = sumSlopes / data.length;
        return averageSteepness;
    }

    const steepness = calcSteepness(trendLine);

    const avgPrice = d3.mean(data, d => d.price);
    const avgRating = d3.mean(data, d => d.rating);
    const lowPriceGoodRating = data.filter(d => d.price < avgPrice && d.rating > avgRating).length;

    function generateRandomComparison() {
        let filteredData = allWineData.filter(d => 
			!d.topgroup.includes($topgroupSelect) && 
			d.topgroup !== "none" && 
			d.topgroup !== "human" && 
			d.price <= 150
		);
        let shuffled = [...filteredData].sort(() => 0.5 - Math.random());
        let randomData = shuffled.slice(0,data.length);

        return randomData
    }

    let randomAvgSlope;
	let randomCount;
</script>

<section id="scatter">
    <div class="chart-wrapper chart-top">
        <h3>{$topgroupSelect}</h3>
        <p class="tot-count">{data.length} wines</p>
        <p class="tot-count">{Math.round(steepness)} avg. steepness</p>
        <p class="tot-count" id="random-steepness-text"> avg. randomg steepness</p>
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                <LayerCake
                    padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
                    x={xKey}
                    y={yKey}
                    data={[data, trendLine]}
                    xDomain={[2,5]}
                    yDomain={[0,150]}
                >
                    <Svg>
                        <AxisX 
                            gridlines={true} 
                            ticks={5}
                        />
                        <AxisY 
                            gridlines={true} 
                            ticks={4} />
                        <ScatterSvg {r} fill={color} addRandom={true} />
                    </Svg>
                </LayerCake>
        </div>
    </div>
</section>

<style>
    #scatter {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 5rem;
    }
    .report {
        background: var(--color-gray-100);
        width: 100%;
        padding: 1rem;
    }

    .chart-wrapper {
        width: 100%;
        max-width: 250px;
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
        height: 250px;
        overflow: hidden;
    }

    .chart-top .chart-container {
        height: 480px;
        padding-right: 3px;
    }
</style>