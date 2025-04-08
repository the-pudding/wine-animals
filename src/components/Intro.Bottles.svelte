<script>
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import { createEventDispatcher } from "svelte";

    export let scrollIndex;

    const openingWines = [
        { animal: "cat", name: "Poppóne", winery: "Antonutti", country: "Italy", price: 34.99, rating: 4.3, bottleSlot: "farleft", targetPos: "20%", startingPos: "-80%", wineQuad: "good expensive"},
        { animal: "bird", name: "Sauvignon Blanc", winery: "Tomtit", country: "New Zealand", price: 22.67, rating: 4.1, bottleSlot: "centerleft", targetPos: "40%", startingPos: "-60%", wineQuad: "good cheap"},
        { animal: "pig", name: "Sus Scrofa", winery: "Pardas", country: "Spain", price: 20.83, rating: 3.6,  bottleSlot: "centerright", targetPos: "60%", startingPos: "-40%", wineQuad: "bad cheap"},
        { animal: "amphibian/reptile", name: "Tïn Bianco", winery: "Montesecondo", country: "Italy", price: 39.99, rating: 3.8, bottleSlot: "farright", targetPos: "80%", startingPos: "-20%", wineQuad: "bad expensive"},
    ];
    const dispatch = createEventDispatcher();

    function handleBottleClick(event) {
        dispatch("bottleClicked", event.detail);
    }

    let bottlesWidth = 0;
    let bottlesHeight = 0;
    let bottleRefs = [];
</script>

<div class="bottles" bind:clientHeight={bottlesHeight} bind:clientWidth={bottlesWidth}>
    {#if bottlesWidth && bottlesHeight}
        {#each openingWines as wine, i}
            <SpinningBottle 
                on:bottleClicked={handleBottleClick}
                bind:this={bottleRefs[i]}
                scrollIndex={scrollIndex}
                bottleIndex={i}
                wineData={wine}
                containerDimensions={{bottlesWidth, bottlesHeight}}
                bottlePosLeft={scrollIndex >= 0 && scrollIndex < 2
                    ? wine.targetPos 
                    : wine.startingPos}
                />
        {/each}
    {/if}
</div>

<style>
    .bottles {
        position: absolute;
        width: 100%;
        height: 100%;
        max-height: 80svh;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        gap: 4rem;
        margin-top: 20svh;
    }

    @media(max-width: 700px) {
        .bottles {
            margin-top: 40svh;
        }
    }
</style>