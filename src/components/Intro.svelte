<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import inView from "$actions/inView.js";

    const copy = getContext("copy");
    const steps =[0,1,2,3,4];
    let textFade = false;
    let pricesLocked = false;
    let scrollIndex;

    let openingWines = [
        { name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", targetPos: "75%", startingPos: "-50%", rangeValue: 0 },
        { name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", targetPos: "25%", startingPos: "-50%", rangeValue: 0 }
    ];

    onMount(() => {
        setTimeout(() => {
            textFade = true;
        }, 1000);
    });


    function lockClick() {
        pricesLocked = true;
        document.body.style.overflow = "visible";
    }

    // $: console.log({scrollIndex});

    $: selectedText = textFade 
        ? (!pricesLocked && scrollIndex === undefined) 
            ? copy.intro[0] 
            : (pricesLocked && scrollIndex === undefined) 
                ? copy.intro[1] 
                : (pricesLocked && scrollIndex !== undefined) 
                    ? copy.intro[scrollIndex+2] 
                    : null 
        : null;
</script>

<section id='intro'>
    <div class="sticky">
        <div class="fg">
            <div class="text-container">
                {#if selectedText}
                    {#key selectedText}
                        <p  
                            id="intro-text"
                            in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                            out:fade={{delay: 0, duration: 500}}
                        >
                            {selectedText.text}
                            {#if selectedText.instructions}
                                <span class="instructions">{selectedText.instructions}</span>
                            {/if}
                        </p>
                    {/key}
                {/if}
            </div>
            <div class="bottles">
                {#each openingWines as wine, i}
                    <SpinningBottle 
                        scrollIndex={scrollIndex}
                        bottleIndex={i}
                        bottlePos={wine.bottleSlot} 
                        pricesLocked={pricesLocked}
                        startingPos={wine.startingPos}
                        targetPos={wine.targetPos}
                        actualPrice={wine.price}
                        bottleSlot={wine.bottleSlot}
                        bind:rangeValue={wine.rangeValue} />
                {/each}
            </div>
            <div class="controls" class:hidden={pricesLocked} transition:fade>
                <button id="lock" on:click={lockClick}>
                    Set prices
                </button>
                <p>Just show me the prices</p>
            </div>
        </div>
        <div class="bg">
            <div class="bg-text-container">
                <div class="bg-text" style={parent_style}>
                    <h1 class:highlight={scrollIndex == 4} use:fit={{min_size: 12, max_size:400 }}>The pour-gin<br> of species</h1>
                    {#if scrollIndex == 4}
                        <div class="byline" transition:fade>
                            <p>By Charles Dar-Wine</p>
                            <p>By Fox Meyer with Jan Diehm</p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="spacer" />
    <Scrolly bind:value={scrollIndex}>
        {#each steps as step, i}
            {#if i !== 3}
            <div class="step"></div>
            {:else}
                <div class="step">
                    {#each copy.preHeadline as graf, i}
                        <p>{graf.value}</p>
                    {/each}
                </div>
            {/if}
        {/each}
    </Scrolly>
    <div class="spacer" />
</section>
<section id="postIntro">
    {#each copy.postHeadline as graf, i}
        <p class="prose">{graf.value}</p>
    {/each}
</section>

<style>
    #postIntro {
        max-width: 700px;
        margin: 0 auto;
    }
    #postIntro .prose {
        font-size: var(--18px);
        line-height: 1.65;
        color: var(--wine-tan);
    }

    #intro {
        width: 100%;
        position: relative;
    }

    .sticky {
        width: 100%;
        height: calc(100svh - 100px);
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
		height: 50vh;
	}
	.step {
		height: 70vh;
		text-align: center;
        z-index: 1000;
        max-width: 700px;
        margin: 0 auto;
        opacity: 1;
        pointer-events: none;
	}

    /* .step:first-of-type {
        margin-top: 20%;
    } */

    .step p {
        text-align: left;
        max-width: 700px;
        line-height: 1.65;
        color: var(--wine-tan);
        font-size: var(--24px);
        line-height: 1.65;
        background: none;
        z-index: 1000;
        margin: 2rem 0;
    }

    .fg, .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 8rem 2rem 2rem 2rem;
    }

    .fg {
        z-index: 1000; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .bg {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        pointer-events: none;
    }

    .bottles {
        width: 100%;
        height: 60svh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .controls.hidden {
        opacity: 0;
        pointer-events: none;
    }

    #lock {
        z-index: 1000;
        margin: 0 auto;
        font-size: var(--16px);
        font-weight: 700;
        text-transform: uppercase;
        padding: 1rem;
        background: var(--wine-red);
        color: var(--wine-tan);
        transition: 0.5s all;
    }

    .controls p {
        color: var(--wine-tan);
        font-style: italic;
        font-family: var(--sans);
        padding: 0; 
        margin: 0;
        font-size: var(--14px);
    }

    #lock:hover {
        opacity: 0.8;
        transform: translateY(-4px);
    }

    .slider-container {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translate(0, -50%);
        height: 100svh;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .range-wrapper {
        height: 80svh;
        position: relative;
    }

    #price-lock {
        width: 3.5rem;
        text-transform: uppercase;
        font-size: var(--12px);
        font-weight: 700;
    }
    .bg-text-container {
		height: 80svh;
		width: 100%;
        padding: 6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
	}
    .bg-text h1 {
        font-family: "Manuka";
        text-transform: uppercase;
        color: var(--wine-dark-gray);
        line-height: 0.8;
        text-align: center;
        opacity: 0.4;
        transition: opacity 1s, color 1s;
    }

    .bg-text h1.highlight {
        opacity: 1;
        color: var(--wine-tan);
    }

    .byline {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--wine-tan);
        font-family: var(--sans);
        padding-top: 4rem;
    }

    .byline p {
        font-size: var(--18px);
        margin: 0;
        padding: 0;
    }

    .text-container {
        width: 100%;
        height: 6rem;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .text-container p {
        font-size: var(--24px);
        max-width: 700px;
        color: var(--wine-tan);
        pointer-events: auto;
        transition: 0.5s opacity linear;
        margin: 0;
        text-align: center;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .instructions {
        display: block;
        font-family: var(--sans);
        font-size: var(--16px);
        padding: 0.5rem 0;
    }
</style>