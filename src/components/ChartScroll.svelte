<script>
    import { getContext, onMount } from "svelte";
    import { chartView } from "$stores/misc.js";
    import { fly, fade } from 'svelte/transition';
    import Scrolly from "$components/helpers/ChartScrolly.svelte";
    import Toggle from "$components/helpers/Toggle.svelte";
    import catIcon from "$svg/cat.svg";
    import expensiveIcon from "$svg/expensive.svg";
    import birdIcon from "$svg/bird.svg";
    import topIcon from "$svg/top.svg";
    import touchIcon from "$svg/touch.svg";
    import ScrollScatter from "$components/ScrollScatter.svelte";

    const copy = getContext("copy");
    
    let chartScrollIndex;
    let activeSection;
    let skipToExplore;
    let sections = ["cat", "expensive", "bird", "top", "explore"];
    let svgIcons = [catIcon, expensiveIcon, birdIcon, topIcon, touchIcon];

    $: {
        if (chartScrollIndex === undefined || chartScrollIndex < 11) {
            activeSection = "cat";
        } else if (chartScrollIndex < 12) {
            activeSection = "expensive";
        } else if (chartScrollIndex < 19) {
            activeSection = "bird";
        } else if (chartScrollIndex < 23) {
            activeSection = "top";
        } else {
            activeSection = "explore";
        }
    }

    function handleSkipClick(event) {
        activeSection = "explore";
    }

    onMount(() => {
        skipToExplore = document.querySelector(".skipToExplore");
        skipToExplore.addEventListener("click", (event) => handleSkipClick(event));
    })
</script>

<section id="chart-scroll">
    <div class="sticky">
        <Toggle label={"view"} options={["scatter", "histogram"]}/>
        <div class="chart-wrapper">
            {#if $chartView == "scatter"}
                <div class="scatter-wrapper" transition:fade>
                    <ScrollScatter chartScrollIndex={chartScrollIndex}/>
                </div>
            {:else}
                <div class="histo-wrapper" transition:fade>
                    <p>testing</p>
                </div>
            {/if}
        </div>
        <div class="section-buttons">
            {#each sections as section, i}
                <button class:active={activeSection == section}>
                    <span>{section}</span>
                    {@html svgIcons[i]}
                </button>
            {/each}
        </div>
    </div>
    <Scrolly bind:value={chartScrollIndex}>
        {#each copy.chartScroll as step, i}
            <div id="step-{i}" class="step">
                {#each step.block as graf, i}
                    <p>{@html graf.value}</p>
                {/each}
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
        width: 65%;
        aspect-ratio: 1/1; 
        position: relative;
    }

    .scatter-wrapper, .histo-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 900;
    }

    .spacer {
		height: 200svh;
	}

	.step {
		height: 70vh;
        z-index: 1000;
        max-width: 25%;
        opacity: 1;
	}

    .step p {
        text-align: left;
        max-width: 700px;
        line-height: 1.65;
        color: var(--wine-tan);
        font-size: var(--20px);
        line-height: 1.65;
        background: none;
        z-index: 1000;
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
</style>