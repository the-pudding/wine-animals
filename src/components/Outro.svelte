<script>
    import { getContext, onMount } from "svelte";
    const copy = getContext("copy");
</script>

<section id='outro'>
    <div id="closing">
        {#each copy.outro as graf, i}
            <p>{@html graf.value}</p>
        {/each}
    </div>
    <div id="methods">
        <h3>Methodology</h3>
        {#each copy.methods as graf, i}
            <p>{@html graf.value}</p>
        {/each}
    </div>

</section>

<style>
    #outro {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--wine-tan);
        padding: 10rem 1rem 1rem 1rem;
        gap: 4rem;
    }

    #methods, #closing {
        width: 100%;
        max-width: 720px;
    }

    #closing p {
        font-size: var(--18px);
        line-height: 1.65;
    }

    h3 {
        font-weight: 700;
        font-size: var(--20px);
    }

    #methods p {
        font-family: var(--sans);
        font-size: var(--14px);
        line-height: 1.65;
    }

    :global(#methods a) {
        color: var(--wine-tan);
    }

    :global(#methods a:hover) {
        color: var(--wine-red);
    }
</style>