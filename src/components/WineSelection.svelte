<script>
    import { animalSelected } from "$stores/misc.js";
    import { fly, fade } from 'svelte/transition';
</script>

{#if $animalSelected}
<div id="wine-selection" transition:fly={{ y: -200, duration: 500 }}>
    <p>You selected the <span class="bold">{$animalSelected}</span> wine</p>
    <div class="circle">
        <img alt="{$animalSelected} icon" src="/assets/images/icons/{$animalSelected}.png" />
    </div>
</div>
{/if}

<style>
    #wine-selection {
        position: fixed;
        top: 0;
        right: 0;
        color: var(--wine-tan);
        z-index: 1000;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        padding: 1rem;
        align-items: center;
    }

    p {
        font-family: var(--sans);
        margin: 0;
        max-width: 6rem;
        text-align: right;
        line-height: 1.25;
        font-size: var(--14px);
    }

    .circle {
        height: 48px;
        width: 48px;
        border-radius: 50%;
        background: var(--wine-tan);
        border: 2px solid var(--wine-red);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 90%;
    }
</style>