<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import arrowDown from "$svg/arrow-down-circle.svg";

    const copy = getContext("copy");
    const steps =[0,1,2,3,4];
    let textFade = false;
    let pricesLocked = false;
    let skipLocked = false;
    let scrollIndex;
    let bottleHighlights;

    let hoverImageSrc;
    let hoverImageVisible = false;
    let hoverImageStyle;

    let openingWines = [
        { name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", targetPos: "75%", startingPos: "-50%", rangeValue: 0 },
        { name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", targetPos: "25%", startingPos: "-50%", rangeValue: 0 }
    ];

    onMount(() => {
        setTimeout(() => {
            textFade = true;
        }, 1000);

        bottleHighlights = document.querySelectorAll(".bottleHighlight");

        bottleHighlights.forEach(bottle => {
            bottle.addEventListener("mouseenter", (event) => handleBottleHover(event, true));
            bottle.addEventListener("mouseleave", (event) => handleBottleHover(event, false));
        });

        if (scrollIndex !== undefined) {
            document.body.style.overflow = "visible";
        }
    });

    function handleBottleHover(event, isHovering) {
        if (!event || !event.target) return;
        const element = event.target;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const isLeft = rect.left < window.innerWidth / 2; // Determine if it's on the left or right

        const spanText = element.innerText.trim().replace(/\s+/g, '-');

        if (isHovering && spanText) {
            hoverImageSrc = `assets/images/1spans/${spanText}.png`; // Set image based on text
            hoverImageVisible = true;
            hoverImageStyle = `
                top: ${rect.top + window.scrollY-75}px; 
                left: ${isLeft ? "15%" : "80%"}; 
            `;
        } else {
            hoverImageVisible = false;
            hoverImageSrc = '';
        }
    }


    function lockClick() {
        pricesLocked = true;
        document.body.style.overflow = "visible";
    }

    function skipLock() {
        skipLocked = true;
        pricesLocked = true;
        lockClick();
    }

    function spanMouseover() {

    }

    $: selectedText = textFade 
        ? (!pricesLocked && scrollIndex === undefined) 
            ? copy.intro[0] 
            : (pricesLocked && scrollIndex === undefined) 
                ? copy.intro[1] 
                : (pricesLocked && scrollIndex !== undefined) 
                    ? copy.intro[scrollIndex+2] 
                    : null 
        : null;

    $: isStruck = scrollIndex == 4 ? true : false;
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
                            {#if skipLocked && scrollIndex == undefined}
                                {@html selectedText.skippedText}
                            {:else}
                                {@html selectedText.text}
                            {/if}
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
                        skipLocked={skipLocked}
                        bind:rangeValue={wine.rangeValue} />
                {/each}
            </div>
            <div class="controls" class:hidden={scrollIndex >= 0} transition:fade>
                {#if !pricesLocked}
                    <button id="lock" on:click={lockClick}>
                        Set prices
                    </button>
                    <button id="skip" on:click={skipLock}>
                        Just show me the prices
                    </button>
                {:else}
                <div class="scroll-hint">
                    <div class="svg-wrapper">
                        {@html arrowDown}
                    </div>
                    <p>Scroll</p>
                </div>
                {/if}
            </div>
        </div>
        <div class="bg">
            <div class="bg-text-container">
                <div class="bg-text" style={parent_style}>
                    <h1 class:highlight={scrollIndex == 4} use:fit={{min_size: 12, max_size:400 }}>The pour-gin<br> of species</h1>
                    {#if scrollIndex == 4}
                        <div class="byline" transition:fade>
                            <p class="strikethrough {isStruck ? 'animate' : ''}">By {copy.bylineFake}</p>
                            <p>By {@html copy.byline}</p>
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
                        <p>{@html graf.value}</p>
                    {/each}
                </div>
            {/if}
        {/each}
    </Scrolly>
    <div class="spacer" />
</section>
<section id="postIntro">
    {#each copy.postHeadline as graf, i}
        <p class="prose">{@html graf.value}</p>
    {/each}
    {#if hoverImageVisible}
        <img transition:fade={{duration:250}} src={hoverImageSrc} class="hover-image" style={hoverImageStyle} />
    {/if}
</section>

<style>
    .hover-image {
        position: absolute;
        width: 70px;
        height: auto;
        z-index: 1000;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .strikethrough {
    position: relative;
    display: inline-block;
}

.strikethrough::after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 2px;
    background: var(--wine-red); /* Change color if needed */
    transition: width 0.4s ease-in-out;
}

.strikethrough.animate::after {
    width: 100%;
}

    #postIntro {
        max-width: 700px;
        margin: 0 auto;
        margin-bottom: 10rem;
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
        padding: 6rem 2rem 4rem 2rem;
    }

    .fg {
        z-index: 1000; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 1.5rem;
        pointer-events: none;
    }

    .bg {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        /* pointer-events: none; */
    }

    .bottles {
        width: 100%;
        height: 60svh;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        pointer-events: none;
    }

    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        pointer-events: auto;
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

    #lock:hover {
        opacity: 0.8;
        transform: translateY(-4px);
    }

    #skip {
        background: transparent;
        color: var(--wine-tan);
        font-style: italic;
        font-family: var(--sans);
        padding: 0.5rem 0; 
        margin: 0;
        font-size: var(--14px);
        text-decoration: underline;
        transition: 0.5s all;
    }

    #skip:hover {
        opacity: 0.5;
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

    :global(.byline p a) {
        color: var(--wine-tan);
    }

    :global(.byline p a:hover) {
        color: var(--wine-red);
    }

    .text-container {
        width: 100%;
        height: 7rem;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        pointer-events: auto;
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

    :global(.actualPriceSpan, .yourGuessesSpan) {
        position: relative;
        margin-left: 2rem;
        font-weight: 700;
    }

    :global(.actualPriceSpan::before) {
        content: '';
        height: 1.25rem;
        width: 1.25rem;
        border: 2px dashed var(--wine-red);
        border-radius: 50%;
        position: absolute;
        top: 0.5rem;
        left: -1.75rem;
    }

    :global(.yourGuessesSpan::before) {
        content: '';
        height: 1.25rem;
        width: 1.25rem;
        background: var(--wine-tan);
        border-radius: 50%;
        position: absolute;
        top: 0.5rem;
        left: -1.75rem;
        opacity: 0.75;
    }

    .scroll-hint {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    :global(.scroll-hint svg) {
        fill: none;
        stroke: var(--wine-tan);
        height: 3rem;
        width: 3rem;
        stroke-width: 2px;
    }

    .svg-wrapper {
        position: relative;
        animation: bounceUp 1s infinite;
    }

    .scroll-hint p {
        color: var(--wine-tan);
        font-family: var(--sans);
        padding: 0.5rem 0;
        margin: 0;
        font-weight: 700;
    }

    :global(.bottleHighlight) {
        font-family: var(--sans);
        font-weight: 700;
        color: var(--wine-black);
        background: var(--wine-tan);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        cursor: pointer;
    }

    :global(.bottleHighlight:hover) {
        background: var(--wine-red);
    }

    @keyframes bounceUp {
        0%       { bottom:2px; }
        25%, 75% { bottom:4px; }
        50%      { bottom:6px; }
        100%     { bottom:0; }
    }
</style>