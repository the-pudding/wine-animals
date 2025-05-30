<script>
    // SVELTE
    import { onMount } from "svelte";

    //LIBARIES
    import { LayerCake, Svg } from 'layercake';
    import { select, selectAll } from 'd3-selection';
    import * as d3Regression from 'd3-regression';
    import refresh from "$svg/refresh-ccw.svg";

    // COMPONENTS
    import Icon from "$components/helpers/Icon.svelte";
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";
    import Voronoi from "$components/layercake/Voronoi.svelte";
    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";

    // STORES
    import { navAnimal, tooltipType, tooltipData, lockedSelection, tooltipVisible, cardsScrollTrigger } from "$stores/misc.js";
    
    // DATA
    import allWineData from "$data/wineData.csv";

    // EXPORTS
    export let animal;

    // VARIABLES
    let subgroup;
    let finalAnimal;

    $: animalData = allWineData.filter(d => {
        const animals = d.finalAnimal
            .split(",")
            .map(a => a.trim().toLowerCase());
        const fa = finalAnimal?.toLowerCase();

        const topgroupList = d.topgroup
            .split(",")
            .map(a => a.trim().toLowerCase());

        const otherBigCats = ["cheetah", "cougar", "jaguar/leopard/panther", "lynx", "tiger"];

        const matchesFinalAnimal = !finalAnimal || (
            fa === "lion crest"
                ? animals.includes("lion crest")
                : fa === "lion"
                    ? animals.includes("lion") && !animals.includes("lion crest")
                    : fa === "cheetah"
                        ? otherBigCats.some(cat => animals.includes(cat))
                        : d.finalAnimal.toLowerCase().includes(fa)
        );

        const matchesTopgroup = topgroupList.includes(animal.toLowerCase());

        const subgroupMatch = !subgroup || d.subgroup.toLowerCase().includes(subgroup.toLowerCase());

        const passesCattleCheck = !(animal === "cat" && topgroupList.includes("cattle") && !topgroupList.includes("cat"));

        return (
            matchesTopgroup &&
            subgroupMatch &&
            matchesFinalAnimal &&
            d.price <= 150 &&
            passesCattleCheck
        );
    });

    const yKey = 'price';
    const xKey = 'rating';

    // animalData.forEach(d => {
    //     d[xKey] = +d[xKey];
    //     d[yKey] = +d[yKey];
    // });

    // Regression Line
    const regression = d3Regression.regressionLog()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    // REACTIVE VARIABLES
    $: points = animalData.map(d => ({
        x: +d.rating,
        y: +d.price
    }));

    $: trendLine = regression(points);
    $: chartData = [animalData, trendLine];

    let individWineBtns = [];
    let summaryBtns = [];
    let individListeners = [];
    let summaryListeners = [];
    let clickedAnimal;
    let clickedCircle;
    let clickedData;
    let container;
    let parentCard;

    //HELPER FUNCTIONS
    function pluralize(animal){
        if (animal == "amphibian/reptile") {
            return "amphibians/reptiles"
        } else if (animal == "cattle" || animal == "deer" 
            || animal == "fish" || animal == "sheep"
            || animal == "junglefowl" || animal == "antelope" || animal == "nautilus") {
            return animal
        } else if (animal =="butterfly") {
            return "butterflies"
        } else if (animal =="wolf") {
            return "wolves"
        } else if (animal =="fox") {
            return "foxes"
        } else if (animal =="dolphin") {
            return "dolphins, sharks, whales"
        } else if (animal == "lion crest") {
            return "heradlic lions"
        } else if (animal == "cheetah") {
            return "other big cats"
        } else {
            return `${animal}s`
        }
    }

    function cleanupEventListeners() {
        individListeners.forEach(({ btn, fn }) => {
            btn.removeEventListener("click", fn);
        });
        summaryListeners.forEach(({ btn, fn }) => {
            btn.removeEventListener("click", fn);
        });
        individListeners = [];
        summaryListeners = [];
    }

    // INTERACTIVE FUNCTIONS
    // Summary Click
    function handleSummaryClick(event) {
        let id = event.target.id.split("-")[0];
        if (id == "gamebird") { id = "game bird"}

        if (id === "human") {
            subgroup = "human";
            finalAnimal = undefined;
        } else if (id === "lobster") {
            subgroup = "crustacean";
            finalAnimal = undefined;
        } else if (id === "nautilus") {
            subgroup = "shell";
            finalAnimal = id;
        } else if (id === "bee" || id === "butterfly") {
            subgroup = "flying bug";
            finalAnimal = id;
        } else if (id === "ladybug" || id === "ant") {
            subgroup = "walking bug";
            finalAnimal = id;
        } else if (id === "unicorn") {
            subgroup = "mythical horse";
            finalAnimal = id;
        } else if (id === "griffin") {
            subgroup = "mythical cat";
            finalAnimal = id;
        } else if (id === "dragon") {
            subgroup = "mythical dragon";
            finalAnimal = id;
        } else if (id === "lioncrest") {
            subgroup = "big cat";
            finalAnimal = "lion crest";
        } else if (id === "lion") {
            subgroup = "big cat";
            finalAnimal = id;
        } else if (id === "cat") {
            subgroup = "domestic cat";
            finalAnimal = undefined;
        } else if (id === "othercat") {
            subgroup = "big cat";
            finalAnimal = "cheetah";
        } else {
            subgroup = id;
            finalAnimal = undefined;
        }

        clickedAnimal = event.target.closest(".animal-card").id.split("-")[2];
    }

    // Individual Click
    function handleIndividWineClick(event) {
        resetClick();
        let closestCard = select(event.target.closest(".animal-card"));

        closestCard.selectAll(".card-wine-circle circle")
            .transition()
            .duration(500)
            .style("opacity", 0.3)
            .attr("r", 5);

        let id = event.target.id;
        let data = allWineData.filter(d => d.id == id);
        clickedData = data[0];
        
        tooltipVisible.set(true);
        setTooltip(data[0]);
        lockedSelection.set(true);

        setTimeout(() => {
            clickedCircle = closestCard.select(`#card-wine-circle-${id}`)

            clickedCircle
                .transition()
                .duration(500)
                .style("opacity", 1)
                .style("fill", "#CFCABF")
                .attr("r", 10);
        }, 250)
    }

    // Reset Click
    function resetClick() {
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

    // Set tooltip data
    function setTooltip(data) {
		tooltipData.set(data);
		tooltipType.set("bottle");
	}

    // ON MOUNT
    onMount(() => {
        parentCard = container.closest('.animal-card');

        function bindEventListeners() {
            cleanupEventListeners();

            summaryBtns = parentCard.querySelectorAll(".summary-btn");
            summaryBtns.forEach(btn => {
                const fn = event => handleSummaryClick(event);
                btn.addEventListener("click", fn);
                summaryListeners.push({ btn, fn });
            });

            individWineBtns = parentCard.querySelectorAll(".individ-wine-btn");
            individWineBtns.forEach(btn => {
                const fn = event => handleIndividWineClick(event);
                btn.addEventListener("click", fn);
                individListeners.push({ btn, fn });
            });
        }

        if (parentCard) {
            // Run once right away to catch already-rendered elements
            bindEventListeners();

            const observer = new MutationObserver(bindEventListeners);
            observer.observe(parentCard, {
                childList: true,
                subtree: true
            });

            return () => {
                observer.disconnect();
                cleanupEventListeners();
            };
        }
    });

    // REACTIVE FUNCTIONS
    $: resetClick($navAnimal);
    $: if (!$lockedSelection && clickedCircle) {
        selectAll(".card-wine-circle circle")
            .transition(500)
            .style("opacity", 0.8)
            .attr("r", 5);

        clickedCircle
            .transition(500)
            .style("fill", function() {
				let fill =  (clickedData.price <= 29.99 && clickedData.rating >= 4) ? "#3E5C4B" : "#475171";
				return fill
			})
            .attr("r", 5);
	}
</script>

<section id="scatter-{animal}" class="scatter" bind:this={container}>
    <div class="chart-wrapper">
        <h4>Individual wines</h4>
        <div class="deets">
            <p>Now showing <span class="bold">{pluralize(animal)}</span>
                {#if subgroup !== undefined && clickedAnimal == animal.replace(/[^a-zA-Z0-9]/g, "")}
                    <span class="subgroup-span">
                        <Icon name="chevron-right" size={"16px"} rotation={0}/>
                        {#if finalAnimal == undefined}
                            <span class="bold">{pluralize(subgroup)}</span>
                        {:else}
                            <span class="bold">{pluralize(finalAnimal)}</span>
                        {/if}
                    </span>
                {/if}
            </p>
            <button id="refesh-btn" on:click={resetClick}>
                <span class="icon">
                    {@html refresh}
                </span>
                Reset wines
            </button>
        </div>
        <div class="chart-container" id="scatterplot" style="pointer-events:none">
            {#if $cardsScrollTrigger}
                <LayerCake
                    padding={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    x={xKey}
                    y={yKey}
                    data={chartData}
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
                        <ScatterSvg />
                        <Voronoi />
                    </Svg>
                </LayerCake>
        {/if}
        </div>
    </div>
</section>

<style>
    .scatter {
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

    .chart-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding-right: 3px;
    }

    #refesh-btn {
        background: var(--wine-tan);
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    #refesh-btn:hover {
        background: var(--wine-dark-tan);
        transform: translateY(-2px);
        transition: transform var(--250ms) ease;
    }

    #refesh-btn .icon {
        width: 1rem;
        height: 1rem;
        transition: transform var(--250ms) ease;
    }

    :global(#refesh-btn .icon svg) {
        width: 1rem;
        height: 1rem;
    }

    #refesh-btn:hover .icon {
        transform: rotate(180deg);
        transform-origin: center;
    }

    :global(.summary-btn, .individ-wine-btn) {
        background: var(--wine-tan);
        padding: 0.25rem 0.3rem;
    }

    :global(.summary-btn:hover, .individ-wine-btn:hover) {
        background: var(--wine-dark-tan);
        transition: transform var(--250ms) ease;
        transform: translateY(-2px);
    }

    @media (max-width: 700px) {
        #scatter {
            margin-bottom: 2rem;
        }
        h4 {
            font-size: var(--18px);
        }

        .deets {
            position: relative;
        }

        .deets p {
            font-size: var(--16px);
            width: 100%;
            padding-top: 1rem;
        }

        #refesh-btn {
            position: absolute;
            right: 0;
            top: -1.8rem;
            font-size: var(--14px);
        }
    }
</style>