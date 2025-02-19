<script>
    import { getContext, onMount } from "svelte";
    import starIcon from "$svg/star.svg";

    const copy = getContext("copy");

    export let animal;
    export let data;
</script>

<ol>
    {#each copy.catSummary as item, i}
        <li>{item.value}</li>
    {/each}
</ol>
<div class="our-picks">
    <h3>The best {animal} wines</h3>
    {#each data as wine, i}
        <div class="pick">
            <img src="assets/images/1spans/big.png" alt="wine bottle">
            <div class="details">
                <p class="name">{wine.name}</p>
                <p>{wine.winery}, {wine.country}</p>
                <p>{wine.type}</p>
                <p>${wine.price}</p>
                <p class="stars-wrapper">
                    {wine.rating}
                    <span class="stars">
                        {#each Array(Math.floor(wine.rating)).fill(0) as _, i}
                            <span class="full-star">{@html starIcon}</span> <!-- Full star -->
                        {/each}
                
                        {#if wine.rating % 1 !== 0}
                            <span class="partial-star">
                                <span class="partial-star-inner" style="width: {Math.round((wine.rating % 1) * 100)+20}%;">
                                    {@html starIcon}
                                </span>
                            </span> <!-- Partial star -->
                        {/if}
                    </span>
                </p>
            </div>
        </div>
    {/each}
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
        gap: 1rem;
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

    .name {
        font-size: var(--20px);
        font-weight: 700;
    }

    .stars-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
    }

    .stars {
        display: inline-flex;
        align-items: center;
    }

    :global(.full-star svg, .partial-star svg) {
        height: 100%;
        aspect-ratio: 1 / 1;
    }

    :global(.full-star svg path, .partial-star svg path) {
        fill: var(--wine-tan);
        stroke: none;
        width: 100%;
        height: 100%;
    }

    .full-star {
        width: 1.25rem;
        height: 1.25rem; 
    }

    .partial-star {
        display: inline-block;
        width: 1.25rem; /* Adjust based on your star icon size */
        height: 1.25rem;
        position: relative;
    }

    .partial-star-inner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
</style>