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

    const steps = copy.steps;

    $: selectedText = copy.opening[0][$animalSelected];
    $: selectedPriceText = copy.opening[0][($animalSelected + "Price")]
    $: selectedRatingText = copy.opening[0][($animalSelected + "Rating")]

    $: console.log(scrollIndex, $animalSelected);

    function handleRandomClick() {
        const animals = ["cat", "cattle", "bird"];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        
        // Update shared state.
        animalSelected.set(randomAnimal);
        bottleSelected.set(true);
        
        // Find the index in openingWines that matches the random animal.
        const index = openingWines.findIndex(wine => wine.animal === randomAnimal);
            if (index !== -1 && bottleRefs[index]) {
                // Call the child's handleClick using the wine data from the parent.
                bottleRefs[index].handleClick(openingWines[index]);
            }
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
        justify-content: top;
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
	}

    .step:first-of-type {
        margin-top: -90vh;
    }

    .step-inner {
        background: rgba(24,26,31,0.98);
        padding: 2rem; 
        border: 1px solid var(--wine-dark-gray);
        border-radius: 3px;
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