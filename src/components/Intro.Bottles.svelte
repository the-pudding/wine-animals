<script>
    import SpinningBottle from "$components/SpinningBottle.svelte";
    import { createEventDispatcher } from "svelte";

    export let scrollIndex;

    const openingWines = [
        { animal: "cattle", name: "Pinotage", winery: "Survivor", country: "South Africa", price: 21.99, bottleSlot: "left", targetPos: "25%", startingPos: "-75%", rangeValue: 0 },
        { animal: "cat", name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { animal: "bird", name: "Pinot Noir", winery: "Mohua", country: "New Zealand", price: 21.95, bottleSlot: "right", targetPos: "75%", startingPos: "-25%", rangeValue: 0 }
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
                bind:rangeValue={wine.rangeValue} />
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
</style>