<script>
	import { getContext } from "svelte";
	import { currAnimalSlide, tooltipType } from "$stores/misc.js";
	import inView from "$actions/inView.js";
	import Icon from "$components/helpers/Icon.svelte";
	import Intro from "$components/Intro4.svelte";
	import ChartScroll from "$components/ChartScroll.svelte";
	import AnimalCard from "$components/AnimalCard.svelte";
	import AnimalCardNav from "$components/AnimalCard.Nav.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Outro from "$components/Outro.svelte";
	import Explore from "$components/Explore.svelte";
	import WineSelection from "$components/WineSelection.svelte";
	import * as d3 from "d3";

	const copy = getContext("copy");
	const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "marine invertebrate", "mythical creature", "pachyderm", "pig", "rabbit", "ram"
	];

	let sliderEl;
	let tapVisible = false;
	let scrollY;

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

	function tooltipCloseClick() {
		d3.select("#universal-tooltip").classed("visible", false)
	}

	function checkScroll(scrollY) {
		if (scrollY !== undefined) {
			d3.select("#universal-tooltip").classed("visible", false)
		}
	}

	$: checkScroll(scrollY);
</script>

<svelte:window bind:scrollY={scrollY} />

<div id="gradient"></div>
<!-- <WineSelection /> -->
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
<div id="universal-tooltip">
	<button class="close" on:click={tooltipCloseClick}>
		<Icon name="x" size={"1.5rem"}/>
	</button>
	{#if $tooltipType == "bottle"}
		<img src="" />
		<div class="deets">
			<p class="wine-name"></p>
			<p class="winery-name"></p>
			<p class="animal"></p>
			<p class="type"></p>
			<div class="price-rating">
				<p class="price"></p>
				<p class="rating"></p>
			</div>
		</div>
	{:else if $tooltipType == "histo"}
		<div class="summary"></div>
	{/if}
</div>
<Explore />
<!-- <Footer /> -->

<style>
	#universal-tooltip {
        position: fixed;
        left: 0;
        bottom: -160px;
        width: 100%;
        height: 160px;
		padding: 0.5rem;
        background: rgba(207, 202, 191, 0.98);
		border-top: 1px solid var(--wine-dark-gray);
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		z-index: 1000;
		transition: bottom 0.5s linear;
    }

	#universal-tooltip button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: 2px solid var(--wine-black);
		border-radius: 50%;
		height: 2.5rem;
		width: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#universal-tooltip button:hover {
		background: var(--wine-black);
	}

	:global(#universal-tooltip button svg) {
		margin-top: 4px;
	}

	:global(#universal-tooltip button:hover svg path) {
		stroke: var(--wine-tan);
	}

	#universal-tooltip img {
		height: 100%;
	}

	#universal-tooltip .deets {
		display: flex;
		flex-direction: column;
	}

	#universal-tooltip .deets p {
		margin: 0;
		padding: 0;
		font-family: var(--sans);
		text-transform: capitalize;
	}

	:global(#universal-tooltip .details){
		margin: 0;
		padding: 1rem;
		max-width: 550px;
		font-family: var(--sans);
	}

	#universal-tooltip .wine-name {
		font-weight: 700;
	}

	#universal-tooltip .winery-name {
		font-style: italic;
	}

	#universal-tooltip .deets .price-rating {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	#universal-tooltip .deets .rating {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		align-items: center;
	}

	:global(#universal-tooltip .deets .rating .stars img) {
		height: 18px;
		margin-top: -4px;
	}

	:global(#universal-tooltip.visible) {
		bottom: 0 !important;
	}

	#gradient {
		width: 100%;
		height: 100svh;
		position: fixed;
		z-index: 1;
		background: linear-gradient(to bottom, #181A1F, #14161a);
		pointer-events: none;
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
