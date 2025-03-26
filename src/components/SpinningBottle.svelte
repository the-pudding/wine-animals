<script>
    import { createEventDispatcher } from "svelte";
    import { bottleSelected, animalSelected } from "$stores/misc.js";
    
    export let bottleIndex;
    export let wineData;
    export let containerDimensions;
    export let bottlePosLeft;
    export let scrollIndex;
    export let outroVisible;

    let wineWidth;
    let aspectRatio = 3.5;
    let shouldSpin = [true,true,true,true];
    let spin4 = true;

    const dispatch = createEventDispatcher();

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

        if (outroVisible) {
            spin4 = false;
        }
    }

    export function handleClick(data) {
        animalSelected.set(data.animal);
        bottleSelected.set(true);

        const products = document.querySelectorAll("#intro .product");
        products.forEach((product) => {
        const prodAnimal = product.getAttribute("data-animal");
        const wineDiv = product.querySelector(".wine");
        if (prodAnimal !== $animalSelected && bottleIndex !== 4) {
            product.classList.add("faded");
            product.style.left = data.startingPos;
        } else {
            product.classList.remove("faded");
            product.style.left = "50%";
        }
        });

        shouldSpin = Array.from(products).map(
        (product) => product.style.left === "50%" ? false : true
        );

        products.forEach((product) => {
        const wineDiv = product.querySelector(".wine");
        if (wineDiv) {
            if (product.style.left === "50%") {
            wineDiv.classList.remove("spin");
            } else {
            wineDiv.classList.add("spin");
            }
        }
        });

        // Emit event to parent component
        dispatch("bottleClicked", data);
    }

    $: getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.height);
    $: transitionDelay = $bottleSelected == false 
        ? (3 - 1 - bottleIndex) * 300 
        : bottleIndex == 4 
        ? 0  
        : bottleIndex * 300;
    $: if (scrollIndex >= 2) { shouldSpin = [true,true,true,true]; } 
    $: if (outroVisible == false || outroVisible == undefined) { spin4 = true };
</script>


<div class="product product-{wineData.bottleSlot}" 
    data-animal={wineData.animal}
    style="--transition-delay: {transitionDelay}ms;
        width:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).width}px;
        height:{getMaxElementSize(containerDimensions.bottlesWidth, containerDimensions.bottlesHeight).height}px;
        left: {bottlePosLeft};"
        on:transitionend={handleTransitionEnd}
        on:click={() => handleClick(wineData)}>
    <div class="shadows">

    </div>
    <div class="wine"
        class:spin={bottleIndex == 4 ? spin4 : shouldSpin[bottleIndex]}
        on:mousemove={mousemoveBottle}
        on:mouseleave={mouseleaveBottle}>
    </div>
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
    .product .wine {
        height: calc(100% - 150px);
        aspect-ratio: 1/3.5;
        cursor: pointer;
    }

    .product-farleft .wine {
        background: url("/assets/images/spins/lionspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-centerleft .wine {
        background: url("/assets/images/spins/birdspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-centerright .wine {
        background: url("/assets/images/spins/pigspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-farright .wine {
        background: url("/assets/images/spins/frogspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .product-center-lone .wine {
        background: url("/assets/images/spins/fishtailspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    /* Define spin class for animation */
    .spin {
        animation: spin 0.6s steps(8) infinite;
        transition: background-position 0s; 
        pointer-events: none;
    }

    .shadows {
        position: absolute;
        bottom: 90px;
        left: 0;
        width: 100%;
        height: 50px;
        background: black;
        filter: blur(30px);
        z-index: 1;
        border-radius: 400px / 100px;
    }

    @keyframes spin {
        100% { background-position: -800% 0; }
    }
</style>