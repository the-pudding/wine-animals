<script>
    let leftPos = 0;
    let wineBG = "url('assets/images/stock/bionicfrog.png') 0 -140px, url('assets/images/stock/red2.png') 0 0;"
    setTimeout(() => {
        leftPos = "50%"
        wineBG = "url('assets/images/stock/bionicfrog.png') 50% -140px, url('assets/images/stock/red2.png') 0 0;"
    },200)

    $: console.log(wineBG)
</script>

<div class="banner">
    <div class="product" style="left: {leftPos}">
        <div class="wine" style="background: {wineBG}"></div>
    </div>
</div>


<style>
    .banner {
        height: 100vh;
        overflow: hidden;
        position: relaive;
    }
    .banner .product {
        width: 500px;
        height: 500px;
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        z-index: 1;
        transition: 0.7s;
        --left: 0;
    }
    .banner .product .wine {
        background: url("assets/images/stock/bionicfrog.png") var(--left) -140px,
                    url("assets/images/stock/red2.png") 0 0;
        background-size: auto 100%;
        width: 280px;
        aspect-ratio: 2/8.65;
        /* background-blend-mode: screen; */
        mask-image: url("assets/images/stock/red2.png");
        mask-size: auto 100%;
        transition: 0.7s;
    }
    .banner .product:hover {
        --left: 100%;
    }
</style>