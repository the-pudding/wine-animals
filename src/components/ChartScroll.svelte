<script>
    import { getContext, onMount } from "svelte";
    import { stealPriceNum, stealRatingNum, stealData, stealPercent, stealTopgroupCounts} from "$stores/misc.js";
    import { fly, fade } from 'svelte/transition';
    import * as d3 from "d3";
    import Scrolly from "$components/helpers/ChartScrolly.svelte";
    import Toggle from "$components/helpers/Toggle.svelte";
    import catIcon from "$svg/cat.svg";
    import expensiveIcon from "$svg/expensive.svg";
    import birdIcon from "$svg/bird.svg";
    import topIcon from "$svg/top.svg";
    import touchIcon from "$svg/touch.svg";
    import ScrollScatter from "$components/ScrollScatter.svelte";
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Summary from "$components/Summary.svelte";
    import rawData from "$data/wineData.csv";
    import SummaryBottles from "$components/ChartScroll.SummaryBottles.svelte";

    const copy = getContext("copy");
    
    let chartScrollIndex;
    let activeSection;
    let skipToExplore;
    let innerHeight;
    let innerWidth;

    // TO-DO fix calculations
    function findTop5WinesByPriceAndRating(data) {
        return data
            .sort((a, b) => {
                // Sort by price ascending
                if (a.rating !== b.rating) return a.rating - b.rating;
                // If prices are the same, sort by rating descending
                return b.price - a.price;
            })
            .slice(0, 5); // Get the top 5
    }

    let catSteals = findTop5WinesByPriceAndRating(
        rawData.filter(
            d => d.price <= 150 &&
                d.topgroup.includes("cat") && // Includes "cat"
                !d.topgroup.includes("cattle") && // Excludes "cattle"
                d.topgroup !== "human" &&
                d.topgroup !== "none"
        )
    );

    $: {
        if (chartScrollIndex === undefined || chartScrollIndex < 14) {
            activeSection = "cat";
        } else if (chartScrollIndex < 20) {
            activeSection = "expensive";
        } else if (chartScrollIndex < 22) {
            activeSection = "bird";
        } else if (chartScrollIndex < 23) {
            activeSection = "top";
        } else {
            activeSection = "explore";
        }
    }

    $: minDimension = innerHeight && innerWidth ? d3.min([innerHeight, innerWidth]) : null;

    function handleSkipClick(event) {
        activeSection = "explore";
    }

    onMount(() => {
        // skipToExplore = document.querySelector(".skipToExplore");
        // skipToExplore.addEventListener("click", (event) => handleSkipClick(event));
    })

    $: console.log($stealPercent)
</script>

<svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth} />

<section id="chart-scroll">
    <div class="sticky">
        <!-- <Toggle label={"view"} options={["scatter", "histogram"]} chartScrollIndex={chartScrollIndex}/> -->
        <div class="chart-wrapper">
            <div class="scatter-wrapper" 
                style="max-height: {minDimension}px; max-width: {minDimension}px"
                class:active={chartScrollIndex !== 12}
            >
                <ScrollScatter chartScrollIndex={chartScrollIndex}/>
            </div>
            <div class="lineup-wrapper" class:active={chartScrollIndex == 12}>
                <SummaryBottles scrollIndex={chartScrollIndex}/>
            </div>
            
            <!-- <div class="histo-wrapper" class:active={$chartView == "histogram"}>
                <ScrollHisto chartScrollIndex={chartScrollIndex}/>
            </div> -->
        </div>
        <!-- <div class="section-buttons">
            {#each sections as section, i}
                <button class:active={activeSection == section}>
                    <span>{section}</span>
                    {@html svgIcons[i]}
                </button>
            {/each}
        </div> -->
    </div>
    <Scrolly bind:value={chartScrollIndex}>
        {#each copy.chartScroll as step, i}
            <div id="step-{i}" class="step">
                <div class="step-inner">
                    {#each step.block as graf, i}
                        <p>{@html graf.value}</p>
                    {/each}
                    {#if i == 13 && $stealPercent || i == 13 && $stealPercent == 0}
                        <p><span class="bold">{$stealPercent.toFixed(2)}%</span> of animal wines are steals when the price is <span class="bold">equal to or under ${$stealPriceNum}</span> and the rating <span class="bold">equal to or above {$stealRatingNum} stars.</span></p>
                        <!-- <div class="steal-bar-wrapper">
                            {#each $stealTopgroupCounts as topgroup, i}
                                <div class="steal-bar">
                                    <p class="animal">{topgroup.group}</p>
                                    <div class="bar" style="width: calc({topgroup.count/500*100}% - 6rem)"></div>
                                    <p>{topgroup.count}</p>
                                </div>
                            {/each}
                        </div> -->
                    {/if}                
                </div>
            </div>
        {/each}
    </Scrolly>
    <div class="spacer" />
</section>

<style>
    #chart-scroll {
        width: 100%;
    }
    .sticky {
        width: 100%;
        height: 100svh;
		position: sticky;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
		top: 0;
        left: 0;
		transition: all 1s;
        z-index: 1;
        overflow: hidden;
	}

    .chart-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .scatter-wrapper, .lineup-wrapper {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 900;
        opacity: 0;
        transition: opacity 0.5s linear;
    }

    .scatter-wrapper {
        width: 100%;
        height: 100%;
        left: 0;
        transform: translate(0,0);
        padding: 3rem 0 5rem 0;
    }

    .lineup-wrapper {
        width: 100%;
        z-index: 1;
    }

    .scatter-wrapper.active, .lineup-wrapper.active {
        opacity: 1;
    }

    .spacer {
		height: 200svh;
	}

	.step {
		height: 90vh;
        z-index: 900;
        max-width: 400px;
        opacity: 1;
	}

    #step-13 {
        height: 140vh;
    }

    .step p {
        text-align: left;
        max-width: 700px;
        line-height: 1.65;
        color: var(--wine-tan);
        font-size: var(--18px);
        line-height: 1.65;
        background: none;
        z-index: 900;
        margin: 2rem 0;
        pointer-events: auto;
    }

    :global(.skipToExplore) {
        font-family: var(--sans);
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
    }

    :global(.skipToExplore:hover) {
        opacity: 0.5;
    }

    .section-buttons {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translate(0, -50%);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 1000;
    }

    .section-buttons button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--wine-tan);
        transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;
        transform: scale(1);
        opacity: 0.25;
        position: relative;
    }

    .section-buttons button:hover {
        transform: scale(1.125);
        opacity: 1;
    }

    .section-buttons:has(button:hover) button:not(:hover):not(.active) {
        opacity: 0.25;
        transform: scale(1);
    }

    button.active {
        opacity: 1;
        transform: scale(1.125); 
    }

    button span {
        position: absolute;
        top: 50%;
        left: -88px;
        transform: translate(0, -50%);
        color: var(--wine-tan);
        font-weight: 700;
        opacity: 0;
        text-align: right;
        width: 80px;
        transition: opacity 0.25s ease-in-out;
        text-shadow: -2px -2px 0 var(--wine-black), 2px -2px 0 var(--wine-black), -2px 2px 0 var(--wine-black), 2px 2px 0 var(--wine-black);
    }

    .section-buttons button:hover span {
        opacity: 1;
    }

    :global(button svg) {
        width: 100%;
        height: 100%;
    }

    :global(.median-line-span, .compare-line-span, .sweet-rect-span, .cream-line-span, .selected-bottle-circle-span) {
        position: relative;
        font-weight: 700;
        margin-right: 2.5rem;
        white-space: nowrap;
        font-family: var(--sans);
        
    }

    :global(.median-line-span::after, .compare-line-span::after, .sweet-rect-span::after, .cream-line-span::after, .selected-bottle-circle-span::after) {
        position: absolute;
        top: 50%;
        right: -2rem;
        width: 1.5rem;
        height: 1.5rem;
        content: "";
        margin: 0 0 0 1rem;
    }

    :global(.selected-bottle-circle-span::after) {
        border: 3px solid var(--wine-gold);
        border-radius: 50%;
        top: 0%;
    }

    :global(.median-line-span::after) {
        border-top: 3px solid var(--wine-red);
    }

    :global(.cream-line-span::after) {
        border-top: 3px solid var(--wine-tan);
    }

    :global(.compare-line-span::after) {
        top: 40%;
        height: 0.5rem;
        border-top: 2px solid var(--color-gray-600);
        border-bottom: 2px solid var(--color-gray-600);
    }

    :global(.sweet-rect-span::after) {
        background: rgb(54, 59, 69, 0.75);
        top: 0;
        border-top: 2px solid var(--wine-tan);
        border-left: 2px solid var(--wine-tan);
    }

    :global(.more-span) {
        font-weight: 700;
        background: var(--wine-green);
        color: var(--wine-black);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-family: var(--sans);
    }

    :global(.less-span) {
        font-weight: 700;
        background: var(--wine-red);
        color: var(--wine-black);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-family: var(--sans);
    }

    :global(.bold) {
        font-weight: 700;
    }

    .steal-bar-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .steal-bar {
        width: 100%;
        height: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .steal-bar p {
        margin: 0;
        padding: 0;
        font-family: var(--sans);
        font-size: var(--14px);
        text-transform: capitalize;
    }

    .steal-bar p.animal {
        width: 6rem;
        text-align: right;
    }

    .bar {
        height: 100%;
        background: var(--wine-red);
    }

    :global(.slider-span) {
        font-weight: 700;
        font-family: var(--sans);
        position: relative;
        padding-left: 2.5rem;
    }

    :global(.slider-span::before) {
        content: '';
        width: 2rem;
        height: 2rem;
        position: absolute;
        left: 0;
        top: -4px;
        background: url("./assets/images/range-vert.png");
        background-size: 2rem 2rem;
        background-repeat: no-repeat;
    }

    @media(max-width: 1400px) {
		.sticky {
			align-items: center;
            justify-content: center;
		}

        .chart-wrapper {
            justify-content: center;
            align-items: center;
        }

        .scatter-wrapper {
            left: 50%;
            transform: translate(-50%,0);
        }

        .step {
            max-width: 550px;
        }

        .step-inner {
            background: rgba(24, 26, 31, 0.98);
            padding: 1rem 2rem;
            border: 1px solid var(--wine-dark-gray);
            border-radius: 3px;
            box-shadow: -4px 4px 10px rgb(17, 17, 17, 0.5);
        }
	}

    @media(max-width: 700px) {
        .scatter-wrapper {
            width: 100%;
        }

        .step {
            height: 90vh;
            z-index: 900;
            max-width: 90%;
            opacity: 1;
        }

        .step p {
            font-size: var(--16px);
        }
    }
</style>