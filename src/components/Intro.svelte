<script>
    import { getContext, onMount } from "svelte";
    import { fit, parent_style } from "@leveluptuts/svelte-fit";
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import SpinningBottle from "$components/SpinningBottle.svelte";

    const copy = getContext("copy");
    let textFade = false;

    onMount(async () => {
        setTimeout(() => {
            textFade = true;
        }, 1000);
	});

</script>

<section id='intro'>
    <SpinningBottle />
    <!-- <div class="bg-text-container">
        <div class="bg-text" style={parent_style}>
            <h1 use:fit={{min_size: 12, max_size:400 }}>Wine Animals</h1>
        </div>
    </div>
    <div class="wine-bottle-container">
        <img src="./assets/images/bottles/wine-opener-1.png" />
    </div>
    <div class="text-container">
        {#each copy.intro as text, i}
            {#if textFade}
                <p
                    transition:fly={{ delay: 500*i, duration: 1000, y: 100, opacity: 0, easing: quintOut }}
                >{text.value}</p>
            {/if}
        {/each}
    </div> -->
</section>

<style>
    #intro {
        width: 100%;
        height: calc(100vh - 4rem);
        position: relative;
    }
    .bg-text-container {
		height: 100%;
		width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
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
    }

    .text-container p {
        font-size: var(--20px);
        max-width: 300px;
        position: absolute;
    }

    .text-container p:first-of-type {
        top: 10%;
        left: 10%;
    }

    .text-container p:nth-of-type(2) {
        top: 30%;
        right: 10%;
    }

    .text-container p:nth-of-type(3) {
        top: 50%;
        left: 10%;
    }

    .text-container p:nth-of-type(4) {
        top: 70%;
        right: 10%;
    }
</style>