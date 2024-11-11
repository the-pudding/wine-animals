<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import Scrolly from "$components/helpers/Scrolly.svelte";
    import Icon from "$components/helpers/Icon.svelte";
    import * as d3 from 'd3';

    const copy = getContext("copy");
    let textFade = false;
    let scrollIndex;
    let steps = [0,1,2,3];

    let introText0;
    let introText1;
    let introText2;
    let introText3;

    onMount(async () => {
        setTimeout(() => {
            textFade = true;
        }, 1000);
	});

</script>

<section id='intro'>
    <div class="sticky">
        <div class="bg-text-container">
            <div class="bg-text" style={parent_style}>
                <h1 use:fit={{min_size: 12, max_size:400 }}>The pour-gin of species</h1>
            </div>
        </div>
        {#if scrollIndex >= 1}
            <SpinningBottle bottlePos="left" {scrollIndex}/>
        {/if}
        {#if scrollIndex  == undefined || scrollIndex >= 0}
            <SpinningBottle bottlePos="center" {scrollIndex}/>
        {/if}
        {#if scrollIndex >= 0}
            <SpinningBottle bottlePos="right" {scrollIndex}/>
        {/if}
        <div class="text-container">
            {#each copy.intro.slice(0,4) as text, i}
                {#if textFade && scrollIndex == undefined}
                    <p  
                        id="intro-text-{i}"
                        in:fly={{ delay: 500*i, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                    >{text.value}
                    {#if i == 3}
                        <span><Icon name="arrow-down" /></span>
                    {/if}
                </p>
                {/if}
            {/each}
            {#if textFade && scrollIndex == 0}
                <p  
                        id="intro-text-4"
                        in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                    >{copy.intro[4].value}
                </p>
            {/if}
            {#if textFade && scrollIndex == 1}
                <p  
                        id="intro-text-5"
                        in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                    >{copy.intro[5].value}
                </p>
            {/if}
            {#if textFade && scrollIndex >= 2}
                <p  
                        id="intro-text-6"
                        in:fly={{ delay: 500, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                        out:fade
                    >{copy.intro[6].value}
                </p>
            {/if}
        </div>
    </div>
    <Scrolly bind:value={scrollIndex}>
        {#each steps as step, i}
            <div class="step"></div>
        {/each}
    </Scrolly>
    <div class="spacer" />
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