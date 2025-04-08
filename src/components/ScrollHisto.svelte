<script>
    import { getContext } from "svelte";
    import { LayerCake, Svg } from 'layercake';
    import Column from "$components/layercake/Column.svelte";
    import Line from "$components/layercake/Line.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import { groups } from 'd3-array';
    import { scalePoint, scaleBand } from 'd3-scale';
    import data from "$data/wineData_summary.csv";

    const copy = getContext("copy");

    export let width;
    export let animal;

    data.forEach(d => {
        d[yKey] = +d[yKey];
        d[yKey] = +d[yKey];
        d[countKey] = +d[countKey];
    });

    const groupedData = groups(data, d => d.animalGroup);

    let currAnimalData = data.filter(d => d.animalGroup == animal);
    let currAnimalGroupedData = groups(currAnimalData, d => d.category)
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
    const allWineGroupedData = groups(allWineDataX, d => d.category)
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
</script>

<section id="distribution">
    <h4>{animal} Wine characteristics & distribution</h4>
    <div class="key">
        <p class="animal-wines">{animal} wines</p>
        <p class="all-wines">All wines</p>
        <p class="stat-more">More than all wines</p>
        <p class="stat-less">Less than all wines</p>
    </div>
    <div class="quad-wrapper">
        {#each currAnimalGroupedData as category, i}
            {@const matchingLineData = allWineGroupedData.find(([key]) => key === category.key)?.[1] || []}
            {@const xDomainLine = [...new Set(matchingLineData.map(d => d.bucket))]}
            {@const xScaleLine = scalePoint()
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
                            xScale={scaleBand().paddingInner(0.04)}
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
                    {#if matchedCopy}
                        {#if category.key == "price"}
                            <p class="comments">{@html matchedCopy.priceComments}</p>
                        {:else if category.key == "rating"}
                            <p class="comments">{@html matchedCopy.ratingComments}</p>
                        {:else if category.key == "type"}
                            <p class="comments">{@html matchedCopy.typeComments}</p>
                        {:else if category.key == "country"}
                            <p class="comments">{@html matchedCopy.countryComments}</p>
                        {/if}
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

    .key {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        gap: 1rem;
        font-family: var(--sans);
        text-transform: capitalize;
        align-items: center;
    }

    .key p {
        width: calc(50% - 1rem);
        padding: 0.125rem 0.25rem;
        margin: 0;
    }

    .key .animal-wines::before, .key .all-wines::before {
        content: "";
        display: inline-block;
        width: 30px;
        height: 15px;
        margin-right: 0.5rem;
    }

    .key .animal-wines::before {
        background-image: url('assets/images/bar-chart.png');
        background-size: 30px 15px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .key .all-wines::before {
        background-image: url('assets/images/step-chart.png');
        background-size: 30px 15px;
        background-repeat: no-repeat;
        background-position: center;
    }

    .key .stat-more {
        background: var(--wine-green);
        border-radius: 3px;
    }

    .key .stat-less {
        background: var(--wine-red);
        border-radius: 3px;
    }

    .quad-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        gap: 3rem;
    }

    .comments {
        margin: 0.5rem 0 0 0;
        font-family: var(--sans);
        font-size: var(--18px);
        width: 100%;
    }

    :global(.bolded) {
        font-weight: 700;
    }

    .topline {
        font-weight: 700;
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
        margin: 2.5rem 0 1rem 0;
        color: var(--wine-tan); 
        text-transform: capitalize;
    }

    h5 {
        font-size: var(--14px);
        font-family: var(--sans);
        text-align: center;
        text-transform: uppercase;
        margin: 1.5rem 0 0 0;
        color: var(--wine-dark-tan);
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

        h4 {
            font-size: var(--18px);
            text-align: left;
            margin-bottom: 1rem;
        }

        h5 {
            margin: 1rem 0 0 0;
        }

        .comments {
            font-size: var(--16px);
        }

        .key {
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }

        .key p {
            width: calc(50% - 1rem);
            font-size: var(--14px);
            margin: 0;
        }

        .key p:first-of-type, .key p:nth-of-type(2) {
            width: 100%;
        }
    }
</style>