<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";
    import Voronoi from "$components/layercake/Voronoi.svelte";
    import { animalSelect, bigScatterData } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv"

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';
    import Icon from "$components/helpers/Icon.svelte";
	import { tooltipType } from "../stores/misc";

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
    let individWineBtns;
    let subgroup;
    let clickedAnimal;

    function handleSummaryClick(event) {
        let id = event.target.id.split("-")[0];
        if (id == "gamebird") { id == "game bird"}

        subgroup = id == "human" ? "human rider" : id;

        clickedAnimal = event.target.closest(".animal-card").id.split("-")[2];

        if (clickedAnimal == animal.replace(/[^a-zA-Z0-9]/g, "") && clickedAnimal !== "bug" && clickedAnimal !== "mythicalcreature") {
            animalData = allWineData.filter(d => 
                d.topgroup.includes(animal) &&
                d.subgroup.includes(id) &&
                d.price <= 150);

            points = animalData.map(d => ({
                x: +d.rating,  // Convert price to a number
                y: +d.price  // Convert rating to a number
            }))

            trendLine = regression(points);
        } else {
            animalData = allWineData.filter(d => 
                d.topgroup.includes(animal) &&
                d.finalAnimal.includes(id) &&
                d.price <= 150);

            points = animalData.map(d => ({
                x: +d.rating,  // Convert price to a number
                y: +d.price  // Convert rating to a number
            }))

            trendLine = regression(points);
        }
    }

    function handleIndividWineClick(event) {
        resetClick();
        let closestCard = d3.select(event.target.closest(".animal-card"));

        closestCard.selectAll(".card-wine-circle circle")
            .transition()
            .duration(500)
            .style("opacity", 0.8)
            .style("fill", "#38425D")
            .attr("r", 4);

        let id = event.target.id;

        closestCard.select(`#card-wine-circle-${id}`)
            .transition()
            .duration(500)
            .style("opacity", 1)
			.style("fill", "#CFCABF")
			.attr("r", 10)

        let data = allWineData.filter(d => d.id == id);
            
        setTooltip(data[0])
    }

    function setTooltip(data) {
        tooltipType.set("bottle")
		let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", true);

		tooltip.select("img").attr("src", `./assets/images/vivinoLabels/img_${data.id}.png`);

		tooltip.select(".wine-name").text(data.name);
		tooltip.select(".winery-name").text(`${data.winery}, ${data.country}`);
		tooltip.select(".animal").text(`${data.topgroup}`);
		tooltip.select(".type").text(`${data.type}`);
		tooltip.select(".price").text(`$${data.price.toFixed(2)}`); // Add `$` for price formatting
		tooltip.select(".rating").html(
			`${data.rating}
			<span class="stars"><img alt="stars" src="./assets/images/stars/${formatStars(data.rating)}" /></span>`
		);
	}

    function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}.svg`
    }

    onMount(() => {
        individWineBtns = document.querySelectorAll(".individ-wine-btn");
        individWineBtns.forEach(btn => {
            btn.addEventListener("click", (event) => handleIndividWineClick(event));
        });

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
        } else if (animal == "cattle" || animal == "deer" || animal == "fish" || animal == "sheep") {
            return animal
        } else {
            return `${animal}s`
        }
    }

    function handleMouseover(e) {
        tooltipType.set("bottle")
    }

    function handleMouseleave(e) {
        tooltipType.set(undefined);

        let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", false);
    }
</script>

<section id="scatter">
    <div class="chart-wrapper"
        on:mouseover|preventDefault={(e) => handleMouseover(e)}
        on:focus={(e) => handleMouseover(e)}
        on:mouseleave={handleMouseleave}
        role="presentation">
        <h4>Individual wines</h4>
        <div class="deets">
            <p>Now showing <span class="bold">{pluralize(animal)}</span>
                {#if subgroup !== undefined && clickedAnimal == animal.replace(/[^a-zA-Z0-9]/g, "")}
                    <span class="subgroup-span">
                        <Icon name="chevron-right" size={"1rem"}/>
                        <span class="bold">{pluralize(subgroup)}s</span>
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
                        <Voronoi />
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

    @media (max-width: 700px) {
        #scatter {
            margin-bottom: 2rem;
        }
        h4 {
            font-size: var(--18px);
        }

        .deets p {
            font-size: var(--16px);
        }
    }
</style>