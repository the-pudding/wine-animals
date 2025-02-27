<script>
    import ScrollHisto from "$components/ScrollHisto.svelte";
    import Scatter from "$components/Scatter.svelte";

    export let animal;
</script>

<div class="animal-card">
    <div class="rail" id="rail-left">
        <div class="icon">
            <!-- <img src="./assets/images/icons/{animal}.png" /> -->
        </div>
        <h3>{animal}</h3>
    </div>
    <div class="rail" id="rail-center">
        <Scatter animal={animal}/>
    </div>
    <div class="rail" id="rail-right">
        <ScrollHisto animal={animal}/>
    </div>
</div>

<style>
    .animal-card {
        width: calc(100% - 4rem);
        margin: 0 2rem;
        border: 1px solid var(--wine-med-gray);
        border-radius: 3px;
        padding: 2rem;
        display: flex;
        flex-direction: row;
        gap: 4rem;
    }

    .rail {
        width: 33%;
    }

    h3 {
        color: var(--wine-tan);
    }

    .icon {
        background: var(--wine-tan);
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon img {
        width: 90%;
    }
</style>