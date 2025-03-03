<script>
    import { getContext, onMount } from "svelte";
    import starIcon from "$svg/star.svg";
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Scatter from "$components/Scatter.svelte";
    import medianData from "$data/wineData_median.csv";
    import { bigScatterData } from "$stores/misc.js";

    export let animal;

    const copy = getContext("copy");

    let strippedAnimal = animal.replace(/[^a-zA-Z0-9]/g, "");
</script>

{#if animal !== "human" && animal !== "none"}
    <div class="animal-card" id="animal-card-{strippedAnimal}">
        <div class="rail" id="rail-left">
            <div class="deets">
                <div class="icon">
                    <img src="./assets/images/icons/{strippedAnimal}.png" />
                </div>
                <h3>{animal}</h3>
                <div class="medians-wrapper">
                    <div class="median">
                        <p>Median price</p>
                        <p>${medianData.find(d => d.topGroup == animal).price}</p>
                    </div>
                    <div class="median">
                        <p>Median rating</p>
                        <p>{medianData.find(d => d.topGroup == animal).rating}
                            <span class="stars">
                                {#each Array(Math.floor(medianData.find(d => d.topGroup == animal).rating)).fill(0) as _, i}
                                    <span class="full-star">{@html starIcon}</span> <!-- Full star -->
                                {/each}
                        
                                {#if medianData.find(d => d.topGroup == animal).rating % 1 !== 0}
                                    <span class="partial-star">
                                        <span class="partial-star-inner" style="width: {Math.round((medianData.find(d => d.topGroup == animal).rating % 1) * 100)+20}%;">
                                            {@html starIcon}
                                        </span>
                                    </span> <!-- Partial star -->
                                {/if}
                            </span>
                        </p>
                    </div>
                    <div class="median">
                        <p>Steals %</p>
                        <p>XX%</p>
                    </div>
                </div>
                {#if copy.summaryCards.find(card => card.animal === animal)}
                    {@const selectedCard = copy.summaryCards.find(card => card.animal === animal)}
                    {#if selectedCard.text}
                        {#each selectedCard.text as graf, i}
                            <p>{@html graf.value}</p>
                        {/each}
                    {/if}
                {/if}
            </div>
            <div class="scatter-wrapper">
                <Scatter animal={animal} />
            </div>
        </div>
        <div class="rail" id="rail-right">
            <ScrollHisto animal={animal}/>
        </div>
    </div>
{/if}

<style>
    .animal-card {
        width: calc(100% - 4rem);
        max-width: 1200px;
        margin: 0 auto;
        border: 1px solid var(--wine-med-gray);
        border-radius: 3px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        color: var(--wine-tan);
        box-shadow: -4px 4px 10px rgb(17, 17, 17, 0.5);
    }

    #rail-left {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    #rail-right {
        width: 100%;
    }

    .deets {
        width: 40%;
        padding-right: 2rem;
    }

    .deets p {
        font-size: var(--18px);
        line-height: 1.65;
    }

    .medians-wrapper {
        margin: 0;
        display: flex;
        flex-direction: row;
        gap: 0;
        justify-content: space-between;
    }

    .median {
        width: 40%;
        font-family: var(--sans);
    }

    .median:first-of-type {
        max-width: 35%;
    }

    .median:last-of-type {
        max-width: 25%;
    }

    .median p:first-of-type {
        text-transform: uppercase;
        margin: 0;
        color: var(--wine-dark-tan);
        font-size: var(--14px);
    }

    .median p:nth-of-type(2) {
        font-size: var(--32px);
        margin: 0;
    }

    .scatter-wrapper {
        width: 60%;
    }

    h3 {
        color: var(--wine-tan);
        text-transform: capitalize;
        font-size: var(--36px);
        font-weight: 700;
    }

    .icon {
        background: var(--wine-tan);
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon img {
        width: 90%;
    }

    .stars {
        display: inline-flex;
        align-items: center;
        margin: 0;
        position: relative;
        top: -0.25rem;
    }

    :global(.full-star svg, .partial-star svg) {
        height: 100%;
        aspect-ratio: 1 / 1;
    }

    :global(.full-star svg path, .partial-star svg path) {
        fill: var(--wine-tan);
        stroke: none;
        width: 100%;
        height: 100%;
    }

    .full-star {
        width: 1.25rem;
        height: 1.25rem; 
    }

    .partial-star {
        display: inline-block;
        width: 1.25rem; /* Adjust based on your star icon size */
        height: 1.25rem;
        position: relative;
    }

    .partial-star-inner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
</style>