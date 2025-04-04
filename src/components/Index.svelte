<script>
	// SVELTE
	import { getContext } from "svelte";

	// STORES
	import { currAnimalSlide, tooltipType, lockedSelection, searchedWineSTORE, tooltipData } from "$stores/misc.js";
	
	// COMPONENTS
	import inView from "$actions/inView.js";
	import Icon from "$components/helpers/Icon.svelte";
	import Intro from "$components/Intro.svelte";
	import ChartScroll from "$components/ChartScroll.svelte";
	import AnimalCard from "$components/AnimalCard.svelte";
	import AnimalCardNav from "$components/AnimalCard.Nav.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Outro from "$components/Outro.svelte";
	import Explore from "$components/Explore.svelte";
	import Footer from "$components/Footer.svelte";
	import Tooltip from "$components/Tooltip.svelte";

	// LIBRARIES
	import { select, selectAll } from "d3-selection";

	import allWineData from "$data/wineData.csv";

	// VARIABLES
	const copy = getContext("copy");
	const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "marine invertebrate", "mythical creature", "pachyderm", "pig", "rabbit", "sheep"
	];

	let sliderEl;
	let tapVisible = false;
	let tooltipEl;
	let handleClick;

	// INTERACTION FUNCTIONS
	// Makes tap visible when section enters
	function handleEnter(dir) {
		tapVisible = dir == "enter" ? true : false;
	}

	// Handles the left/right tap for the animal card section
	function handleTap(direction) {
		// Moves slider based on direction click
		if (direction === "left") {
			sliderEl.prev();
		} else {
			sliderEl.next();
		}

		// Moves the slider to the next or previous animal
		currAnimalSlide.update(n => {
			if (direction === "left") return Math.max(0, n - 1); // Prevent going below 0
			if (direction === "right") return Math.min(topgroups.length - 1, n + 1); // Prevent exceeding last index
			return n;
		});
	}

	// Moves the slider to the current animal slide
	function moveSlider() {
		if (sliderEl) {
			sliderEl.jump($currAnimalSlide);
		}
	}

	// REATIVE FUNCTIONS
	$: moveSlider($currAnimalSlide);
</script>

<div id="gradient"></div>
<Intro />
<ChartScroll />
<div 
	class="cards"
	id="animal-cards"
	use:inView
	on:enter={() => handleEnter("enter")}
	on:exit={() => handleEnter("exit")}
>
	<div class="prose">
		{#each copy.postScatter as graf, i}
			<p>{@html graf.value}</p>
		{/each}
	</div>
	<AnimalCardNav />
	{#if tapVisible}
		<Tap showArrows={true} enableKeyboard={true} on:tap={e => handleTap(e.detail)}/>
	{/if}
	<Slider bind:this={sliderEl}>
		{#each topgroups as animal, i}
			<Slide>
				{#key animal}
					<AnimalCard animal={animal} />
				{/key}
			</Slide>
		{/each}
	</Slider>
</div>
<Outro />
<Tooltip />
<!-- <Explore />  -->
<Footer recirc={true} />

<style>
	#gradient {
		width: 100%;
		height: 100svh;
		position: fixed;
		z-index: 1;
		background: linear-gradient(to bottom, #181A1F, #14161a);
		pointer-events: none;
	}

	.cards {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.prose {
		max-width: 700px;
		margin: 0 auto;
		color: var(--wine-tan);
		z-index: 900;
	}

	.prose p {
		color: var(--wine-tan);
		font-size: var(--18px);
    	line-height: 1.65;
	}

	.prose p:last-of-type {
		font-family: var(--sans);
		font-weight: 700;
		color: var(--wine-gold);
		font-size: var(--16px);
	}

	:global(.l-r-arrows) {
		position: relative;
		display: inline-block;
		margin-left: 2.9rem;
	}

	:global(.l-r-arrows::before) {
		position: absolute;
		content: "";
		width: 2.5rem;
		height: 1.25rem;
		left: -2.75rem;
		top: 0.125rem;
		background-image: url("/assets/images/left-right-arrows.png");
		background-size: 98% 98%;
	}
</style>
