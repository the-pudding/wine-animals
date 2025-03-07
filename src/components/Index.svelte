<script>
	import { getContext } from "svelte";
	import { currAnimalSlide } from "$stores/misc.js";
	import inView from "$actions/inView.js"
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
		"deer", "fish", "horse", "marine invertebrate", "mythical creature", "pachyderm", "pig", "rabbit", "ram"
	];

	let sliderEl;
	let tapVisible = false;

	function handleTap(direction) {
			if (direction === "left") {
				sliderEl.prev();
			} else {
				sliderEl.next();
			}

		currAnimalSlide.update(n => {
			if (direction === "left") return Math.max(0, n - 1); // Prevent going below 0
			if (direction === "right") return Math.min(topgroups.length - 1, n + 1); // Prevent exceeding last index
			return n;
		});
	}

	$: console.log($currAnimalSlide)
	$: sliderEl == $currAnimalSlide;
</script>

<div id="gradient"></div>
<Intro />
<ChartScroll />
<div 
	class="cards"
	use:inView
	on:enter={() => tapVisible = true}
	on:exit={() => tapVisible = false}
>
	<AnimalCardNav />
	{#if tapVisible}
		<Tap showArrows={true} on:tap={e => handleTap(e.detail)}/>
	{/if}
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
	#gradient {
		width: 100%;
		height: 100svh;
		position: fixed;
		z-index: 1;
		background: linear-gradient(to bottom, #181A1F, #14161a);
	}
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
