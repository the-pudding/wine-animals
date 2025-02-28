<script>
    import { getContext } from "svelte";
    import starIcon from "$svg/star.svg";
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Scatter from "$components/Scatter.svelte";
    import medianData from "$data/wineData_median.csv";

    export let animal;

    const copy = getContext("copy");

    let strippedAnimal = animal.replace(/[^a-zA-Z0-9]/g, "");
</script>

{#if animal !== "human" && animal !== "none"}
    <div class="animal-card">
        <div class="rail" id="rail-left">
            <div class="icon">
                <img src="./assets/images/icons/{strippedAnimal}.png" />
            </div>
            <h3>{animal}</h3>
            <p>
                <span class="bold">Median price:</span>
                ${medianData.find(d => d.topGroup == animal).price} 
            </p>
            <p>
                <span class="bold">Median rating:</span>
                {medianData.find(d => d.topGroup == animal).rating} 
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
            {#if copy.summaryCards.find(card => card.animal === animal)}
                {@const selectedCard = copy.summaryCards.find(card => card.animal === animal)}
                <ul>
                    {#each selectedCard.points as point}
                        <li>{point}</li>
                    {/each}
                </ul>
                {#if selectedCard.text}
                    {#each selectedCard.text as graf, i}
                        <p>{@html graf.value}</p>
                    {/each}
                {/if}
            {/if}
        </div>
        <div class="rail" id="rail-center">
            <ScrollHisto animal={animal}/>
        </div>
        <div class="rail" id="rail-right">
            <Scatter animal={animal}/>
        </div>
    </div>
{/if}

<style>
    .animal-card {
        width: calc(100% - 4rem);
        margin: 0 2rem;
        border: 1px solid var(--wine-med-gray);
        border-radius: 3px;
        padding: 2rem;
        display: flex;
        flex-direction: row;
        gap: 4rem;
        color: var(--wine-tan);
    }

    .rail {
        width: 33%;
    }

    h3 {
        color: var(--wine-tan);
        text-transform: capitalize;
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

    .stars-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
    }

    .stars {
        display: inline-flex;
        align-items: center;
        position: relative;
        top: 0.25rem;
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