<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Range from "$components/helpers/Range.svelte";
    import scrollY from "$stores/scrollY.js";

    export let scrollIndex;
    export let bottleIndex;
    export let wineData;
    export let containerDimensions;
    export let bottlePosLeft;
    export let pricesLocked;
    export let pricesSkipped;

    let wineWidth;
    let aspectRatio = 3.5;
    let shouldSpin = [true,true,true];
    let rangeValue;
    let actualPrice = wineData.price;

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

    function getMaxElementSize(screenWidth, screenHeight) {
        let maxWidthBasedOnScreen = screenWidth / 3;
        let maxWidthBasedOnHeight = screenHeight / aspectRatio;

        let w = Math.min(maxWidthBasedOnScreen, maxWidthBasedOnHeight);
        let h = w * aspectRatio;

        return { width: w, height: h };
    }

    function handleTransitionEnd(event) {
        if (event.propertyName !== "left") return; // Only trigger on left transition

        shouldSpin = [...shouldSpin]; 
        shouldSpin[bottleIndex] = false;
    }



    function handleRangeChange(event) {
        rangeValue = event.detail;
        dispatch('rangeChange', rangeValue);
    }

    $: getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.height);
    $: transitionDelay = scrollIndex < 2 || scrollIndex == 1 && $scrollY !== "up" || scrollIndex == undefined ? (3 - 1 - bottleIndex) * 500 : bottleIndex * 500;

    $: if (scrollIndex == 2 || scrollIndex == 1 && $scrollY == "up") {
        shouldSpin = [true,true,true];
    }
</script>


<div class="product product-{wineData.bottleSlot}" 
    class:faded={scrollIndex == 0 && wineData.bottleSlot !== 'left' || scrollIndex == 1 && wineData.bottleSlot !== 'center'}
    style="--transition-delay: {transitionDelay}ms;
        width:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).width}px;
        height:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).height}px;
        left: {bottlePosLeft};"
        on:transitionend={handleTransitionEnd}>
    <div class="range-wrapper" class:visible={shouldSpin[bottleIndex] == false}>
        <Range 
            bind:value={rangeValue} 
            on:input={handleRangeChange} 
            showTicks={true} 
            pricesLocked={pricesLocked}
            actualPrice={actualPrice} 
            pricesSkipped={pricesSkipped}
        />
    </div>
    <div class="wine"
        class:spin={(scrollIndex === undefined && shouldSpin[bottleIndex]) ||
            (scrollIndex === 2 && shouldSpin[bottleIndex]) ||
            (scrollIndex === 1 && $scrollY === "up" && shouldSpin[bottleIndex])}
        on:mousemove={mousemoveBottle}
        on:mouseleave={mouseleaveBottle}></div>
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
        aspect-ratio: 1/3.5;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: left 2s ease-in var(--transition-delay), opacity 0.5s ease-in;
        pointer-events: auto;
        position: absolute;
        top: 0;
        left: -50%;
        transform: translate(-50%, 0);
    }

    .product.faded {
        opacity: 0.25;
    }
    .product-center .wine, .product-right .wine, .product-left .wine {
        height: calc(100% - 150px);
        aspect-ratio: 1/3.5;
        cursor: pointer;
    }

    .product-center .wine {
        background: url("/assets/images/spins/frogspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-right .wine {
        background: url("/assets/images/spins/birdspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-left .wine {
        background: url("/assets/images/spins/lionspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    /* Define spin class for animation */
    .spin {
        animation: spin 0.6s steps(8) infinite;
        transition: background-position 0s; 
        pointer-events: none;
    }

    @keyframes spin {
        100% { background-position: -800% 0; }
    }
</style>