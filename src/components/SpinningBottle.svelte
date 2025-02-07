<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Range from "$components/helpers/Range.svelte";
    import { fly, fade } from 'svelte/transition';
    let wineWidth;

    export let scrollIndex;
    export let bottleIndex;
    export let bottleSlot;
    export let startingPos;
    export let targetPos;
    export let rangeValue;
    export let pricesLocked;
    export let actualPrice;
    export let rangeVisible = false;
    export let skipLocked;

    let leftPos = startingPos;
    $: direction = "in";
    let shouldSpin = [true, true, true];

    const dispatch = createEventDispatcher();

    function handleRangeChange(event) {
        rangeValue = event.detail;          // Directly use the dispatched value
        dispatch('rangeChange', rangeValue); // Notify parent
    }

    function handleTransitionEnd(event) {
        if (event.propertyName !== "left") return; // ✅ Ignore opacity or other transitions

        shouldSpin = [...shouldSpin];
        shouldSpin[bottleIndex] = false;
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

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function animatePosition(direction) {
        shouldSpin = [true, true, true];
        let delayIndex = direction === "in" ? bottleIndex : (2 - bottleIndex); 
        let delayTime = direction === "in" ? 500 : 500;

        await delay(delayIndex * 500); 
        leftPos = direction === "in" ? targetPos : startingPos; 
        await delay(delayTime); 
    }

    onMount(async() => {
        await animatePosition(direction);
    });

    $: if (scrollIndex == 2) {
        direction = "out"
        animatePosition(direction)
    }
</script>


<div class="product 
    product-{bottleSlot}" 
    class:faded={scrollIndex == 0 && bottleSlot !== 'left' || scrollIndex == 1 && bottleSlot !== 'center'}
    style="left: {leftPos};" 
    on:transitionend={handleTransitionEnd}>
    <div class="range-wrapper" class:visible={shouldSpin[bottleIndex] == false}>
        <Range 
            bind:value={rangeValue} 
            on:input={handleRangeChange} 
            showTicks={true} 
            pricesLocked={pricesLocked}
            actualPrice={actualPrice} 
            skipLocked={skipLocked}
        />
    </div>
    <div class="wine" class:spin={shouldSpin[bottleIndex]} on:mousemove={mousemoveBottle} on:mouseleave={mouseleaveBottle}></div>
</div>



<style>
    .range-wrapper {
        position: absolute;
        width: 100%;
        left: 0rem;
        bottom: 0rem;
        padding: 0 1rem;
        opacity: 0;
        transition: opacity 0.5s ease-in;
    }

    .range-wrapper.visible {
        opacity: 1;
        transition: opacity 0.5s ease-in;
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
        pointer-events: auto;
    }

    .product.faded {
        opacity: 0.25;
        transition: opacity 0.5s ease-in;
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