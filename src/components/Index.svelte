<script>
	import { getContext } from "svelte";
	import { catSet } from "$stores/misc.js";
	import Distribution from "$components/Distribution.svelte";
	import Select from "$components/helpers/Select.svelte";

	import priceDistributionData from "$data/priceDistribution.csv";
	import ratingDistributionData from "$data/ratingDistribution.csv";
	// import WIP from "$components/helpers/WIP.svelte";
	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");

	let options = ["price", "rating"];

	$: dataSet = $catSet == "price" ? priceDistributionData : ratingDistributionData;
</script>

<!-- <Distribution data={priceDistributionData} metric={"price"} /> -->
<Select options={options}/>
{#key dataSet}
	<Distribution data={dataSet} metric={$catSet} />
{/key}
<!-- <WIP />
<Demo /> -->
<!-- <Footer /> -->
