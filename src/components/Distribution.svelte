<script>
    import { LayerCake, Svg, Html } from 'layercake';
    import Column from "$components/layercake/Column.svelte";
    import Line from "$components/layercake/Line.svelte";
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import Tooltip from "$components/layercake/Tooltip.html.svelte";
    import * as d3 from "d3";

    import data from "$data/percentDistribution.csv";

    data.forEach(d => {
        d[yKey] = +d[yKey];
    });

    const groupedData = d3.groups(data, d => d.topgroup);

    function findMatch(animal, data) {
		return data.find(item => item[0] === animal)[1];;
	}

    const allWineData = findMatch("all", groupedData);

    const endObj = {topgroup: "all", priceBucket: "end", count: 0}

    allWineData.pop();
    allWineData.push(endObj);

    const xKey = 'priceBucket';
    const yKey = 'count';

    let evt;
    let hideTooltip = false;
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
    {#each groupedData as animal, i}
    {@const animalData = animal[1]}
        <div class="chart-wrapper">
            <h3>{animal[0]}</h3>
            <div class="chart-layers">
                <div class="chart-container" id="bars">
                    <LayerCake
                    padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    x={xKey}
                    y={yKey}
                    xScale={d3.scaleBand().paddingInner(0.02).round(true)}
                    xDomain={['value', 'popular', 'premium', 'luxury', 'icon']}
                    yDomain={[0, 100]}
                    data={animalData}
                    >
                        <Svg>
                            <AxisX gridlines={false} />
                            <AxisY snapBaselineLabel gridlines={false}/>
                            <Column {allWineData} 
                                on:mousemove={event => evt = hideTooltip = event}
                                on:mouseout={() => (hideTooltip = true)}
                            />
                        </Svg>
                        <Html pointerEvents={false}>
                            {#if hideTooltip !== true}
                                <Tooltip {evt} let:detail >
                                    {@const tooltipData = { ...detail.props }}
                                    <div class="tooltip">
                                        <p class="animal bolded">{tooltipData.topgroup}</p>
                                        <p><span class="bolded">{Math.round(tooltipData.count)}%</span> the wines in this animal group are <span class="bolded">{tooltipData.priceBucket}</span> wines</p>
                                    </div>
                                </Tooltip>
                            {/if}
                        </Html>
                    </LayerCake>
                </div>
                <div class="chart-container" id="line" style="pointer-events:none">
                    <LayerCake
                        padding={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        x={xKey}
                        y={yKey}
                        xScale={d3.scaleBand().paddingInner(0.02).round(true)}
                        xDomain={['value', 'popular', 'premium', 'luxury', 'icon', 'end']}
                        yDomain={[0, 100]}
                        data={allWineData}
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

    .tooltip p {
        margin: 0;
        font-family: var(--sans);
    }

    .tooltip .animal {
        padding: 0 0 0.25rem 0;
        margin: 0 0 0.25rem 0;
        border-bottom: 1px solid var(--color-gray-300);
    }

    .bolded {
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

    #bars {
        width: calc(100% * 0.835)
    }
</style>