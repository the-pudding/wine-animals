<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';

    export let data;

    const topgroups = ["amphibian/reptile", "bat", "bear", "bird", "camelus", "cat", "cattle",
        "deer-like", "dog", "elephant", "fish", "hippo", "horse", "human", "insect",
        "marine invertebrate", "marsupial", "monkey", "mustelid-like", "mythical", "none",
        "rabbit", "ram-like", "rhino", "rodent-like", "suid", "whale/shark/dolphin"  
    ];

    function filterData(animal) {
        let filteredData = animal !== "cat"
            ? data.filter(d => d.topgroup.includes(animal))
            : data.filter(d => d.topgroup.includes(animal) && !d.topgroup.includes("cattle"));

        return filteredData;
    }

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

    yDomain.set([0,500]);
    xDomain.set([2,5]);

    // Regression Line
    const regression = d3Regression.regressionLinear()
        .x(d => xKeyReg(d)) // Define the x accessor
        .y(d => yKeyReg(d)); // Define the y accessor

    function calcSlope(data) {
        let deltaX = data[1].x - data[0].x;
        let deltaY = data[1].y - data[0].y;
        let slope = deltaY / deltaX;

        return slope
    }
</script>

<section id="scatter">
        {#each topgroups as animal, i}
            {@const animalData = filterData(animal)}
            {@const trendLine = regression(animalData)}
            {@const trendLineData = [
                { x: trendLine[0][0], y: trendLine[0][1] },
                { x: trendLine[1][0], y: trendLine[1][1] }
              ]}
            {@const slope = calcSlope(trendLineData)}
            <div class="chart-wrapper">
                <h3>{animal}</h3>
                <p class="tot-count">{animalData.length} wines</p>
                <p class="tot-count">{Math.round(slope)} slope</p>
                <div class="chart-container" id="scatterplot" style="pointer-events:none">
                        <LayerCake
                            padding={{ top: 10, right: 5, bottom: 20, left: 5 }}
                            x={xKey}
                            y={yKey}
                            xPadding={[padding, padding]}
                            yPadding={[padding, padding]}
                            data={[animalData, trendLineData]}
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
        margin-bottom: 5rem;
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