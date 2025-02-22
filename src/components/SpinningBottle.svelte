<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { bottleSelected, animalSelected } from "$stores/misc.js";
    import Range from "$components/helpers/Range.svelte";
    
    export let bottleIndex;
    export let wineData;
    export let containerDimensions;
    export let bottlePosLeft;
    export let pricesLocked;
    export let pricesSkipped;
    export let scrollY;

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

    export function handleClick(data) {
        // Update shared store state so all components can react if needed.
        animalSelected.set(data.animal);
        bottleSelected.set(true);

        // Select all product elements and update their classes and left style.
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const prodAnimal = product.getAttribute('data-animal');
            const wineDiv = product.querySelector('.wine');
            if (prodAnimal !== $animalSelected) {
            product.classList.add('faded');
            // Unselected bottles return to their starting position.
            product.style.left = data.startingPos;
            } else {
            product.classList.remove('faded');
            // Selected bottle moves to the center.
            product.style.left = "50%";
            }
        });

        // Update the shouldSpin array:
        // If a product is centered (left === "50%"), it doesn't spin.
        shouldSpin = Array.from(products).map(product =>
            product.style.left === "50%" ? false : true
        );

        // Optionally, update each wine div's spin class accordingly.
        products.forEach(product => {
            const wineDiv = product.querySelector('.wine');
            if (wineDiv) {
            if (product.style.left === "50%") {
                wineDiv.classList.remove('spin');
            } else {
                wineDiv.classList.add('spin');
            }
            }
        });
        }

    $: getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.height);
    $: transitionDelay = $bottleSelected == false ? (3 - 1 - bottleIndex) * 300 : bottleIndex * 300;
    $: if (scrollY > 50) { shouldSpin = [true,true,true]; } 
</script>


<div class="product product-{wineData.bottleSlot}" 
    data-animal={wineData.animal}
    style="--transition-delay: {transitionDelay}ms;
        width:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).width}px;
        height:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).height}px;
        left: {bottlePosLeft};"
        on:transitionend={handleTransitionEnd}
        on:click={() => handleClick(wineData)}>
    <div class="wine"
        class:spin={shouldSpin[bottleIndex]}
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
        transition: left 1.5s ease-in var(--transition-delay), opacity 0.5s ease-in;
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