<script>
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import { tick } from 'svelte';

    export let scrollIndex;
    export let scrollyContainer;

    const openingWines = [
        { animal: "cat", name: "Poppóne", winery: "Antonutti", country: "Italy", price: 34.99, rating: 4.3, bottleSlot: "farleft", targetPos: "20%", startingPos: "-80%", wineQuad: "good expensive"},
        { animal: "bird", name: "Sauvignon Blanc", winery: "Tomtit", country: "New Zealand", price: 22.67, rating: 4.1, bottleSlot: "centerleft", targetPos: "40%", startingPos: "-60%", wineQuad: "good cheap"},
        { animal: "pig", name: "Sus Scrofa", winery: "Pardas", country: "Spain", price: 20.83, rating: 3.6,  bottleSlot: "centerright", targetPos: "60%", startingPos: "-40%", wineQuad: "bad cheap"},
        { animal: "amphibian/reptile", name: "Tïn Bianco", winery: "Montesecondo", country: "Italy", price: 39.99, rating: 3.8, bottleSlot: "farright", targetPos: "80%", startingPos: "-20%", wineQuad: "bad expensive"},
    ];
    const dispatch = createEventDispatcher();
    
    let windowWidth = 0;
    let windowHeight = 0;
    let bottlesWidth;
    let bottlesHeight;
    let bottleRefs = [];
    let readyToAnimate = false;

    function handleBottleClick(event) {
        dispatch("bottleClicked", event.detail);
    }

    function updateWindowSize() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }

    const getMaxElementSize = (screenWidth, screenHeight, bottleSlot) => {
        const aspectRatio = 3.5;
        const maxWidth = bottleSlot === 'center-lone'
        ? screenWidth / 2
        : screenWidth / 4;

        const maxHeight = (screenHeight / aspectRatio) - 80;
        const width = Math.min(maxWidth, maxHeight);
        const height = width * aspectRatio;

        return { width, height };
    };

    onMount(async () => {
        updateWindowSize();
        readyToAnimate = true;

        const resizeObserver = () => updateWindowSize();
        window.addEventListener('resize', resizeObserver);

        return () => {
            window.removeEventListener('resize', resizeObserver);
        };
    });

    $: bottleSizes = windowWidth && windowHeight
        ? openingWines.map(wine =>
            getMaxElementSize(windowWidth, windowHeight, wine.bottleSlot))
        : [];
    $: visible = scrollIndex == undefined || scrollIndex <=2 ? true : false;
</script>

{#if visible}
    <div class="bottles">
        {#each openingWines as wine, i}
            <SpinningBottle 
                on:bottleClicked={handleBottleClick}
                bind:this={bottleRefs[i]}
                scrollIndex={scrollIndex}
                bottleSize={bottleSizes[i]}
                bottleIndex={i}
                wineData={wine}
                outroVisible={false}
                containerDimensions={{bottlesWidth, bottlesHeight}}
                {scrollyContainer}
                bottlePosLeft={
                    readyToAnimate
                    ? (scrollIndex === undefined || scrollIndex < 2 ? wine.targetPos : wine.startingPos)
                    : wine.startingPos
                }
                />
        {/each}
    </div>
{/if}

<style>
    .bottles {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80svh;
        min-height: 80svh;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        gap: 4rem;
        z-index: 999;
        /* margin-top: 20svh; */
    }

    @media(max-width: 700px) {
    }
</style>