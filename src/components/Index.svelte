<script>
	import { getContext } from "svelte";
	import { currAnimalSlide } from "$stores/misc.js";
	import Intro from "$components/Intro4.svelte";
	import ChartScroll from "$components/ChartScroll.svelte";
	import AnimalCard from "$components/AnimalCard.svelte";
	import AnimalCardNav from "$components/AnimalCard.Nav.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Outro from "$components/Outro.svelte";

	const copy = getContext("copy");
	const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "human",
		"marine invertebrate", "mythical", "none", "pachyderm", "pig",
		"rabbit", "ram"
	];

	let sliderEl;
</script>

<Intro />
<ChartScroll />
<div class="cards">
	<AnimalCardNav />
	<Tap showArrows={true} currAnimalSlide={$currAnimalSlide}/>
	<Slider bind:this={sliderEl}>
		{#each topgroups as animal, i}
			<Slide>
				<AnimalCard animal={animal}/>
			</Slide>
		{/each}
	</Slider>
</div>
<Outro />
<!-- <Explore /> -->
<!-- <Footer /> -->

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
	.cards {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}
</style>
