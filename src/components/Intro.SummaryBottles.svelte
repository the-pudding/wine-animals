<script>
    import summaryData from "$data/wineData_summary.csv";
    import * as d3 from "d3";
    import {flip} from 'svelte/animate';
    import { fly, fade } from 'svelte/transition';
    import { bottleSelected, animalSelected } from "$stores/misc.js";

    export let scrollIndex;

    let currData;
    let currMetric;

    const filteredData = summaryData.filter(d => d.animalGroup !== "animal wines" && 
            d.animalGroup !== "all" &&
            d.animalGroup !== "human" &&
            d.animalGroup !== "none"
    );

    const medianData = d3.groups(filteredData, d => d.animalGroup);

    const restructuredData = {};
        for (const [animal, rows] of medianData) {
            restructuredData[animal] = {};
            rows.forEach(row => {
            const { category, bucket, percent, count } = row;
            if (category === "median") {
                // For median rows, use the bucket as the key and assign the numeric median value
                restructuredData[animal][bucket] = +count;
            } else {
                // For all other rows, assign an object containing both percent and count
                restructuredData[animal][bucket] = {
                percent: +percent,
                count: +count
                };
            }
            });
        }
    
    $: {
        if (scrollIndex <= 5) {
            currData = Object.entries(restructuredData).sort(
                ([animalA], [animalB]) => animalA.localeCompare(animalB)
            );
            currMetric = undefined;
        } else if (scrollIndex == 6) {
            currData = Object.entries(restructuredData).sort(
                ([, aData], [, bData]) => aData.medianPrice - bData.medianPrice
            );
            currMetric = "price";
        } else {
            currData = Object.entries(restructuredData).sort(
                ([, aData], [, bData]) => aData.medianRating - bData.medianRating
            );
            currMetric = "rating";
        }
    }


  $: console.log({currMetric})

</script>

{#if scrollIndex >= 5}
<div class="summary-bottles" transition:fade>
    <div class="animal-wrapper">
        {#each currData as animal, i (animal[0])}
            <div class="animal-group" animate:flip={{duration: 500}}
                class:active={animal[0] === $animalSelected}>
                <p>
                    {#if currMetric == undefined}
                    {:else if currMetric == "price"}
                        ${animal[1].medianPrice.toFixed(2)}
                    {:else}
                        {animal[1].medianRating}
                    {/if}
                </p>
                <img src="./assets/images/blank-bottle.png" alt="wine bottle" />
                <p>{animal[0]}</p>
            </div>
        {/each}
    </div>
    <div class="labels" class:hidden={scrollIndex <= 5}>
        <p>Lower {currMetric}</p>
        <p>Higher {currMetric}</p>
    </div>
</div>
{/if}

<style>
    .summary-bottles {
        position: absolute;
        width: 100%;
        height: 100%;
        max-height: 80svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        gap: 1rem;
        padding: 1rem;
    }

    .animal-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        max-width: 1200px;
        gap: 1rem;
    }

    .animal-group {
        width: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .animal-group.active {
        transform: translateY(20px);
    }

    img {
        width: 100%;
    }

    p {
        font-family: var(--sans);
        font-weight: 700;
        color: var(--wine-tan);
        font-size: var(--12px);
        text-transform: capitalize;
        text-align: center;
    }

    .labels {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        transition: opacity 0.5s ease-in;
        opacity: 1;
    }

    .labels.hidden {
        opacity: 0;
    }
</style>