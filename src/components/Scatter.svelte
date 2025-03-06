<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";
    import { animalSelect, bigScatterData } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv"

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
    import Icon from "$components/helpers/Icon.svelte";

    export let animal;

    const meanData = allWineData.filter(d => d.price <= 150);

    let animalData = allWineData.filter(d => 
            d.topgroup.includes(animal) &&
            d.price <= 150);

    let points = animalData.map(d => ({
        x: +d.rating,  // Convert price to a number
        y: +d.price  // Convert rating to a number
    }))

    const curve = d3.curveLinear;
    const yKey = 'price';
    const xKey = 'rating';
    const xKeyReg = d => +d.rating;
    const yKeyReg = d => +d.price;

    animalData.forEach(d => {
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

    // Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value
    
    let trendLine = regression(points);

    let summaryBtns;
    let subgroup;
    let clickedAnimal;

    function handleSummaryClick(event) {
        let id = event.target.id.split("-")[0];
        subgroup = id;

        clickedAnimal = event.target.closest(".animal-card").id.split("-")[2];

        if (clickedAnimal == animal) {
            animalData = allWineData.filter(d => 
                d.topgroup.includes(animal) &&
                d.subgroup.includes(id) &&
                d.price <= 150);

            points = animalData.map(d => ({
                x: +d.rating,  // Convert price to a number
                y: +d.price  // Convert rating to a number
            }))

            trendLine = regression(points);
        }
    }

    onMount(() => {
        summaryBtns = document.querySelectorAll(".summary-btn");
        summaryBtns.forEach(btn => {
            btn.addEventListener("click", (event) => handleSummaryClick(event));
        });
    })

    function resetClick(){
        subgroup = undefined;
        animalData = allWineData.filter(d => 
            d.topgroup.includes(animal) &&
            d.price <= 150);

        points = animalData.map(d => ({
            x: +d.rating,  // Convert price to a number
            y: +d.price  // Convert rating to a number
        }))

        trendLine = regression(points);
    }

    function pluralize(animal){
        if (animal == "amphibian/reptile") {
            return "amphibians/reptiles"
        } else if (animal == "cattle" || animal == "deer" || animal == "fish") {
            return animal
        } else {
            return `${animal}s`
        }
    }
</script>

<section id="scatter">
    <div class="chart-wrapper">
        <h4>Individual wines</h4>
        <div class="deets">
            <p>Now showing <span class="bold">{pluralize(animal)}</span>
                {#if subgroup !== undefined && clickedAnimal == animal}
                    <span class="subgroup-span">
                        <Icon name="chevron-right" size={"1rem"}/>
                        <span class="bold">{subgroup}s</span>
                    </span>
                {/if}
            </p>
            <button id="refesh-btn" on:click={resetClick}>
                <Icon name="refresh-ccw" size={"1rem"}/>
                Reset to all {animal} wines
            </button>
        </div>
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
                <LayerCake
                    padding={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    x={xKey}
                    y={yKey}
                    data={[animalData, trendLine]}
                    xDomain={[2, 5]}
                    yDomain={[0, 150]}
                >
                    <Svg>
                        <AxisX 
                            gridlines={true} 
                            ticks={7}
                        />
                        <AxisY 
                            gridlines={true} 
                            ticks={3} />
                        <ScatterSvg {r} fill={color} />
                    </Svg>
                </LayerCake>
        </div>
    </div>
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
        background: var(--wine-black);
        color: var(--wine-tan);
    }

    h4 {
        font-size: var(--20px);
        font-weight: 700;
        margin: 0;
    }

    .chart-wrapper {
        width: 100%;
        aspect-ratio: 1 / 1;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
    }
    .deets {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-family: var(--sans);
        padding: 0.5rem 0rem;
    }

    .deets p {
        margin: 0;
        font-size: var(--18px);
    }

    :global(.subgroup-span .icon, #refresh-btn .icon) {
        position: relative;
        top: 2px;
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
        height: 100%;
        overflow: hidden;
        padding-right: 3px;
    }
</style>