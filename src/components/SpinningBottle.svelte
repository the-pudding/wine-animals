<script>
    import Range from "$components/helpers/Range.svelte";
    let leftPos = "-50%";
    let shouldSpin = true;
    let wineWidth;

    export let bottlePos;
    export let scrollIndex;

    setTimeout(() => {
        leftPos = bottlePos == "center" ? "50%" :
                bottlePos == "left" ? "25%" :
                "75%"
    },0)

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
</script>

<div class="banner banner-{bottlePos}" >
    <div class="product" style="left: {leftPos}" on:transitionend={handleTransitionEnd}>
        {#if scrollIndex >= 2}
            <div class="range-wrapper">
                <Range />
            </div>
        {/if}
        <!-- <div class="wine" class:spin={shouldSpin} on:mousemove={mousemoveBottle} on:mouseleave={mouseleaveBottle}></div> -->
        <div class="wine" class:spin={shouldSpin}></div>
    </div>
</div>


<style>
    .banner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        padding: 4rem 2rem;
    }
    .range-wrapper {
        position: absolute;
        left: -1rem;
        top: 2rem;
        height: 92%;
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: end;
    }
    .banner .product {
        height: calc(100% - 10rem);
        aspect-ratio: 1/3.5;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        --left: 0;
        transition: 2s ease-in;
    }
    .banner-center .product .wine, .banner-right .product .wine, .banner-left .product .wine {
        height: 100%;
        aspect-ratio: 1/3.5;
        cursor: pointer;
    }

    .banner-center .product .wine {
        background: url("assets/images/stock/testspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .banner-right .product .wine {
        background: url("assets/images/stock/lionspin.png");
        background-position: 0 0;
        background-size: auto 100%;
    }

    .banner-left .product .wine {
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