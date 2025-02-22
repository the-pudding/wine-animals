<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import GPTExamples from "$components/GPTExamples.svelte";
    import arrowDown from "$svg/arrow-down-circle.svg";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { bottleSelected, animalSelected } from "$stores/misc.js";

    const copy = getContext("copy");
    const openingWines = [
        { animal: "lion", name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", targetPos: "25%", startingPos: "-75%", rangeValue: 0 },
        { animal: "frog", name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { animal: "songbird", name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", targetPos: "75%", startingPos: "-25%", rangeValue: 0 }
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
    let bottleRefs = []; // References to child components
    let scrollY;

    $: selectedText = $bottleSelected == false ? copy.intro[0] : "test"; 

    onMount(() => {
        setTimeout(() => {
            animationsFire = true;
        }, 500)

        bottleHighlights = document.querySelectorAll(".bottleHighlight");
        bottleHighlights.forEach(bottle => {
            bottle.addEventListener("mouseenter", (event) => handleBottleHover(event, true));
            bottle.addEventListener("mouseleave", (event) => handleBottleHover(event, false));
        });
    })

    $: if ($animalSelected !== undefined){
        document.body.style.overflow = "visible";
    }

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

    function handleRandomClick() {
        const animals = ["lion", "frog", "songbird"];
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
    $: console.log(scrollY)
</script>

<svelte:window bind:scrollY={scrollY} />

<section id="intro">
    <div class="sticky">
        <div class="fg">
            <div class="text-container" class:hidden={scrollY > 50}>
                {#if $animalSelected == undefined}
                    <p  
                        id="intro-text"
                        in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade={{delay: 0, duration: 500}}
                    >   
                        {@html copy.opening[0].text}
                        <span on:click={handleRandomClick} class="instructions">{copy.opening[0].instructions}</span>
                    </p>
                {:else}
                    <p  
                        id="intro-text"
                        in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade={{delay: 0, duration: 500}}
                    >   
                        {#if $animalSelected == "lion"}
                            {@html  copy.opening[0].lionText}
                        {:else if $animalSelected == "frog"}
                            {@html  copy.opening[0].frogText}
                        {:else if $animalSelected == "songbird"}
                            {@html copy.opening[0].birdText}
                        {/if}
                    </p>
                {/if}
            </div>
            <div class="bottles" bind:clientHeight={bottlesHeight} bind:clientWidth={bottlesWidth}>
                {#if bottlesWidth && bottlesHeight}
                    {#each openingWines as wine, i}
                        <SpinningBottle 
                            bind:this={bottleRefs[i]}
                            scrollY={scrollY}
                            bottleIndex={i}
                            wineData={wine}
                            containerDimensions={{bottlesWidth, bottlesHeight}}
                            bottlePosLeft={scrollY < 50 && animationsFire
                                ? wine.targetPos 
                                : wine.startingPos}
                            bind:rangeValue={wine.rangeValue} />
                    {/each}
                {/if}
            </div>
            <div class="controls" class:hidden={$animalSelected == undefined || scrollY > 50}>
                <div class="scroll-hint" transition:fade={{duration:500}}>
                    <div class="svg-wrapper">
                        {@html arrowDown}
                    </div>
                    <p>How do we know?</p>
                </div>
            </div>
        </div>
        <div class="bg">
            <div class="bg-text-container">
                <div class="bg-text">
                    <div class="head-container" style={parent_style}>
                        <h1 use:fit={{min_size: 12, max_size:350 }}>The pour-gin<br> of species</h1>
                        <h1 use:fit={{min_size: 12, max_size:350 }}>The pour-gin<br> of species</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="post-bottles">
        {#each copy.steps as step, i}
            {#if i == 0}
                <div class="step">
                    <p>{@html step.value}</p>
                    <GPTExamples exampleType="right"/>
                </div>
            {:else if i == 1}
                <div class="step">
                    <p>{@html step.value}</p>
                    <GPTExamples exampleType="wrong"/>
                </div>
            {:else}
                <div class="step">
                    <p>{@html step.value}</p>
                </div>
            {/if}
        {/each}
    </div>
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

    .post-bottles {
        z-index: 1000;
    }

    .spacer {
		height: 200svh;
	}

	.step {
        width: 100%;
        z-index: 1000;
        margin: 0 auto;
        opacity: 1;
        pointer-events: none;
        display: flex;
        flex-direction: column;
	}

    .step p {
        text-align: left;
        max-width: 700px;
        line-height: 1.65;
        color: var(--wine-tan);
        font-size: var(--20px);
        line-height: 1.65;
        background: none;
        z-index: 1000;
        margin: 0 auto;
    }

    :global(.prompt) {
        background: var(--wine-tan);
        color: var(--wine-black);
        font-family: var(--mono);
        font-weight: 600;
        font-size: var(--15px);
    }

    :global(.step p a) {
        color: var(--wine-tan);
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
        transition: 0.5s opacity linear;
    }

    .controls.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .scroll-hint {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .scroll-hint p {
        font-family: var(--sans);
        font-size: var(--30px);
        font-weight: 700;
        text-transform: uppercase;
        color: var(--wine-red);
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

    .text-container.hidden {
        opacity: 0;
    }

    .instructions {
        display: block;
        max-width: 280px;
        margin: 0 auto;
        font-family: var(--sans);
        font-size: var(--16px);
        padding: 0.5rem 0;
        text-decoration: underline;
        cursor: pointer;
    }

    .instructions:hover {
        opacity: 0.5;
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
</style>