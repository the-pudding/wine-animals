<script>
    let leftPos = "-50%";
    let shouldSpin = true;
    let wineWidth;

    setTimeout(() => {
        leftPos = "50%"
    },200)

    function handleTransitionEnd() {
        shouldSpin = false;
    }

    function mousemoveBottle(e) {
        let container = e.currentTarget;
        let mouseX = e.offsetX;
        wineWidth = container.offsetWidth;

        console.log(mouseX)

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

<div class="banner">
    <div class="product" style="left: {leftPos}" on:transitionend={handleTransitionEnd}>
        <div class="wine" class:spin={shouldSpin} on:mousemove={mousemoveBottle} on:mouseleave={mouseleaveBottle}></div>
    </div>
</div>


<style>
    .banner {
        width: 100%;
        height: 90vh;
        overflow: hidden;
        position: absolute;
    }
    .banner .product {
        height: 100%;
        aspect-ratio: 1/3.5;
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        z-index: 1;
        --left: 0;
        transition: 2s ease-in;
    }
    .banner .product .wine {
        background: url("assets/images/stock/testspin.png");
        background-position: 0 0;
        background-size: auto 100%;
        height: 100%;
        aspect-ratio: 1/3.5;
        cursor: pointer;
    }

    .banner .product .wine:hover {
        background-position: -14% 0;
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