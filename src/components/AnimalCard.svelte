<script>
    import { getContext } from "svelte";
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Scatter from "$components/Scatter.svelte";

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
            {#if copy.summaryCards.find(card => card.animal === animal)}
                {@const selectedCard = copy.summaryCards.find(card => card.animal === animal)}
                <ul>
                    {#each selectedCard.points as point}
                        <li>{point}</li>
                    {/each}
                </ul>
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
</style>