<script>
    import { getContext, onMount } from "svelte";

    const copy = getContext("copy");

    export let animal;
</script>

<ol>
    {#each copy.catSummary as item, i}
        <li>{item.value}</li>
    {/each}
</ol>
<div class="our-picks">
    <h3>Our picks</h3>
    <div class="pick">
        <img src="assets/images/1spans/big.png" alt="wine bottle">
        <div class="details">
            <p>Wine name</p>
            <p>Winery name</p>
            <p>Wine type</p>
            <p>Rating</p>
            <p>$99.99</p>
        </div>
    </div>
    <div class="pick">
        <img src="assets/images/1spans/big.png" alt="wine bottle">
        <div class="details">
            <p>Wine name</p>
            <p>Winery name</p>
            <p>Wine type</p>
            <p>Rating</p>
            <p>$99.99</p>
        </div>
    </div>
    <div class="pick">
        <img src="assets/images/1spans/big.png" alt="wine bottle">
        <div class="details">
            <p>Wine name</p>
            <p>Winery name</p>
            <p>Wine type</p>
            <p>Rating</p>
            <p>$99.99</p>
        </div>
    </div>
</div>

<style>
    ol {
        padding: 0;
        margin: 0;
        color: var(--wine-tan);
        font-size: var(--20px);
    }

    li {
        margin-bottom: 1rem;
    }

    h3 {
        font-family: var(--sans);
        color: var(--wine-tan);
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--20px);
    }

    .our-picks {
        display: flex;
        flex-direction: column;
        margin-top: 2rem;
        color: var(--wine-tan);
        font-family: var(--sans);
    }

    .pick {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-top: 1rem;
    }

    .pick img {
        height: 150px;
    }

    .details p {
        margin: 0;
    }
</style>