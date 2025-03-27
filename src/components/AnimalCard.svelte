<script>
    import { getContext } from "svelte";
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Scatter from "$components/Scatter.svelte";
    import medianData from "$data/wineData_median.csv";
    import { navAnimal } from "$stores/misc.js";
    import inView from "$actions/inView.js";

    export let animal;
    export let animalData;

    const copy = getContext("copy");

    let strippedAnimal = animal.replace(/[^a-zA-Z0-9]/g, "");

    function handleView(viewState, animal) {
        if (viewState == "enter") {
            navAnimal.set(animal);
        } else {
            navAnimal.set(undefined);
        }
    }

    function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}_tan.svg`
    }
</script>

{#if animal !== "human" && animal !== "none"}
    <div class="animal-card" 
        id="animal-card-{strippedAnimal}"
        use:inView={{ bottom: 40 }}
        on:enter={() => handleView("enter", animal)}
        on:exit={() =>  handleView("exit", animal)}
    >
        <div class="rail" id="rail-left">
            <div class="deets">
                <div class="topline-wrapper">
                    <div class="icon-name-wrapper">
                        <div class="icon">
                            <img src="./assets/images/icons/{strippedAnimal}.png" alt="{animal} icon" />
                        </div>
                        <h4>{animal}</h4>
                    </div>
                    <div class="medians-wrapper">
                        <div class="median">
                            <p>Median price</p>
                            <p>${(medianData.find(d => d.topGroup == animal).price).toFixed(2)}</p>
                        </div>
                        <div class="median">
                            <p>Total wines</p>
                            <p>{medianData.find(d => d.topGroup == animal).totalCount}</p>
                        </div>
                        <div class="median">
                            <p>Median rating</p>
                            <p>{medianData.find(d => d.topGroup == animal).rating}
                                <span class="stars">
                                    <img alt="stars" src="./assets/images/stars/{formatStars(medianData.find(d => d.topGroup == animal).rating)}">
                                </span>
                            </p>
                        </div>
                        <div class="median">
                            <p>Steals</p>
                            <p>{Math.round(medianData.find(d => d.topGroup == animal).stealPercent * 10) / 10}%</p>
                        </div>
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
        </div>
        <div class="rail" id="rail-right">
            <div class="scatter-wrapper">
                <Scatter animal={animal} animalData={animalData} />
            </div>
            <ScrollHisto animal={animal}/>
        </div>
    </div>
{/if}

<style>
    .animal-card {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        border: 1px solid var(--wine-dark-gray);
        border-radius: 3px;
        padding: 2rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        color: var(--wine-tan);
        box-shadow: -4px 4px 10px rgb(17, 17, 17, 0.5);
    }

    #rail-left {
        width: 35%;
        display: flex;
        flex-direction: row;
    }

    #rail-right {
        width: 65%;
    }

    .deets {
        width: 100%;
        padding-right: 2rem;
    }

    .deets p {
        font-size: var(--18px);
        line-height: 1.65;
    }

    .topline-wrapper {
        display: flex;
        flex-direction: column;
    }

    .icon-name-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .medians-wrapper {
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0;
        justify-content: space-between;
    }

    .median {
        width: 50%;
        font-family: var(--sans);
    }

    .median p {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
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
        width: 100%;
    }

    h4 {
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
        aspect-ratio: 1 / 1;
    }

    .stars {
        display: inline-flex;
        align-items: center;
        margin: 0;
        position: relative;
        line-height: 0;
    }

    .stars img {
        height: 16px;
        width: 100%;
    }

    @media (max-width: 900px) {
        .animal-card {
            flex-direction: column;
        }

        #rail-left, #rail-right {
            width: 100%;
        }

        .deets {
            padding: 0;
        }

        .topline-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .icon-name-wrapper {
            display: flex;
            flex-direction: row;
            width: 100%;
            gap: 1rem;
        }

        .median {
            width: 25%;
        }
    }

    @media (max-width: 700px) {
        .icon {
            width: 4rem;
            height: 4rem;
        }

        h4 {
           font-size: var(--28px); 
        }

        .median p:first-of-type {
            font-size: var(--12px);
        }

        .median p:nth-of-type(2) {
            font-size: var(--24px);
        }

        .deets p {
            font-size: var(--16px);
        }
    }
</style>