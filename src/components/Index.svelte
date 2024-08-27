<script>
	import { getContext } from "svelte";
	import { animalSelect, metricSelect } from "$stores/misc.js";
	import Intro from "$components/Intro.svelte";
	// import PhotoTest from "$components/PhotoTest.svelte";
	// import Distribution from "$components/Distribution.svelte";
	// import Select from "$components/helpers/Select.svelte";

	// import wineData_summary from "$data/wineData_summary.csv";
	// import wineData_catSummary from "$data/wineData_catSummary.csv";
	// import wineData_birdSummary from "$data/wineData_birdSummary.csv";
	// import WIP from "$components/helpers/WIP.svelte";
	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");

	// let optionsMetric = ["price", "rating"];
	// let optionsAnimal = ["all", "cats", "birds"];

	// function setData($animalSelect, $metricSelect) {
	// 	if ($animalSelect == "birds") {
	// 		if ($metricSelect == "price") { 
	// 			return wineData_birdSummary.filter((d) => d.category == "price");
	// 		} else if ($metricSelect == "rating") {
	// 			return wineData_birdSummary.filter((d) => d.category == "rating");
	// 		}
	// 	} else if ($animalSelect == "cats") {
	// 		if ($metricSelect == "price") { 
	// 			return wineData_catSummary.filter((d) => d.category == "price");
	// 		} else if ($metricSelect == "rating") {
	// 			return wineData_catSummary.filter((d) => d.category == "rating");
	// 		}
	// 	} else {
	// 		if ($metricSelect == "price") { 
	// 			return wineData_summary.filter((d) => d.category == "price");
	// 		} else if ($metricSelect == "rating") {
	// 			return wineData_summary.filter((d) => d.category == "rating");
	// 		}
	// 	}
	// }

	// $: dataSet = setData($animalSelect, $metricSelect)

	// $: dataSet = $animalSelect == "all"
	// 	? wineData_summary 
	// 	: $animalSelect == "cats"
	// 	? wineData_catSummary
	// 	: wineData_birdSummary;

	// $: console.log(dataSet)
</script>

<!-- <div class="selects">
	<Select options={optionsAnimal} id={"id-animalSelect"}/>
	<Select options={optionsMetric} id={"id-metricSelect"}/>
</div>
{#if dataSet.length > 0}
	{#key dataSet}
		<Distribution data={dataSet} />
	{/key}
{/if}

<PhotoTest /> -->
<!-- <WIP />
<Demo /> -->
<!-- <Footer /> -->
<Intro />

<style>
	.selects {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin: 0 0 2rem 0;
	}
</style>
