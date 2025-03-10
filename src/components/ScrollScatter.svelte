<script>
    import { onMount } from "svelte";
    import { tick } from "svelte";
    import { fly, fade } from 'svelte/transition';
    import { LayerCake, Svg, Html } from 'layercake';
    import ScrollScatterSvg from "$components/layercake/ScrollScatter.svg.svelte";
    import medianData from "$data/wineData_median.csv"
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import Voronoi from "$components/layercake/ScrollVoronoi.svelte";
    import * as d3 from "d3";
    import { tweened } from 'svelte/motion';
    import { cubicIn } from 'svelte/easing';
    import { bigScatterData } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import { chartView } from "$stores/misc.js";
    import Range from "$components/helpers/Range.svelte";

    export let chartScrollIndex;

    const yKey = 'price';
    const xKey = 'rating';
    const xKeyReg = d => +d.price;
    const yKeyReg = d => +d.rating;

    let catSteals = [];

    medianData.forEach(d => {
        d[xKey] = +d[xKey];
        d[yKey] = +d[yKey];
    });

    const r = 30;
    const padding = 10;
    const color = '#CFCABF';

    let xDomain = tweened([3.7, 4.2], { duration: 2000, easing: cubicIn });
    let yDomain = tweened([20, 35], { duration: 2000, easing: cubicIn });
    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");

    async function updateDomains(chartScrollIndex) {
        if (chartScrollIndex <= 3 || chartScrollIndex == undefined) {
            xDomain.set([3.7, 4.2]);
            yDomain.set([20, 35]);
        } else {
            xDomain.set([3, 4.8]);
            yDomain.set([0, 150]);
        }
    }

    $: updateDomains(chartScrollIndex);

    $:console.log(chartScrollIndex)
</script>

<section id="scatter">
    <div class="chart-container" id="scatterplot">
        {#if chartScrollIndex >= 13 || chartScrollIndex == "exit"}
            <div class="range-wrapper range-rating">
                <Range min={3} max={4.8} step={0.1} metric={"rating"} />
            </div>
            <div class="range-wrapper range-price">
                <Range min={0} max={150} step={1} metric={"price"}/>
            </div>
        {/if}
        <div class="chart-inner">
            <LayerCake
                padding={{ top: 20, right: 10, bottom: 20, left: 10 }}
                x={xKey}
                y={yKey}
                data={[medianData, $bigScatterData]}
                xDomain={$xDomain}
                yDomain={$yDomain}
            >
                <Svg>
                    <AxisX 
                        gridlines={true} 
                        ticks={7}
                    />
                    <AxisY 
                        gridlines={true} 
                        ticks={3} />
                    <ScrollScatterSvg {r} fill={color} {chartScrollIndex} />
                    <Voronoi {chartScrollIndex} />
                </Svg>
            </LayerCake>
        </div>
        {#if chartScrollIndex == 7 || chartScrollIndex == 8}
            <div class="quadrants" transition:fade>
                <p style="left: 30%; top: 40%">Bad Expensive Wine</p>
                <p style="left: 75%; top: 40%">Good Expensive Wine</p>
                <p style="left: 30%; top: 80%">Bad Cheap Wine</p>
                <p style="left: 75%; top: 80%">Good Cheap Wine</p>
            </div>
        {/if}
        <p class="label label-price">More expensive →</p>
        <p class="label label-rating">Better rating →</p>
    </div>
</section>

<style>
    #scatter {
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-bottom: 5rem;
    }

    .chart-container {
        width: 100%;
        height: 100%;
        /* overflow: hidden; */
        padding: 4rem;
        position: relative;
    }

    .chart-inner {
        width: 100%;
        height: 100%;
    }

    .quadrants {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 3rem;
        pointer-events: none;
    }

    .quadrants p {
        position: absolute;
        font-family: var(--sans);
        font-weight: 700;
        font-size: var(--18px); 
        transform: translate(-50%, -50%);
        color: var(--wine-tan);
        text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
    }

    .label {
        font-family: var(--sans);
        font-weight: 700;
        text-transform: uppercase;
        font-size: var(--12px);
        color: var(--wine-dark-tan);
        position: absolute;
    }

    .label-price {
        top: 7.25rem;
        left: 0rem;
        transform: rotate(-90deg);
    }

    .label-rating {
        right: 0.5rem;
        bottom: 1.5rem;
        transform: translate(-50%, 0);
    }

    .range-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        padding: 5rem 4rem 5.25rem 4.5rem;
        pointer-events: none;
    }

    @media(max-width: 700px) {
        .chart-container {
            padding: 2rem;
        }

        .label-price {
            top: 5.25rem;
            left: -1.75rem;
        }

        .label-rating {
            bottom: -0.25rem;
            right: -0.75rem;
        }

        .quadrants p {
            font-size: var(--16px); 
        }
    }
</style>