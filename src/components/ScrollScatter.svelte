<script>
    import { onMount } from "svelte";
    import { tick } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScrollScatterSvg from "$components/layercake/ScrollScatter.svg.svelte";
    import medianData from "$data/wineData_median.csv"
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import { tweened } from 'svelte/motion';
    import { cubicIn } from 'svelte/easing';
    import { bigScatterData } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import { chartView } from "$stores/misc.js";

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
            xDomain.set([3, 5]);
            yDomain.set([0, 150]);
        }
    }

    $: updateDomains(chartScrollIndex);

    $: {
        if (chartScrollIndex >= 4 && chartScrollIndex < 14) {
            bigScatterData.set(filteredRawData.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle")))
        } else if (chartScrollIndex >= 15) {
            bigScatterData.set(filteredRawData.filter(d => d.topgroup.includes("fish-like")));
        }
    }
</script>

<section id="scatter">
    <div class="chart-container" id="scatterplot" style="pointer-events:none">
        <LayerCake
            padding={{ top: 20, right: 0, bottom: 20, left: 10 }}
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
            </Svg>
        </LayerCake>
        <p class="label label-price">More expensive →</p>
        <p class="label label-rating">Better rating →</p>
    </div>
</section>

<style>
    #scatter {
        height: calc(100% - 4rem);
        aspect-ratio: 1 / 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 5rem;
    }

    .chart-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 2rem;
    }

    .label {
        font-family: var(--sans);
        font-weight: 700;
        text-transform: uppercase;
        font-size: var(--12px);
        color: var(--wine-tan);
        position: absolute;
    }

    .label-price {
        top: 4.25rem;
        left: -2rem;
        transform: rotate(-90deg);
    }

    .label-rating {
        right: 2.5rem;
        bottom: 3.5rem;
        transform: translate(-50%, 0);
    }
</style>