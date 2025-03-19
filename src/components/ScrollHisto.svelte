<script>
    import { onMount, getContext } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import Column from "$components/layercake/Column.svelte";
    import Line from "$components/layercake/Line.svelte";
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import { tooltipType } from "$stores/misc.js";
    import data from "$data/wineData_summary.csv";

    const copy = getContext("copy");

    export let chartScrollIndex;
    export let width;
    export let animal;

    data.forEach(d => {
        d[yKey] = +d[yKey];
        d[yKey] = +d[yKey];
        d[countKey] = +d[countKey];
    });

    const groupedData = d3.groups(data, d => d.animalGroup);
    const endObj = {animalGroup: "end", category: "end", bucket: "end", percent: 0, count: 0};

    let currAnimalData = data.filter(d => d.animalGroup == animal);
    let currAnimalGroupedData = d3.groups(currAnimalData, d => d.category)
        .filter(d => d[0] !== "median")
        .map(([key, values]) => {
            const xDomain = [...new Set(values.map(d => d.bucket))]; 

            return {
                key,
                values,
                xDomain
            };
        });
    const allWineDataX = data.filter(d => d.animalGroup == "all");
    const allWineGroupedData = d3.groups(allWineDataX, d => d.category)
        .filter(d => d[0] !== "median")
        .map(([category, values]) => {
            // ✅ Append the "end" object for each category
            values.push({ animalGroup: "end", category: category, bucket: "end", percent: 0, count: 0 });

            return [category, values]; // Keep the same grouped structure
        });

    function findMatch(animal, data) {
        let match = data.find(item => item[0] == animal);
        return match;
    }

    const allWineData = findMatch("all", groupedData)

    const xKey = 'bucket';
    const yKey = 'percent';
    const countKey = 'count';

    function handleMouseover(e) {
        tooltipType.set("histo")
    }

    function handleMouseleave(e) {
        tooltipType.set(undefined);

        let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", false);
    }
</script>

<section id="distribution">
    <h4>Wine distribution</h4>
    <div class="quad-wrapper"
        on:mouseover|preventDefault={(e) => handleMouseover(e)}
        on:focus={(e) => handleMouseover(e)}
        on:mouseleave={handleMouseleave}
        role="presentation">
        {#each currAnimalGroupedData as category, i}
            {@const matchingLineData = allWineGroupedData.find(([key]) => key === category.key)?.[1] || []}
            {@const xDomainLine = [...new Set(matchingLineData.map(d => d.bucket))]}
            {@const xScaleLine = d3.scalePoint()
                .domain(xDomainLine)
                .range([0, width])}
            {#if category.key !== "steals" && category.key !== "count"}
                {@const matchedCopy = copy.summaryCards.find(card => card.animal === animal)}
                <div class="chart-wrapper" id="chart-wrapper-{category.key}">
                    <h5>{category.key}</h5>
                    <div class="chart-layers">
                        <div class="chart-container bars" id="bars_{category[0]}">
                            <LayerCake
                            bind:width
                            padding={{ top: 0, right: 0, bottom: 40, left: 0 }}
                            x={xKey}
                            y={yKey}
                            xScale={d3.scaleBand().paddingInner(0.04)}
                            xDomain={category.xDomain}
                            yDomain={[0, 100]}
                            data={category.values}
                            >
                                <Svg>
                                    <AxisY snapBaselineLabel gridlines={false}/>
                                    <Column {allWineData} />
                                </Svg>
                            </LayerCake>
                        </div>
                        <div class="chart-container" id="line" style="pointer-events:none">
                            <LayerCake
                                bind:width
                                padding={{ top: 0, right: 0, bottom: 40, left: 0 }}
                                x={xKey}
                                y={yKey}
                                xScale={xScaleLine}
                                xDomain={xDomainLine}
                                yDomain={[0, 100]}
                                data={matchingLineData}
                                >
                                    <Svg>
                                        <Line />
                                    </Svg>
                            </LayerCake>
                        </div>
                    </div>
                    {#if category.key == "price"}
                        <p class="comments">{@html matchedCopy.priceComments}</p>
                    {:else if category.key == "rating"}
                        <p class="comments">{@html matchedCopy.ratingComments}</p>
                    {:else if category.key == "type"}
                        <p class="comments">{@html matchedCopy.typeComments}</p>
                    {:else if category.key == "country"}
                        <p class="comments">{@html matchedCopy.countryComments}</p>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</section>

<style>
    #distribution {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        position: relative;
        pointer-events: auto;
        margin-bottom: 2rem;
    }

    .quad-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        gap: 4rem;
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

    .comments {
        margin: 0.5rem 0 0 0;
        font-family: var(--sans);
        font-size: var(--18px);
        width: 100%;
    }

    .category-span {
        font-weight: 700;
        text-transform: uppercase;
        font-size: var(--20px);
    }

    .axis-labels {
        width:100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-family: var(--sans);
        font-size: var(--12px);
        color: var(--color-gray-600);
        margin: 0;
        padding: 0;
    }

    .axis-labels p {
        margin: 0;
        padding: 0.25rem 0 0 0;
    }

    .axis-labels p:last-of-type {
        text-align: right;
        padding-right: 1.5rem;
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
        color: var(--wine-black)
    }

    :global(.tooltip .animal) {
        padding: 0 0 0.25rem 0;
        margin: 0 0 0.25rem 0;
        border-bottom: 1px solid var(--color-gray-300);
        text-transform: capitalize;
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
        width: calc(50% - 2rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        transition: opacity 0.4s linear;
    }

    h4 {
        font-family: var(--serif);
        font-size: var(--20px);
        font-weight: 700;
        text-align: center;
        margin: 2.5rem 0 0 0;
        color: var(--wine-tan); 
    }

    h5 {
        font-size: var(--14px);
        font-family: var(--sans);
        text-align: center;
        text-transform: uppercase;
        margin: 2.5rem 0 0 0;
        color: var(--wine-dark-tan);
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

    @media (max-width: 700px) {
        .quad-wrapper {
            flex-wrap: nowrap;
            flex-direction: column;
        }

        .chart-wrapper {
            width: 100%;
        }

        h5 {
            margin: 1rem 0 0 0;
        }

        .comments {
            font-size: var(--16px);
        }
    }
</style>