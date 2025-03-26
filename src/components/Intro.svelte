<script>
    // SVELTE
    import { getContext } from "svelte";

    // STORES
    import { bottleSelected, animalSelected } from "$stores/misc.js";

    // COMPONENTS
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import Bottles from "$components/Intro.Bottles.svelte";
    import GPTExamples from "$components/GPTExamples.svelte";
    import IntroSummaryBottles from "$components/Intro.SummaryBottles.svelte";
    import IntroHeadline from "$components/Intro.Headline.svelte";
    import Icon from "$components/helpers/Icon.svelte";
    import tapSVG from "$svg/touch.svg"

    // VARIABLES
    const copy = getContext("copy");
    const openingWines = [
        { animal: "cat", name: "Poppóne", winery: "Antonutti", country: "Italy", price: 34.99, rating: 4.3, bottleSlot: "farleft", targetPos: "20%", startingPos: "-80%", wineQuad: "good expensive"},
        { animal: "bird", name: "Sauvignon Blanc", winery: "Tomtit", country: "New Zealand", price: 22.67, rating: 4.1, bottleSlot: "centerleft", targetPos: "40%", startingPos: "-60%", wineQuad: "good cheap"},
        { animal: "pig", name: "Sus Scrofa", winery: "Pardas", country: "Spain", price: 20.83, rating: 3.6,  bottleSlot: "centerright", targetPos: "60%", startingPos: "-40%", wineQuad: "bad cheap"},
        { animal: "amphibian/reptile", name: "Tïn Bianco", winery: "Montesecondo", country: "Italy", price: 39.99, rating: 3.8, bottleSlot: "farright", targetPos: "80%", startingPos: "-20%", wineQuad: "bad expensive"},
    ];
    const steps = copy.steps;
    
    let shouldSpin = [false, false, false, false];
    let scrollIndex;
    let scrollyContainer; // Reference to the Scrolly container

    $: selectedText = $animalSelected == "amphibian/reptile" ? copy.opening[0]["amphibian"] : copy.opening[0][$animalSelected];
    $: selectedPriceText = $animalSelected == "amphibian/reptile" ? copy.opening[0][("amphibianPrice")] : copy.opening[0][($animalSelected + "Price")];
    $: selectedRatingText = $animalSelected == "amphibian/reptile" ? copy.opening[0][("amphibianRating")] : copy.opening[0][($animalSelected + "Rating")];

    // INTERACTION FUNCTIONS
    // Selects random wine
    function handleRandomClick() {
        document.body.style.overflowY = "auto";
        const randomAnimal = openingWines[Math.floor(Math.random() * openingWines.length)];
        handleBottleClick(randomAnimal)
    }

    // Handles the wine click and sets selected wine
    function handleBottleClick(data) {
        document.body.style.overflowY = "auto";
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

    // Scrolls to second step once wine is selected
    function scrollToStep($animalSelected) {
        if ($bottleSelected) {
            setTimeout(() => {
                const stepElements = scrollyContainer.querySelectorAll('.step');
                if (stepElements[1]) {
                    const elementTop = stepElements[1].getBoundingClientRect().top + window.pageYOffset;
                    const offset = elementTop - (window.innerHeight * 0.10);
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }, 500);
        }
    }

    // REATIVE FUNCTIONS
    // Scroll to the second step once bottle is selected
    $: scrollToStep($animalSelected);
    // Unlock body scroll
    $: if (scrollIndex >= 1) {
        document.body.style.overflowY = "auto";
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
                                    <p class="instructions">
                                        <span class="tap-icon">{@html tapSVG}</span>
                                        Tap on a bottle or
                                        <span class="random-click" on:click={handleRandomClick}>get a random bottle</span>
                                    </p>
                                {/if}
                        {/if}
                    </p>
                    {#if i == 1}
                        <div class="scroll-hint">
                            <Icon name="chevron-down" size={"1.5rem"}/>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </Scrolly>
</section>

<section id="post-intro">
    {#each copy.postIntro as graf, i}
        <p class="prose">{@html graf.value}</p>
    {/each}
</section>

<style>
    #intro, #post-intro {
        width: 100%;
        position: relative;
    }

    #post-intro {
        width: 100%;
        max-width: 720px;
        margin: 4rem auto;
        z-index: 900;
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
        position: relative;
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

    .scroll-hint {
        width: 3rem;
        height: 3rem;
        background: var(--wine-gold);
        position: absolute;
        bottom: -1.5rem;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: bounceUp 1s infinite;
    }

    :global(.scroll-hint .icon) {
        margin-top: 6px;
    }

    :global(.instructions) {
        font-family: var(--sans);
        color: var(--wine-gold) !important;
        font-size: var(--16px) !important;
        font-weight: 700;
        position: relative;
        display: inline-block;
    }

    :global(a.methods-link) {
        color: var(--wine-gold) !important;
    }

    :global(a.methods-link:hover) {
        color: var(--wine-dark-gold) !important;
    }

    .instructions span {
        color: var(--wine-gold);
    }

    .tap-icon {
        display: inline-block;
        position: relative;
        top: 0.5rem;
        width: 1.75rem;
        height: 1.75rem;
    }

    :global(.tap-icon svg) {
        width: 100%;
        height: 100%;
    }

    :global(.tap-icon svg path) {
        fill: var(--wine-gold);
        stroke-width: 3px;
    }

    .random-click {
        cursor: pointer;
        text-decoration: underline;
    }

    .random-click:hover {
        color: var(--wine-dark-gold);
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
        border: 3px solid var(--wine-gold);
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

    @keyframes bounceUp {
        0%       { bottom:-24px; }
        50%      { bottom:-28px; }
        100%     { bottom:-24px; }
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