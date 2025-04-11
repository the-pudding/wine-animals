<script>
	// SVELTE
	import { getContext } from "svelte";

	// STORES
	import { currAnimalSlide } from "$stores/misc.js";
	
	// COMPONENTS
	import inView from "$actions/inView.js";
	import Intro from "$components/Intro.svelte";
	import ChartScroll from "$components/ChartScroll.svelte";
	import AnimalCard from "$components/AnimalCard.svelte";
	import AnimalCardNav from "$components/AnimalCard.Nav.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Outro from "$components/Outro.svelte";
	import Footer from "$components/Footer.svelte";
	import Tooltip from "$components/Tooltip.svelte";

	// VARIABLES
	const copy = getContext("copy");
	const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "marine invertebrate", "mythical creature", "pachyderm", "pig", "rabbit", "sheep"
	];

	let sliderEl;
	let tapVisible = false;

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
			<Slide index={i}>
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
		padding: 0rem 1rem;
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

	@media (max-width: 700px) {
		.prose p {
			font-size: var(--16px);
		}
	}
</style>
