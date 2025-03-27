<script>
	// SVELTE
	import { getContext, onMount, onDestroy } from "svelte";

	// STORES
	import { currAnimalSlide, tooltipType, lockedSelection, searchedWineSTORE } from "$stores/misc.js";
	
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

	// LIBRARIES
	import { select, selectAll } from "d3-selection";

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

	// Closes the tooltip on click
	function tooltipCloseClick() {
		select("#universal-tooltip").classed("visible", false)

		lockedSelection.set(false)
		searchedWineSTORE.set(undefined)
	}

	// LIFECYCLE FUNCTIONS
	onMount(() => {
		handleClick = (e) => {
			if (tooltipEl && !tooltipEl.contains(e.target)) {
				tooltipCloseClick();
			}
		};

		if (typeof document !== 'undefined') {
			document.addEventListener("click", handleClick, true);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined' && handleClick) {
			document.removeEventListener("click", handleClick, true);
		}
	});

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
				<AnimalCard animal={animal}/>
			</Slide>
		{/each}
	</Slider>
</div>
<Outro />
<div id="universal-tooltip" bind:this={tooltipEl}>
	<button class="close" aria-label="close tooltip" on:click={tooltipCloseClick}>
		<Icon name="x" size={"1.5rem"}/>
	</button>
	{#if $tooltipType == "bottle"}
		<img src="" alt="wine bottle label"/>
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
	{:else}
		<div class="summary"></div>
	{/if}
</div>
<Explore /> 
<Footer recirc={true} />

<style>
	/* UNIVERSAL TOOLTIP */
	:global(#universal-tooltip.visible) {
		bottom: 0 !important;
	}

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
		font-size: var(--18px);
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

	:global(#universal-tooltip .chevron) {
		display: inline-block;
		line-height: 1;
	}

	:global(#universal-tooltip .chevron img) {
		height: 18px;
		position: relative;
		top: 2px;
	}

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
