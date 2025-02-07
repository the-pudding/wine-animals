<script>
	import { getContext } from "svelte";
	import { animalSelect, metricSelect, topgroupSelect } from "$stores/misc.js";
	import Intro from "$components/Intro.svelte";
	import PhotoTest from "$components/PhotoTest.svelte";
	import Distribution from "$components/Distribution.svelte";
	import Scatter from "$components/Scatter.svelte";
	import ScatterTop from "$components/ScatterTop.svelte";
	import Select from "$components/helpers/Select.svelte";
	import Explore from "$components/Explore.svelte";

	import allWineData from "$data/wineData.csv"
	import wineData_summary from "$data/wineData_summary.csv";
	import wineData_catSummary from "$data/wineData_catSummary.csv";
	import wineData_birdSummary from "$data/wineData_birdSummary.csv";
	import WIP from "$components/helpers/WIP.svelte";
	import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");
	const data = getContext("data");

	let optionsMetric = ["price", "rating"];
	let optionsAnimal = ["all", "cats", "birds"];
	const topgroups = ["amphibian/reptile", "bear", "bird", "cat", "cattle/camelus",
		"deer-like", "dog", "fish-like", "horse", "insect",
		"marine invertebrate", "mythical", "pachyderm",
		"rabbit", "ram-like", "suid"
	];

	function setData($animalSelect, $metricSelect) {
		if ($animalSelect == "birds") {
			if ($metricSelect == "price") { 
				return wineData_birdSummary.filter((d) => d.category == "price" && d.bucket !== "$100+");
			} else if ($metricSelect == "rating") {
				return wineData_birdSummary.filter((d) => d.category == "rating");
			}
		} else if ($animalSelect == "cats") {
			if ($metricSelect == "price") { 
				return wineData_catSummary.filter((d) => d.category == "price" && d.bucket !== "$100+");
			} else if ($metricSelect == "rating") {
				return wineData_catSummary.filter((d) => d.category == "rating");
			}
		} else {
			if ($metricSelect == "price") { 
				return wineData_summary.filter((d) => d.category == "price" && d.bucket !== "$100+");
			} else if ($metricSelect == "rating") {
				return wineData_summary.filter((d) => d.category == "rating");
			}
		}
	}

	function setScatterData($animalSelect) {
		if ($animalSelect == "birds") {
			return allWineData.filter(d => d.topgroup.includes("bird") && d.price <= 150)
		} else if ($animalSelect == "cats") {
			return allWineData.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle") && d.price <= 150);
		} else {
			return allWineData.filter(d => d.price <= 150)
		}
	}

	function setTopData($topgroupSelect) {
		return allWineData.filter(d => d.topgroup.includes($topgroupSelect) && d.price <= 150)
	}

	function setTopCompareData(topData) {
		const num = topData.length;
		const filtered = allWineData.filter(d => 
			!d.topgroup.includes($topgroupSelect) && 
			d.topgroup !== "none" && 
			d.topgroup !== "human" && 
			d.price <= 150
		);
		const shuffled = [...filtered].sort(() => 0.5 - Math.random());
		return shuffled.slice(0,num);
	}

	$: topData = setTopData($topgroupSelect);
	$: topCompareData = setTopCompareData(topData);
	$: dataSet = setData($animalSelect, $metricSelect);
	$: scatterDataSet = setScatterData($animalSelect);
</script>
<!-- <div class="scatter-test">
	<div class="selects">
		<Select options={topgroups} id={"id-topgroupSelect"}/>
	</div>
	{#key topData}
		<ScatterTop data={topData} />
	{/key}
</div> -->

<!-- <PhotoTest /> -->
<!-- <WIP /> -->
<!-- <Demo /> -->
<!-- <Footer /> -->
<Intro />
<Explore />

<!-- <div class="white">
	<div class="selects">
		<Select options={optionsAnimal} id={"id-animalSelect"}/>
		<Select options={optionsMetric} id={"id-metricSelect"}/>
	</div>
	{#if dataSet.length > 0}
		{#key dataSet}
			<Scatter data={scatterDataSet} />
		{/key}
	{/if}
	{#if dataSet.length > 0}
		{#key dataSet}
			<Distribution data={dataSet} />
		{/key}
	{/if}
</div> -->

<style>
	.white {
		background: var(--color-bg);
		width: 100%;
	}
	.selects {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin: 0 0 2rem 0;
		position: sticky;
		top: 0;
		width: 100%;
		padding: 1rem;
		background-color: white;
		z-index: 1000;
	}
</style>
