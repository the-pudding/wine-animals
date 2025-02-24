<script>
    import SpinningBottle from "$components/SpinningBottle.svelte";

    export let scrollIndex;

    const openingWines = [
        { animal: "lion", name: "Bordeaux Supérieur", winery: "Château Les Gravieres de la Brandille", country: "France", price: 18.33, bottleSlot: "left", targetPos: "25%", startingPos: "-75%", rangeValue: 0 },
        { animal: "frog", name: "Bionic Frog", winery: "Cayuse Vineyards", country: "United States", price: 610, bottleSlot: "center", targetPos: "50%", startingPos: "-50%", rangeValue: 0 },
        { animal: "bird", name: "Cuvée Ortolan", winery: "Château Marjosse", country: "France", price: 43.17, bottleSlot: "right", targetPos: "75%", startingPos: "-25%", rangeValue: 0 }
    ];

    let bottlesWidth = 0;
    let bottlesHeight = 0;
    let bottleRefs = [];
</script>

<div class="bottles" bind:clientHeight={bottlesHeight} bind:clientWidth={bottlesWidth}>
    {#if bottlesWidth && bottlesHeight}
        {#each openingWines as wine, i}
            <SpinningBottle 
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