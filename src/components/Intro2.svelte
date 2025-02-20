<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import arrowDown from "$svg/arrow-down-circle.svg";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    const copy = getContext("copy");
    const steps =[0,1,2,3,4];
    const openingWines = [
        { name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", targetPos: "25%", startingPos: "-75%", rangeValue: 0 },
        { name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", targetPos: "75%", startingPos: "-25%", rangeValue: 0 }
    ];

    let scrollIndex;
    let bottlesWidth = 0;
    let bottlesHeight = 0;
    let animationsFire = false;
    let pricesLocked = false;
    let pricesSkipped = false;
    let hoverImageSrc;
    let hoverImageVisible = false;
    let hoverImageStyle;
    let bottleHighlights;
    let buttonVisible = false;

    $: selectedText = animationsFire 
        ? (!pricesLocked && scrollIndex === undefined) 
            ? copy.intro[0] 
            : (pricesLocked && scrollIndex === undefined) 
                ? copy.intro[1] 
                : (pricesLocked && scrollIndex !== undefined) 
                    ? copy.intro[scrollIndex+2] 
                    : null 
        : null;

    onMount(() => {
        if (scrollIndex !== undefined) {
            document.body.style.overflow = "visible";
        }
        setTimeout(() => {
            animationsFire = true;
        }, 500)

        setTimeout(() => {
            buttonVisible = true;
        }, 3500)

        bottleHighlights = document.querySelectorAll(".bottleHighlight");
        bottleHighlights.forEach(bottle => {
            bottle.addEventListener("mouseenter", (event) => handleBottleHover(event, true));
            bottle.addEventListener("mouseleave", (event) => handleBottleHover(event, false));
        });
    })

    function handleBottleHover(event, isHovering) {
        if (!event || !event.target) return;
        const element = event.target;
        if (!element) return;
        const rect = element.getBoundingClientRect();

        const container = document.getElementById("post-intro");
        if (!container) return;
        const containerRect = container.getBoundingClientRect();

        const topOffset = rect.top - containerRect.top; 
        const leftOffset = rect.left - containerRect.left;

        const isLeft = rect.left < window.innerWidth / 2; // Determine if it's on the left or right

        const spanText = element.innerText.trim().replace(/\s+/g, '-');
        const newSrc = `assets/images/1spans/${spanText}.png`;

        if (isHovering && spanText) {
            if (hoverImageSrc !== newSrc) {
                hoverImageSrc = ""; // Temporarily reset
                setTimeout(() => {
                    hoverImageSrc = newSrc; // Update after a brief moment
                }, 10);
            }
            hoverImageVisible = true;
            hoverImageStyle = `
                top: ${topOffset-75}px; 
                left: ${isLeft ? "-15%" : "100%"}; 
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
        pricesSkipped = true;
        pricesLocked = true;
        lockClick();
    }
</script>

<section id="intro">
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
                            {#if pricesSkipped && scrollIndex == undefined}
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
            <div class="bottles" bind:clientHeight={bottlesHeight} bind:clientWidth={bottlesWidth}>
                {#if bottlesWidth && bottlesHeight}
                    {#each openingWines as wine, i}
                        <SpinningBottle 
                            pricesLocked={pricesLocked}
                            pricesSkipped={pricesSkipped}
                            scrollIndex={scrollIndex}
                            bottleIndex={i}
                            wineData={wine}
                            containerDimensions={{bottlesWidth, bottlesHeight}}
                            bottlePosLeft={scrollIndex == undefined && animationsFire ||
                                scrollIndex >=0 && scrollIndex <2 && animationsFire
                                ? wine.targetPos 
                                : wine.startingPos}
                            bind:rangeValue={wine.rangeValue} />
                    {/each}
                {/if}
            </div>
            <div class="controls" class:hidden={scrollIndex >= 0 || scrollIndex == "exit"}>
                {#if !pricesLocked}
                <div class="button-wrapper">
                    <button id="lock" on:click={lockClick} disabled={!buttonVisible}>
                        Set prices
                    </button>
                    <button id="skip" on:click={skipLock} disabled={!buttonVisible}>
                        Just show me the prices
                    </button>
                </div>
                {:else}
                <div class="scroll-hint" transition:fade={{duration:500}}>
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
                <div class="bg-text">
                    <div class="head-container" style={parent_style}>
                        <h1 use:fit={{min_size: 12, max_size:350 }} class:highlight={scrollIndex == 4 || scrollIndex == "exit"}>The pour-gin<br> of species</h1>
                        <h1 use:fit={{min_size: 12, max_size:350 }} class:highlight={scrollIndex == 4 || scrollIndex == "exit"}>The pour-gin<br> of species</h1>
                    </div>
                    <div class="byline" style="opacity: {scrollIndex == 4 || scrollIndex == "exit" ? 1 : 0}">
                        <p class="strikethrough">By {copy.bylineFake}<span class="strike-line" class:animate={scrollIndex == 4 || scrollIndex == "exit"}></span></p>
                        <p>By {@html copy.byline}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
<section id="post-intro">
    {#each copy.postHeadline as graf, i}
        <p class="prose">{@html graf.value}</p>
    {/each}
    {#if hoverImageVisible}
        <img transition:fade={{duration:250}} src={hoverImageSrc} class="hover-image" style={hoverImageStyle} alt="mini wine bottle" />
    {/if}
</section>

<style>
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
		height: 200svh;
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

    .fg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 6rem 2rem 4rem 2rem;
        z-index: 1000; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 1.5rem;
        pointer-events: none;
    }

    .bottles {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        pointer-events: none;
        gap: 4rem;
    }

    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        pointer-events: auto;
        transition: all 1s;
    }

    .controls.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .button-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        pointer-events: auto;
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

    #lock:hover:enabled {
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

    #skip:hover:enabled {
        opacity: 0.5;
        transform: translateY(-4px);
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

    @keyframes bounceUp {
        0%       { bottom:2px; }
        25%, 75% { bottom:4px; }
        50%      { bottom:6px; }
        100%     { bottom:0; }
    }

    .scroll-hint p {
        color: var(--wine-tan);
        font-family: var(--sans);
        padding: 0.5rem 0;
        margin: 0;
        font-weight: 700;
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
        font-family: var(--sans);
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

    .bg {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        width: 100%;
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
    .bg-text {
        width:100%;
        height:100%;
    }

    .head-container {
        width: 100%;
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .bg-text h1 {
        width: 100%;
        font-size: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: "Manuka";
        text-transform: uppercase;
        color: var(--wine-dark-gray);
        line-height: 0.8;
        text-align: center;
        opacity: 0.4;
        transition: opacity 1s ease-in, color 1s ease-in;
    }

    .bg-text h1:nth-child(2) {
        opacity: 0;
        animation: animate 8s ease-in-out infinite;
        animation-play-state: paused; 
        transition: opacity 1s ease-in 1s, color 1s ease-in 1s; /* 1s delay */
    }

    .bg-text h1:nth-child(1).highlight {
        opacity: 1;
        color: var(--wine-tan);
    }

    .bg-text h1:nth-child(2).highlight {
        color: #d0b3bc;
        opacity: 1;
        animation-play-state: running;
        transition-delay: 0s;
    }

    .bg-text h1:nth-child(2):not(.highlight) {
        transition: opacity 0s ease-in-out, color 0s ease-in-out;
    }

    @keyframes animate {
        0%, 100% {
            clip-path: path("M0,100 C150,0 350,250 600,100 C850,0 1050,250 1200,100 C1350,0 1550,250 1800,100 L1800,600 L0,600 Z");
        }
        50% {
            clip-path: path("M0,160 C150,40 350,340 600,160 C850,-20 1050,340 1200,160 C1350,40 1550,340 1800,160 L1800,600 L0,600 Z");
        }
    }

    .byline {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--wine-tan);
        font-family: var(--sans);
        padding-top: 4rem;
        transition: opacity 0.5s ease-in;
    }

    .byline p {
        font-size: var(--18px);
        margin: 0;
        padding: 0;
        position: relative;
    }

    :global(.byline p a) {
        color: var(--wine-tan);
    }

    :global(.byline p a:hover) {
        color: var(--wine-red);
    }

    .strike-line {
        position: absolute;
        top: 50%;
        left: -5%;
        border-top: 3px solid var(--wine-red);
        width: 0;
        transform: rotate(-1deg);
        transition: width 1s ease-in 2s;
    }

    .strike-line.animate {
        width: 175px;
    }

    #post-intro {
        max-width: 700px;
        margin: 0 auto;
        margin-bottom: 10rem;
        position: relative;
    }
    #post-intro .prose {
        font-size: var(--20px);
        line-height: 1.65;
        color: var(--wine-tan);
    }

    .hover-image {
        position: absolute;
        width: 80px;
        height: auto;
        z-index: 1000;
        transition: opacity 0.3s ease;
        pointer-events: none;
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
</style>