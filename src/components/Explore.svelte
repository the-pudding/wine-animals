<script>
    import Filters from "$components/Filters.svelte";
    import ScatterExplore from "$components/ScatterExplore.svelte";
    import inView from "$actions/inView.js";
    import { bigScatterData } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv";

    const filteredData = allWineData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");

    function enterView() {
        bigScatterData.set(filteredData)
    }

    function exitView() {
    }
</script>

<section id="explore"
    use:inView
    on:enter={enterView}
    on:exit={exitView}
 >  
    <h3>Explore even more</h3>
    <Filters />
    <ScatterExplore />
</section>

<style>
    #explore {
        width: 100%;
        height: 100svh;
        position: relative;
        z-index: 900;
        margin: 4rem 0;
    }

    h3 {
        font-weight: 700;
        margin: 0 auto;
        max-width: 720px;
        font-size: var(--20px);
        color: var(--wine-tan);
    }
</style>