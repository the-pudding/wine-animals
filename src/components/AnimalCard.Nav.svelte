<script>
	import { onMount, tick } from "svelte";
	import { navAnimal, currAnimalSlide } from "$stores/misc.js";
    import { useLazyImage as lazyImage } from 'svelte-lazy-image';

	const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "marine invertebrate", "mythical", "pachyderm", "pig",
		"rabbit", "sheep"
	];

	let nav; // Reference to the <nav> element
	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;
	let userDragged = false; // Tracks if the user manually dragged

	// 🟢 Handle Mouse Dragging
	function handleMouseDown(e) {
		isDragging = true;
		userDragged = true; // User manually moved nav, pause auto-centering
		startX = e.pageX - nav.offsetLeft;
		scrollLeft = nav.scrollLeft;
		nav.classList.add("dragging");
	}

	function handleMouseMove(e) {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - nav.offsetLeft;
		const walk = (x - startX) * 1.5; // Adjust speed factor
		nav.scrollLeft = scrollLeft - walk;
	}

	function handleMouseUp() {
		isDragging = false;
		nav.classList.remove("dragging");
	}

	function handleMouseLeave() {
		isDragging = false;
		nav.classList.remove("dragging");
	}

	// 🟢 Mobile Swipe Support
	let touchStartX = 0;
	let touchScrollLeft = 0;

	function handleTouchStart(e) {
		userDragged = true; // User manually swiped
		touchStartX = e.touches[0].pageX;
		touchScrollLeft = nav.scrollLeft;
	}

	function handleTouchMove(e) {
		const touchX = e.touches[0].pageX;
		const walk = (touchX - touchStartX) * 1.5;
		nav.scrollLeft = touchScrollLeft - walk;
	}

	// 🟢 Center the Active Item
	async function centerActiveElement() {
        await tick(); // Ensure DOM updates before measuring
        if (!nav || userDragged) return; // Skip centering if user is dragging/swiping

        const activeEl = nav.querySelector(".isActive");
        if (!activeEl) return;

        const navRect = nav.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        // Calculate the current scroll position
        const navCenter = navRect.left + navRect.width / 2;
        const activeCenter = activeRect.left + activeRect.width / 2;

        // Offset needed to move the active element to the center
        const offset = activeCenter - navCenter;

        // Smoothly scroll the navigation
        nav.scrollTo({ left: nav.scrollLeft + offset, behavior: "smooth" });
    }

	// 🟢 Initialize event listeners and center first item
	onMount(() => {
		// Center first item on page load
		centerActiveElement();

		// Add drag/swipe event listeners
		nav.addEventListener("mousedown", handleMouseDown);
		nav.addEventListener("mouseleave", handleMouseLeave);
		nav.addEventListener("mouseup", handleMouseUp);
		nav.addEventListener("mousemove", handleMouseMove);

		// Mobile Touch Support
		nav.addEventListener("touchstart", handleTouchStart);
		nav.addEventListener("touchmove", handleTouchMove);
	});

    $: centerActiveElement($navAnimal);

    function handleClick(animal, i) {
        navAnimal.set(animal);
        currAnimalSlide.set(i);
    }
 </script>

<nav bind:this={nav} id="animal-nav">
    {#each topgroups as animal, i}
        <button class="animal-group"
            class:isActive={animal == topgroups[$currAnimalSlide]}
            on:click={() => handleClick(animal, i)}
            >
            <div class="img-wrapper">
                <img src="assets/images/icons/{animal.replace(/[^a-zA-Z0-9]/g, "")}.png"
                alt="{animal} icon"
                id="{animal.replace(/[^a-zA-Z0-9]/g, "")}-nav"
                class="navIcon"
                use:lazyImage>
            </div>
            <p>{animal}</p>
        </button>
    {/each}
</nav>

<style>
    nav {
        width: 100%;
        overflow-x: hidden;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        min-height: 8rem;
        pointer-events: auto;
        cursor: pointer;
        z-index: 1000;
        background: rgba(24,26,31,0.98);
        border-bottom: 1px solid var(--wine-dark-gray);
    }

    .animal-group {
        min-width: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;
        display: flex;
        transform: scale(1);
		transition: all var(--250ms);
        pointer-events: auto;
        cursor: pointer;
        margin: 0 1rem;
        padding: 2rem 0 1rem 0;
    }
    
    button {
        background: transparent;
    }

    .animal-group:hover {
        opacity: 1;
        transform: scale(1.2);
        transition: all var(--250ms);
    }

    .img-wrapper {
        width: 50px;
        aspect-ratio: 1 / 1;
        background: var(--wine-dark-tan);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .isActive .img-wrapper {
        background: var(--wine-tan);
    }

    .navIcon {
        width: 80%;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
        user-select: none;
        pointer-events: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    p {
		font-family: var(--sans);
		text-align: center;
		width: 80%;
		font-size: var(--12px);
		color: var(--wine-dark-tan);
        margin: 0.5rem auto 1rem auto;
        line-height: 1.25;
        user-select: none;
        pointer-events: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        margin: 0.5rem 0;
        text-transform: capitalize;
        font-weight: 700;
	}

    .isActive p {
        color: var(--wine-tan)
    }

    :global(.isActive) {
        opacity: 1 !important;
        transform: scale(1.2) !important;
        transition: all var(--250ms);
    }

    @media (max-width: 700px) {
		.animal-group {
            min-width: 80px;
        }

        .img-wrapper {
            width: 40px;
        }

        p {
            font-size: var(--12px);
        }

        :global(.isActive) {
            opacity: 1 !important;
            transform: scale(1.1) !important;
            transition: all var(--250ms);
        }
	}
</style>