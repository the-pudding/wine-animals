<script>
    import Filters from "$components/Filters.svelte";
    import ScatterExplore from "$components/ScatterExplore.svelte";
    import inView from "$actions/inView.js";
    import { bigScatterData } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv";

    const filteredData = allWineData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");

    function enterView() {
        console.log("enter");
        bigScatterData.set(filteredData)
    }

    function exitView() {
        console.log("exit");
    }
</script>

<section id="explore"
    use:inView
    on:enter={enterView}
    on:exit={exitView}
 >
    <Filters />
    <ScatterExplore />
</section>