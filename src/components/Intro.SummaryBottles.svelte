<script>
    import { getContext, onMount } from "svelte";
    import summaryData from "$data/wineData_summary.csv";
    import * as d3 from "d3";
    import {flip} from 'svelte/animate';
    import { fly, fade } from 'svelte/transition';
    import { bottleSelected, animalSelected } from "$stores/misc.js";
    import Icon from "$components/helpers/Icon.svelte";

    export let scrollIndex;

    let currData;
    let currMetric;
    let innerWidth;

    const animalSubgroups = [
        {animal: "amphibian/reptile", subgroups: "lizards, snakes, frogs, etc."},
        {animal: "bird", subgroups: "songbirds, chicken, ducks, raptors, etc."},
        {animal: "bug", subgroups: "ant, bee, dragonfly, ladybug, etc."},
        {animal: "canine", subgroups: "domestic dogs, wolves, foxes"},
        {animal: "cat", subgroups: "domestic cats, lions, tigers, etc."},
        {animal: "cattle", subgroups: "cows, oxen, bulls, camels, etc."},
        {animal: "deer", subgroups: "antelope, caribou, gazelles, etc."},
        {animal: "fish", subgroups: "sharks, whales, dolphins, other fins, etc."},
        {animal: "deer", subgroups: "antelope, caribou, gazelles, etc."},
        {animal: "marine", subgroups: "lobster, crab, shrimp, octopi, etc."},
        {animal: "mythical", subgroups: "griffins, unicorns, monsters, etc."},
        {animal: "pachyderm", subgroups: "elephants, rhinos, hippos"},
        {animal: "pig", subgroups: "boar"},
        {animal: "rabbit", subgroups: "hare"},
        {animal: "sheep", subgroups: "rams, goats"},
    ];

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

    function getAnimalSubgroup(animalName) {
        return animalSubgroups.find(
        item => item.animal.toLowerCase() === animalName.toLowerCase()
        );
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

    $: animate = scrollIndex >= 5 ? true : false;
</script>

<svelte:window bind:innerWidth={innerWidth} />

{#if scrollIndex >= 4 && scrollIndex <= 7}
<div class="summary-bottles" transition:fade>
    {#if innerWidth > 700}
        <div class="animal-wrapper">
            {#each currData as animal, i (animal[0])}
                <div class="animal-group active" 
                    style="transition-delay: {(currData.length - i - 1) * 100}ms;"
                    animate:flip={{duration: 1000}}
                    class:active={animal[0] === $animalSelected}
                    class:animated={animate}>
                    <p class="num">
                        {#if currMetric == undefined}
                        {:else if currMetric == "price"}
                            ${animal[1].medianPrice.toFixed(2)}
                        {:else}
                            {animal[1].medianRating}
                        {/if}
                    </p>
                    <div class="img-wrapper">
                        {#if animal[0] === $animalSelected}
                            <img src="./assets/images/blank-bottle-outline.png" alt="wine bottle with red outline" />
                        {:else}
                            <img src="./assets/images/blank-bottle.png" alt="wine bottle" />
                        {/if}
                        <img class="img-icon" src="./assets/images/icons/{animal[0].replace(/[^a-zA-Z0-9]/g, "")}.png" alt="{animal[0]} icon" />
                    </div>
                    <div class="animal-deets">
                        <p>{animal[0] == "amphibian/reptile" ? "amphibian / reptile" : animal[0]}</p>
                        {#if getAnimalSubgroup(animal[0])}
                            <p class="subgroup">{getAnimalSubgroup(animal[0]).subgroups}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        {#if innerWidth >= 1100}
            <div class="labels" class:hidden={scrollIndex <= 5}>
                <p><Icon name="chevron-left"/>Lower {currMetric}</p>
                <p>Higher {currMetric}<Icon name="chevron-right"/></p>  
                {#if currMetric !== undefined}
                    <div class="median-mark" style="left: {currMetric == "price" ? "53%" : "62%"}">
                        <p class="num">{currMetric == "price" ? "$26.99" : "4"}</p>
                        <div class="median-circle"></div>
                        <p>{currMetric == "price" ? "Animal wines" : "All wines & animal wines"}</p>
                    </div>
                    {#if currMetric !== "rating"}
                        <div class="median-mark" style="left: 63%">
                            <p class="num">{currMetric == "price" ? "$29.99" : "4"}</p>
                            <div class="median-circle"></div>
                            <p>All wines</p>
                        </div>
                    {/if}
                {/if}
            </div>
        {/if}
    {:else}
        <div class="labels" class:hidden={scrollIndex <= 5}>
            <p class="low"><Icon name="chevron-up"/>Lower {currMetric}</p>
            <p class="high"><Icon name="chevron-down"/>Higher {currMetric}</p>  
            {#if currMetric !== undefined}
                <div class="median-mark" style="top: {currMetric == "price" ? "51%" : "61%"}">
                    <p class="num">{currMetric == "price" ? "$26.99" : "4"}</p>
                    <div class="median-circle"></div>
                    <p>{currMetric == "price" ? "Animal wines" : "All wines & animal wines"}</p>
                </div>
                {#if currMetric !== "rating"}
                    <div class="median-mark" style="top: 61%">
                        <p class="num">{currMetric == "price" ? "$29.99" : "4"}</p>
                        <div class="median-circle"></div>
                        <p>All wines</p>
                    </div>
                {/if}
            {/if}
        </div>
        <div class="animal-wrapper">
            {#each currData as animal, i (animal[0])}
                <div class="animal-group active" 
                    style="transition-delay: {(currData.length - i - 1) * 100}ms;"
                    animate:flip={{duration: 1000}}
                    class:active={animal[0] === $animalSelected}
                    class:animated={animate}>
                    <p class="num">
                        {#if currMetric == undefined}
                        {:else if currMetric == "price"}
                            ${animal[1].medianPrice.toFixed(2)}
                        {:else}
                            {animal[1].medianRating}
                        {/if}
                    </p>
                    <div class="img-wrapper">
                        {#if animal[0] === $animalSelected}
                            <img src="./assets/images/blank-bottle-outline-horiz.png" alt="wine bottle with red outline" />
                        {:else}
                            <img src="./assets/images/blank-bottle-horiz.png" alt="wine bottle" />
                        {/if}
                        <img class="img-icon" src="./assets/images/icons/{animal[0].replace(/[^a-zA-Z0-9]/g, "")}.png" alt="{animal[0]} icon" />
                    </div>
                    <div class="animal-deets">
                        <p>{animal[0]}</p>
                        {#if getAnimalSubgroup(animal[0])}
                            <p class="subgroup">{getAnimalSubgroup(animal[0]).subgroups}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
{/if}

<style>
    .summary-bottles {
        position: absolute;
        width: 100%;
        height: auto;
        max-height: 80svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        gap: 6rem;
        padding: 2rem;
        margin-top: 10svh;
    }

    .animal-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100%;
        max-width: 1200px;
        gap: 1rem;
    }

    .animal-group {
        width: 4.75%;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-100%, 0);
        transition: transform 500ms ease, opacity 500ms ease;
        opacity: 0;
        gap: 0.5rem;
    }

    .animal-group.animated {
        transform: translate(0, 0);
        opacity: 1;
    }

    .animal-group.active {
        transform: translate(0, -30px);
    }

    .img-wrapper {
        width: 100%;
        aspect-ratio: 1 / 4;
        position: relative;
        margin-bottom: 0.5rem;
    }

    img {
        width: 100%;
        position: absolute;
        display: inline-block;
    }

    .img-icon {
        top: 45%;
    }

    p {
        font-family: var(--sans);
        color: var(--wine-tan);
        font-size: var(--14px);
        text-transform: capitalize;
        text-align: center;
        margin: 0.125rem 0;
    }

    .animal-group.active p {
        font-weight: 700;
    }

    .num, .median-mark .num {
        font-size: var(--18px); 
    }

    .subgroup {
        color: var(--wine-dark-tan);
        font-size: var(--12px);
        text-transform: none;
        line-height: 1.125;
        margin: 0;
    }

    .animal-group.active p.subgroup {
        font-weight: 500;
    }

    .labels {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        transition: opacity 0.5s ease-in;
        opacity: 1;
        padding-top: 0.25rem;
        border-top: 1px solid var(--wine-blue);
        position: relative;
    }

    .labels.hidden {
        opacity: 0;
    }

    .labels p {
        margin: 0;
        padding: 0;
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--12px);
        color: var(--wine-dark-tan);
    }

    .labels .median-mark p {
        text-transform: none;
        font-weight: 500;
        font-size: var(--14px);
        color: var(--wine-tan);
    }

    .labels .median-mark p.num {
        font-size: var(--18px); 
        font-weight: 700;
    }

    :global(.labels p span) {
        position: relative;
        top: 2px;
    }

    :global(.labels p span:first-of-type) {
        margin-right: 2px;
    }

    :global(.labels p span:last-of-type) {
        margin-left: 2px;
    }

    .median-mark {
        position: absolute;
        top: -43px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        max-width: 60px;
        transition: left 0.5s linear;
    }

    .median-circle {
        width: 1.5rem;
        height: 1.5rem;
        background: var(--wine-tan);
        border: 2px solid var(--wine-black);
        border-radius: 50%;
    }

    @media(max-width: 1100px) {
        .animal-wrapper {
            flex-direction: row;
            flex-wrap: wrap;
            max-width: 900px;
            gap: 1rem;
        }

        .animal-group {
            width: 10%;
            margin-bottom: 2rem;
        }

        .img-wrapper {
            max-width: 50px;
        }

        img {
            max-width: 50px;
        }
    }

    @media(max-width:700px) {
        .summary-bottles {
            flex-direction: row;
            height: 100%;
        }
        .animal-wrapper {
            flex-direction: column;
            padding-left: 2.5rem;
            flex-wrap: nowrap;
            gap: 0.75rem;
        }

        .animal-group {
            flex-direction: row;
            flex-wrap: nowrap;
            width: 100%;
            height: 4.5%;
            align-items: center;
            margin-bottom: 0;
        }

        .img-wrapper {
            aspect-ratio: 4 / 1;
            height: 100%;
            width: auto;
            max-width: none;
            margin: 0;
        }

        img {
            max-width: none;
        }

        .animal-group.active {
            transform: translate(30px, 0);
            padding-right: 2rem;
        }

        .img-icon {
            top: 0;
            height: 80%;
            width: auto;
            left: 31%;
            aspect-ratio: 1 / 1;
        }

        .num {
            width: 70px;
            text-align: right;
            margin: 0;
            font-size: var(--16px);
        }

        .subgroup {
            margin-left: 0.5rem;
            text-align: left;
        }

        .animal-deets {
            display: flex;
            flex-direction: column;
            width: 300px;
        }

        .animal-deets p {
            text-align: left;
            margin: 0;
        }

        .subgroup {
            margin: 0;
        }

        .labels {
            position: absolute;
            left: 2.5rem;
            width: 100%;
            top: 0;
            border-top: none;
            border-left: 1px solid var(--wine-blue);
            height: 100%;
            pointer-events: none;
            font-size: var(--16px);
        }

        .labels .low {
            position: absolute;
            top: -1.5rem;
            left: -0.5rem;
            text-align: left;
            width: 100%;
        }

        .labels .high {
            position: absolute;
            bottom: -1.5rem;
            left: -0.5rem;
        }

        .median-mark {
            top: 0;
            left: -30px;
            gap: 0;
        }

        .labels .median-mark p {
            font-size: var(--12px);
            text-align: center;
            line-height: 1.125;
        }

        .labels .median-mark p.num  {
            font-size: var(--14px);
        }

        .median-circle {
            width: 1rem;
            height: 1rem;
        }
    }
</style>