<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScrollScatterSvg from "$components/layercake/ScrollScatter.svg.svelte";
    import medianData from "$data/wineData_median.csv"

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";

    const yKey = 'medianPrice150';
    const xKey = 'medianRating150';
    const xKeyReg = d => +d.medianPrice150;
    const yKeyReg = d => +d.medianRating150;

    medianData.forEach(d => {
        d[xKey] = +d[xKey];
        d[yKey] = +d[yKey];
    });

    const r = 30;
    const padding = 10;
    const color = '#CFCABF';
// </script>

<section id="scatter">
    <div class="chart-container" id="scatterplot" style="pointer-events:none">
        <LayerCake
            padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
            x={xKey}
            y={yKey}
            data={[medianData]}
            xDomain={[3.7, 4.2]}
            yDomain={[20, 35]}
        >
            <Svg>
                <AxisX 
                    gridlines={true} 
                    ticks={7}
                />
                <AxisY 
                    gridlines={true} 
                    ticks={3} />
                <ScrollScatterSvg {r} fill={color} />
            </Svg>
        </LayerCake>
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
</style>