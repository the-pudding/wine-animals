<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import Column from "$components/layercake/Column.svelte";
    import Line from "$components/layercake/Line.svelte";
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import Tooltip from "$components/layercake/Tooltip.html.svelte";
    import * as d3 from "d3";
    import { hideTooltip } from "$stores/misc.js";
    import { animalSelect, metricSelect } from "$stores/misc.js";

    export let data;

    $: console.log({data})

    data.forEach(d => {
        d[yKey] = +d[yKey];
        d[yKey] = +d[yKey];
        d[countKey] = +d[countKey];
    });

    const groupedData = d3.groups(data, d => d.animalGroup);

    function findMatch(animal, data) {
        let match = data.find(item => item[0] == animal);
        return match;
    }

    function sumTotalWines(data) {
        const totalCount = data.reduce((sum, item) => sum += item.count, 0);
        return totalCount
    }

    const allWineData = $animalSelect == "cats"
        ? findMatch("allCats", groupedData)
        : $animalSelect == "birds"
        ? findMatch("allBirds", groupedData)
        : findMatch("all", groupedData)
    const lineData = allWineData;

    const endObj = {animalGroup: "end", category: "end", bucket: "end", percent: 0, count: 0};

    lineData[1].push(endObj);

    const xKey = 'bucket';
    const yKey = 'percent';
    const countKey = 'count';
    const xDomainColumn = [...new Set(data.map(item => item.bucket))];
    // console.log(xBucketsPrice)
    // $: xDomainColumn = $metricSelect == "price"
    //     ? ['value', 'popular', 'premium', 'luxury', 'icon']
    //     : ['wines3below', 'wines3_35', 'wines35_4', 'wines4_45', 'wines45above'];
    const xDomainLine = [...xDomainColumn, 'end']
</script>

<section id="distribution">
    <div class="key">
        <div style="background: #448b81">
            <p class="topline">Fewer wines than all wines</p>
            <p class="desc">Less than than -5% difference</p>
        </div>
        <div style="background: #f0ebd7">
            <p class="topline">About the same percentage</p>
            <p class="desc">Greater -5% to 5% difference</p>
        </div>
        <div style="background: #c35e34">
            <p class="topline">More wines than all wines</p>
            <p class="desc">Greater than 5% difference</p>
        </div>
    </div>
    {#if $metricSelect == "price"}
        <div class="key">
            <div>
                <p class="topline">Value</p>
                <p class="desc">$9.99 and under</p>
            </div>
            <div>
                <p class="topline">Popular</p>
                <p class="desc">$10 to $19.99</p>
            </div>
            <div>
                <p class="topline">Premium</p>
                <p class="desc">$20 to 49.99</p>
            </div>
            <div>
                <p class="topline">Luxury</p>
                <p class="desc">$50 to $99.99</p>
            </div>
            <div>
                <p class="topline">Icon</p>
                <p class="desc">$100+</p>
            </div>
        </div>
    {/if}
    <div class="tooltip" class:hidden={$hideTooltip}></div>
    {#each groupedData as animal, i}
    {@const animalData = animal[1]}
    {@const totalAnimalWines = sumTotalWines(animal[1])}
        <div class="chart-wrapper">
            <h3>{animal[0]}</h3>
            <p class="tot-count">{totalAnimalWines} wines</p>
            <div class="chart-layers">
                <div class="chart-container bars" id="bars_{animal[0]}">
                {#key xDomainColumn}
                    <LayerCake
                    padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    x={xKey}
                    y={yKey}
                    xScale={d3.scaleBand().paddingInner(0.02).round(true)}
                    xDomain={xDomainColumn}
                    yDomain={[0, 100]}
                    data={animalData}
                    >
                        <Svg>
                            <AxisX gridlines={false} />
                            <AxisY snapBaselineLabel gridlines={false}/>
                            <Column {allWineData} />
                        </Svg>
                    </LayerCake>
                {/key}
                </div>
                <div class="chart-container" id="line" style="pointer-events:none">
                    <LayerCake
                        padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        x={xKey}
                        y={yKey}
                        xScale={d3.scaleBand().paddingInner(0.02).round(true)}
                        xDomain={xDomainLine}
                        yDomain={[0, 100]}
                        data={allWineData[1]}
                        >
                            <Svg>
                                <Line />
                            </Svg>
                    </LayerCake>
                </div>
            </div>
        </div>
    {/each}
</section>

<style>
    #distribution {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .key {
        width: 100%;
        display: flex;
        flex-direction: row;
        font-family: var(--sans);
        justify-content: center;
    }

    .key div {
        padding: 1rem;
    }

    .key p {
        margin: 0;
    }

    .tooltip.hidden {
        opacity: 0;
        transition: opacity 0.25s linear;
    }

    .tooltip {
        max-width: 140px;
        background: var(--color-white);
        border: 1px solid var(--color-gray-300);
        padding: 0.25rem;
        position: absolute;
        font-family: var(--sans);
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.25s linear;
        pointer-events: none;
    }

    :global(.tooltip p) {
        margin: 0;
    }

    :global(.tooltip .animal) {
        padding: 0 0 0.25rem 0;
        margin: 0 0 0.25rem 0;
        border-bottom: 1px solid var(--color-gray-300);
    }

    :global(.bolded) {
        font-weight: 700;
    }

    .topline {
        font-weight: 700;
    }

    .desc {
        font-size: 0.75rem;
    }

    .chart-wrapper {
        width: 100%;
        max-width: 300px;
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
        margin: 0 0 2rem 0;
        font-size: 0.8rem;
    }

    .chart-layers {
        position: relative;
        width: 100%;
        height: 150px;
    }

    .chart-container {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .bars {
        width: calc(100% * 0.835)
    }
</style>