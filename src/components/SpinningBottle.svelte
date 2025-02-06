<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Range from "$components/helpers/Range.svelte";
    import { fly, fade } from 'svelte/transition';
    let shouldSpin = true;
    let wineWidth;

    export let bottleIndex;
    export let bottleSlot;
    export let startingPos;
    export let targetPos;
    export let rangeValue;
    export let pricesLocked;
    export let actualPrice;

    let leftPos = startingPos;

    const dispatch = createEventDispatcher();

    function handleRangeChange(event) {
        rangeValue = event.detail;          // Directly use the dispatched value
        dispatch('rangeChange', rangeValue); // Notify parent
    }

    function handleTransitionEnd() {
        shouldSpin = false;
    }

    function mousemoveBottle(e) {
        let container = e.currentTarget;
        let mouseX = e.offsetX;
        wineWidth = container.offsetWidth;

        if (mouseX < wineWidth / 5) {
            container.style.backgroundPosition = "200% 0"; // First section
        } else if (mouseX < (2 * wineWidth) / 5) {
            container.style.backgroundPosition = "100% 0"; // Second section
        } else if (mouseX < (3 * wineWidth) / 5) {
            container.style.backgroundPosition = "0 0"; // Third section
        } else if (mouseX < (4 * wineWidth) / 5) {
            container.style.backgroundPosition = "-100% 0"; // Fourth section
        } else {
            container.style.backgroundPosition = "-200% 0"; // Fifth section
        }
    }

    function mouseleaveBottle(e) {
        let container = e.currentTarget;
        container.style.backgroundPosition = "0 0"; 
    }

    onMount(() => {
        setTimeout(() => {
            leftPos = targetPos;
        }, (bottleIndex) * 1000);
    });
</script>


<div class="product product-{bottleSlot}" style="left: {leftPos};" on:transitionend={handleTransitionEnd}>
    {#if !shouldSpin}
        <div in:fade class="range-wrapper">
            <Range 
                bind:value={rangeValue} 
                on:input={handleRangeChange} 
                showTicks={true} 
                pricesLocked={pricesLocked}
                actualPrice={actualPrice} 
            />
        </div>
    {/if}
    <div class="wine" class:spin={shouldSpin} on:mousemove={mousemoveBottle} on:mouseleave={mouseleaveBottle}></div>
</div>



<style>
    .range-wrapper {
        position: absolute;
        width: 100%;
        left: 0rem;
        bottom: 0rem;
        padding: 0 1rem;
    }
    .product {
        height: 100%;
        max-height: 600px;
        aspect-ratio: 1/3.5;
        position: absolute;
        bottom: 0;
        transform: translate(-50%, 0);
        z-index: 1;
        left: 0;
        transition: left 2s ease-in;
        padding-bottom: 4rem;
    }
    .product-center .wine, .product-right .wine, .product-left .wine {
        height: 100%;
        aspect-ratio: 1/3.5;
        cursor: pointer;
    }

    .product-center .wine {
        background: url("assets/images/stock/testspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-right .wine {
        background: url("assets/images/stock/birdspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-left .wine {
        background: url("assets/images/stock/lionspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    /* Define spin class for animation */
    .spin {
        animation: spin 0.6s steps(8) infinite;
        transition: background-position 0s; 
    }

    @keyframes spin {
        100% { background-position: -800% 0; }
    }
</style>