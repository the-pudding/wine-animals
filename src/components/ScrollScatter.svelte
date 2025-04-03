<script>
    import { fade } from 'svelte/transition';
    import { LayerCake, Svg } from 'layercake';
    import ScrollScatterSvg from "$components/layercake/ScrollScatter.svg.svelte";
    import medianData from "$data/wineData_median.csv"
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import Voronoi from "$components/layercake/ScrollVoronoi.svelte";
    import { tweened } from 'svelte/motion';
    import { cubicIn } from 'svelte/easing';
    import { bigScatterData } from "$stores/misc.js";
    import Range from "$components/helpers/Range.svelte";

    export let chartScrollIndex;

    const yKey = 'price';
    const xKey = 'rating';

    medianData.forEach(d => {
        d[xKey] = +d[xKey];
        d[yKey] = +d[yKey];
    });

    let xDomain = tweened([3.7, 4.2], { duration: 2000, easing: cubicIn });
    let yDomain = tweened([20, 35], { duration: 2000, easing: cubicIn });

    async function updateDomains(chartScrollIndex) {
        if (chartScrollIndex <= 3 || chartScrollIndex == undefined) {
            xDomain.set([3.7, 4.2]);
            yDomain.set([20, 40]);
        } else {
            xDomain.set([3, 4.8]);
            yDomain.set([0, 150]);
        }
    }

    $: updateDomains(chartScrollIndex);

    let windowW;
    let rangeW;
    let rangeH;
</script>

<svelte:window bind:innerWidth={windowW} />

<section id="scatter">
    <div class="chart-container" id="scatterplot">
        {#if chartScrollIndex >= 14 || chartScrollIndex == "exit"}
            <div class="range-wrapper" bind:offsetWidth={rangeW} bind:offsetHeight={rangeH}>
                {#if rangeW && rangeH}
                    <Range min={3} max={4.8} step={0.1} metric={"rating"} {rangeW} {rangeH} padding={windowW >= 700 ? 156 : 90} />
                    <Range min={0} max={150} step={1} metric={"price"} {rangeW} {rangeH} padding={windowW >= 700 ? 156 : 90} />
                {/if}
            </div>
        {/if}
        <div class="chart-inner">
            <LayerCake
                padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
                    <ScrollScatterSvg {chartScrollIndex} />
                    <Voronoi {chartScrollIndex} />
                </Svg>
            </LayerCake>
        </div>
        {#if chartScrollIndex == 7 || chartScrollIndex == 8}
            <div class="quadrants" transition:fade>
                <p style="left: 30%; top: 40%" style:opacity={chartScrollIndex == 8 ? 0.4 : 1}>Bad Expensive Wine</p>
                <p style="left: 75%; top: 40%" style:opacity={chartScrollIndex == 8 ? 0.4 : 1}>Good Expensive Wine</p>
                <p style="left: 30%; top: 80%" style:opacity={chartScrollIndex == 8 ? 0.4 : 1}>Bad Cheap Wine</p>
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
        overflow: hidden;
    }

    .chart-container {
        width: 100%;
        height: 100%;
        /* overflow: hidden; */
        padding: 6rem;
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
        top: 8.25rem;
        left: 1rem;
        transform: rotate(-90deg);
    }

    .label-rating {
        right: 2.5rem;
        bottom: 2rem;
        transform: translate(-50%, 0);
    }

    .range-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        padding: 6rem;
        pointer-events: none;
    }

    @media(max-width: 700px) {
        .chart-container {
            padding: 4rem;
        }

        .range-wrapper {
            padding: 4rem;
        }

        .label-price {
            top: 6.25rem;
            left: -1rem;
        }

        .label-rating {
            right: 0.75rem;
            bottom: 0;
        }

        .quadrants p {
            font-size: var(--16px); 
        }
    }
</style>