<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import SpinningBottle from "$components/SpinningBottle.svelte";

    const copy = getContext("copy");
    let textFade = false;
    let pricesLocked = false;
    let scrollIndex;

    let openingWines = [
        { name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", bottleVisible: false, targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", bottleVisible: false, targetPos: "75%", startingPos: "-50%", rangeValue: 0 },
        { name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", bottleVisible: false, targetPos: "25%", startingPos: "-50%", rangeValue: 0 }
    ];

    onMount(() => {
        setTimeout(() => {
            textFade = true;
        }, 1000);

        openingWines.forEach((wine, i) => {
            setTimeout(() => {
                wine.bottleVisible = true;
            }, (i + 1) * 1000);
        });
    });


    function lockClick() {
        pricesLocked = true;
        document.body.style.overflow = "visible";
    }

    $: console.log({scrollIndex});
</script>

<section id='intro'>
    <div class="sticky">
        <div class="fg">
            <div class="text-container">
                {#if textFade && !pricesLocked}
                    <p  
                        id="intro-text"
                        in:fly={{ delay: 1000, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade={{delay: 0, duration: 500}}
                        >{copy.intro.slice(0,1)[0].text}
                        <span class="instructions">{copy.intro.slice(0,1)[0].instructions}</span>
                    </p>
                {:else if textFade && pricesLocked}
                    <p  
                        id="intro-text"
                        in:fly={{ delay: 1000, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade={{delay: 0, duration: 500}}
                        >{copy.intro.slice(1,2)[0].text}
                        <span class="instructions">{copy.intro.slice(1,2)[0].instructions}</span>
                    </p>
                {/if}
            </div>
            <div class="bottles">
                {#each openingWines as wine, i}
                    <SpinningBottle 
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
            <div class="controls">
                <button id="lock" on:click={lockClick}>
                    Set prices
                </button>
                <p>Skip to story</p>
            </div>
        </div>
        <div class="bg">
            <div class="bg-text-container">
                <div class="bg-text" style={parent_style}>
                    <h1 use:fit={{min_size: 12, max_size:400 }}>The pour-gin<br> of species</h1>
                </div>
            </div>
        </div>
    </div>
    <Scrolly bind:value={scrollIndex}>
        {#each copy.scroll as step, i}
            <div class="step"><p>{step.value}</p></div>
        {/each}
    </Scrolly>
    <div class="spacer" />
    <div class="post-scroll prose">
        {#each copy.postScroll as graf, i}
            <p>{graf.value}</p>
        {/each}
    </div>
</section>

<style>
    #intro {
        width: 100%;
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
		transition: all 1s;
        z-index: 1;
        overflow: hidden;
	}

    .spacer {
		height: 75vh;
	}
	.step {
		height: 80vh;
		text-align: center;
        z-index: 1000;
        max-width: 30rem;
        margin: 0 auto;
        opacity: 1;
        pointer-events: none;
	}

    .step:first-of-type {
        margin-top: 20%;
    }

    .step p {
        background: white;
        padding: 2rem 1rem;
        border: 1px solid var(--fanfic-black);
        pointer-events: auto;
    }

    .prose {
        max-width: 700px;
        margin: 0 auto;
    }

    .prose p {
        color: var(--wine-tan);
    }

    .fg, .bg {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 100svh;
        padding: 2rem;
    }

    .fg {
        z-index: 1000; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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