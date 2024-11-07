<script>
    let leftPos = "-50%";
    let shouldSpin = true;
    setTimeout(() => {
        leftPos = "50%"
    },200)

    function handleTransitionEnd() {
        shouldSpin = false;
    }
</script>

<div class="banner">
    <div class="product" style="left: {leftPos}" on:transitionend={handleTransitionEnd}>
        <div class="wine" class:spin={shouldSpin}></div>
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
        transition: 0.75s ease-in;
    }
    .banner .product .wine {
        background: url("assets/images/stock/testspin.png");
        background-position: 0 0;
        background-size: auto 100%;
        height: 100%;
        aspect-ratio: 1/3.5;
    }

    /* Define spin class for animation */
    .spin {
        animation: spin 0.3s steps(8) infinite;
    }

    @keyframes spin {
        100% { background-position: -3200px 0; }
    }
</style>