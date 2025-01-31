<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import Range from "$components/helpers/Range.svelte";
    import Icon from "$components/helpers/Icon.svelte";
    import * as d3 from 'd3';

    const copy = getContext("copy");
    let textFade = false;
    let scrollIndex;
    let steps = [0,1,2,3];

    let animals = ["frog", "bird", "lion"];
    $: currAnimalIndex = 0;
    $: currAnimal = animals[currAnimalIndex];

    onMount(async () => {
        setTimeout(() => {
            textFade = true;
        }, 1000);
	});

    function lockClick() {
        if (currAnimalIndex < animals.length - 1) {
            currAnimalIndex += 1;
        }
    }

    $: console.log(currAnimal)

</script>

<section id='intro'>
    <div class="sticky">
        <div class="slider-container">
            <div class="range-wrapper">
                {#each animals as animal, i}
                    <Range max=700 min=0 showTicks={true} animal={animal} rangeIndex={i} currAnimalIndex={currAnimalIndex} />
                {/each}
            </div>
            <button 
                id="price-lock"
                on:click={lockClick}
            >
            Lock Price</button>
        </div>
        <div class="bg-text-container">
            <div class="bg-text" style={parent_style}>
                <h1 use:fit={{min_size: 12, max_size:400 }}>The pour-gin<br> of species</h1>
            </div>
        </div>
        {#if currAnimalIndex >= 2}
            <SpinningBottle bottlePos="left" {scrollIndex}/>
        {/if}
        {#if currAnimalIndex  == undefined || currAnimalIndex >= 0}
            <SpinningBottle bottlePos="center" {scrollIndex}/>
        {/if}
        {#if currAnimalIndex >= 1}
            <SpinningBottle bottlePos="right" {scrollIndex}/>
        {/if}
        <div class="text-container">
            {#each copy.intro.slice(0,2) as text, i}
                {#if textFade && currAnimalIndex == 0}
                    <p  
                        id="intro-text-{i}"
                        in:fly={{ delay: 1000*i, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                    >{text.value}
                    {#if i == 1}
                        <span><Icon name="arrow-down" /></span>
                    {/if}
                </p>
                {/if}
            {/each}
            {#if textFade && currAnimalIndex == 1}
                {#each copy.intro.slice(2,4) as text, i}
                        <p  
                            id="intro-text-{i}"
                            in:fly={{ delay: 500*i, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                            out:fade
                        >{text.value}
                    </p>
                {/each}
            {/if}
            {#if textFade && currAnimalIndex == 2}
                {#each copy.intro.slice(4,6) as text, i}
                    <p  
                        id="intro-text-{i}"
                        in:fly={{ delay: 500*i, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                        >{text.value}
                    </p>
                {/each}
            {/if}
        </div>
    </div>
</section>

<style>
    #intro {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 100svh;
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

    .sticky {
        width: 100%;
        height: 100svh;
        padding: 4rem 1rem;
		position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
		top: 0;
		transition: all 1s;
        z-index: 1;
        overflow: hidden;
	}
    .ranges {
        z-index: 1000;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        position: absolute;
        top: 0;
        left: 0;
        padding: 1rem 10%;
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
    }

    .wine-bottle-container {
        height: 100%;
        width: 100%;
        position: absolute;
        display: flex;
        /* align-items: center; */
        justify-content: center;
        z-index: 800;
        padding: 3rem 0;
    }

    .wine-bottle-container img {
        height: 100%;
    }

    .text-container {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 999;
        pointer-events: none;
    }

    .text-container p {
        font-size: var(--20px);
        max-width: 300px;
        position: absolute;
        color: var(--wine-tan);
        pointer-events: auto;
        transition: 0.5s opacity linear;
    }

    #intro-text-0 {
        top: 10%;
        left: 10%;
    }

    #intro-text-1 {
        top: 30%;
        right: 10%;
    }

    #intro-text-2 {
        top: 50%;
        left: 10%;
    }

    #intro-text-3 {
        top: 70%;
        right: 10%;
    }

    #intro-text-4 {
        top: 30%;
        left: 10%; 
    }

    #intro-text-5 {
        top: 80%;
        right: 10%;
    }

    #intro-text-6 {
        top: 80%;
        left: 50%;
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
        opacity: 0;
        pointer-events: none;
	}

    .step p {
        background: white;
        padding: 2rem 1rem;
        border: 1px solid var(--fanfic-black);
        pointer-events: auto;
    }
</style>