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

    const xDomain = tweened(undefined, tweenOptions);
	const yDomain = tweened(undefined, tweenOptions);

    yDomain.set([0,150]);
    xDomain.set([2,5]);

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

    let steepnessValues = [];
    let lowPriceGoodRatingValues = [];
</script>

<section id="scatter">
    <div class="chart-wrapper">
        <h3>{$topgroupSelect}</h3>
        <p class="tot-count">{data.length} wines</p>
        <p class="tot-count">{Math.round(steepness)} avg. steepness</p>
        <p class="tot-count">{Math.round(lowPriceGoodRating/data.length*100)}% ({lowPriceGoodRating}/{data.length})</p>
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                <LayerCake
                    padding={{ top: 10, right: 5, bottom: 20, left: 5 }}
                    x={xKey}
                    y={yKey}
                    xPadding={[padding, padding]}
                    yPadding={[padding, padding]}
                    data={[data, trendLine]}
                    xDomain={$xDomain}
                    yDomain={$yDomain}
                >
                    <Svg>
                        <AxisX 
                            gridlines={true} 
                        />
                        <AxisY 
                            gridlines={true} 
                            ticks={5} />
                        <ScatterSvg {r} fill={color} />
                    </Svg>
                </LayerCake>
        </div>
    </div>
    {#each generations as generation, i}
        {@const randomWines = generateRandomComparison(allWineData)}
        {@const points = randomWines.map(d => ({
            x: +d.rating,  // Convert price to a number
            y: +d.price  // Convert rating to a number
        }))}
        {@const trendLine = regression(points)}
        {@const steepness = calcSteepness(trendLine)}
        {@const avgPrice = d3.mean(randomWines, d => d.price)}
        {@const avgRating = d3.mean(randomWines, d => d.rating)}
        {@const lowPriceGoodRating = randomWines.filter(d => d.price < avgPrice && d.rating > avgRating).length}
    <div class="chart-wrapper">
        <h3>random generation {i+1}</h3>
        <p class="tot-count">{randomWines.length} wines</p>
        <p class="tot-count" style="opacity:0">{Math.round(steepness)} avg. steepness</p>
        <p class="tot-count" style="opacity:0">{Math.round(lowPriceGoodRating/randomWines.length*100)}% ({lowPriceGoodRating}/{randomWines.length})</p>
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                <LayerCake
                    padding={{ top: 10, right: 5, bottom: 20, left: 5 }}
                    x={xKey}
                    y={yKey}
                    xPadding={[padding, padding]}
                    yPadding={[padding, padding]}
                    data={[randomWines, trendLine]}
                    xDomain={$xDomain}
                    yDomain={$yDomain}
                >
                    <Svg>
                        <AxisX 
                            gridlines={true} 
                        />
                        <AxisY 
                            gridlines={true} 
                            ticks={5} />
                        <ScatterSvg {r} fill={color} />
                    </Svg>
                </LayerCake>
        </div>
    </div>
    {/each}
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
</style>