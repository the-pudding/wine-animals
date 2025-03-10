<script>
    import { getContext, onMount } from "svelte";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import Bottles from "$components/Intro.Bottles.svelte";
    import GPTExamples from "$components/GPTExamples.svelte";
    import IntroSummaryBottles from "$components/Intro.SummaryBottles.svelte";
    import IntroHeadline from "$components/Intro.Headline.svelte";
    import { bottleSelected, animalSelected } from "$stores/misc.js";

    let scrollIndex;
    let scrollyContainer; // Reference to the Scrolly container

    const copy = getContext("copy");
    const openingWines = [
        { animal: "cattle", name: "Pinotage", winery: "Survivor", country: "South Africa", price: 21.99, bottleSlot: "left", targetPos: "25%", startingPos: "-75%", rangeValue: 0 },
        { animal: "cat", name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { animal: "bird", name: "Pinot Noir", winery: "Mohua", country: "New Zealand", price: 21.95, bottleSlot: "right", targetPos: "75%", startingPos: "-25%", rangeValue: 0 }
    ];
    let shouldSpin = [false, false, false];

    const steps = copy.steps;

    $: selectedText = copy.opening[0][$animalSelected];
    $: selectedPriceText = copy.opening[0][($animalSelected + "Price")];
    $: selectedRatingText = copy.opening[0][($animalSelected + "Rating")];

    function handleRandomClick() {
        const randomAnimal = openingWines[Math.floor(Math.random() * openingWines.length)];
        
        handleBottleClick(randomAnimal)
    }

    function handleBottleClick(data) {
        // console.log("Bottle clicked in Intro4:", data);
        // Perform additional actions if needed
        animalSelected.set(data.animal);
        bottleSelected.set(true);

        const products = document.querySelectorAll(".product");
        products.forEach((product) => {
        const prodAnimal = product.getAttribute("data-animal");
        const wineDiv = product.querySelector(".wine");
        if (prodAnimal !== $animalSelected) {
            product.classList.add("faded");
            product.style.left = data.startingPos;
        } else {
            product.classList.remove("faded");
            product.style.left = "50%";
        }
        });

        shouldSpin = Array.from(products).map(
            (product) => product.style.left === "50%" ? false : true
        );

        products.forEach((product) => {
        const wineDiv = product.querySelector(".wine");
        if (wineDiv) {
            if (product.style.left === "50%") {
            wineDiv.classList.remove("spin");
            } else {
            wineDiv.classList.add("spin");
            }
        }
        });

    }

    // When $bottleSelected becomes true, scroll to the second step (index 1)
    $: if ($bottleSelected) {
        setTimeout(() => {
            const stepElements = scrollyContainer.querySelectorAll('.step');
            if (stepElements[1]) {
                // Get the element's top relative to the document
                const elementTop = stepElements[1].getBoundingClientRect().top + window.pageYOffset;
                // Calculate the target scroll position with a 10% viewport height offset
                const offset = elementTop - (window.innerHeight * 0.10);
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }, 500);
    }
</script>

<section id="intro">
    <div class="sticky">
        <IntroHeadline scrollIndex={scrollIndex}/>
        <Bottles scrollIndex={scrollIndex}/>
        <GPTExamples scrollIndex={scrollIndex} exampleType={"correct"}/>
        <GPTExamples scrollIndex={scrollIndex} exampleType={"wrong"}/>
        <IntroSummaryBottles scrollIndex={scrollIndex}/>
    </div>
    <Scrolly bind:value={scrollIndex} bind:container={scrollyContainer}>
        {#each steps as step, i}
            <div class="step">
                <div class="step-inner">
                    <p> 
                        {#if i == 1}
                            {@html selectedText}
                        {:else if i == 6}
                            {@html step.value}
                            {@html selectedPriceText}
                        {:else if i == 7}
                            {@html step.value}
                            {@html selectedRatingText}
                        {:else}
                            {@html step.value}
                                {#if i == 0}
                                    <span on:click={handleRandomClick} class="instructions">{copy.opening[0].instructions}</span>
                                {/if}
                        {/if}
                    </p>
                </div>
            </div>
        {/each}
    </Scrolly>
    <!-- <div class="spacer" /> -->
</section>
<section id="post-intro">
    {#each copy.postIntro as graf, i}
        <p class="prose">{@html graf.value}</p>
    {/each}
    <!-- {#if hoverImageVisible}
        <img transition:fade={{duration:250}} src={hoverImageSrc} class="hover-image" style={hoverImageStyle} />
    {/if} -->
</section>

<style>
    #intro, #post-intro {
        width: 100%;
        position: relative;
    }

    #post-intro {
        width: 100%;
        max-width: 700px;
        margin: 4rem auto;
    }

    .prose {
        color: var(--wine-tan);
        font-size: var(--18px);
        line-height: 1.65;
    }

    .sticky {
        width: 100%;
        height: 100svh;
		position: sticky;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
		top: 0;
        left: 0;
		transition: all 1s;
        z-index: 1;
        overflow: hidden;
	}

    .spacer {
		height: 200vh;
	}
	.step {
		height: 100vh;
        z-index: 1000;
        max-width: 550px;
        margin: 0 auto;
        opacity: 1;
        pointer-events: none;
        z-index: 1000;
	}

    .step:first-of-type {
        margin-top: -90vh;
    }

    .step-inner {
        background: rgba(24,26,31,0.98);
        padding: 2rem; 
        border: 1px solid var(--wine-dark-gray);
        border-radius: 3px;
        box-shadow: -4px 4px 10px rgb(17, 17, 17, 0.5);
    }

    .step p {
        text-align: left;
        max-width: 600px;
        color: var(--wine-tan);
        font-size: var(--18px);
        line-height: 1.65;
        background: none;
        z-index: 1000;
        margin: 0;
        pointer-events: auto;
    }

    :global(.instructions) {
        display: block;
        font-family: var(--sans);
        font-size: var(--16px);
        text-decoration: underline;
        cursor: pointer;
        margin-top: 1rem;
    }

    :global(.prompt) {
        font-family: var(--mono);
        font-size: var(--16px);
        background: rgba(154,150,142, 1);
        color: var(--wine-black);
        padding: 0.25rem;
        border-radius: 3px;
        box-decoration-break: clone;
    }

    :global(.selected-animal-span) {
        font-family: var(--sans);
        font-weight: 700;
        padding: 0.25rem;
        border-radius: 3px;
        border: 3px solid var(--wine-red);
        box-decoration-break: clone;
    }

    :global(.step p a) {
        color: var(--wine-tan);
    }

    :global(.step .bold) {
        font-family: var(--sans);
    }

    :global(.step p a:hover) {
        color: var(--wine-red);
    }

    @media(max-width: 700px) {
        .step p {
            font-size: var(--16px);
        }

        :global(.prompt) {
            font-size: var(--14px);
        }

        #post-intro {
            padding: 0 1rem;
        }

        .prose {
            font-size: var(--16px);
        }
    }
</style>