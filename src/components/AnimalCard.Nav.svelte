<script>
    import { onMount, tick } from "svelte";
    import * as d3 from "d3";
    import { navAnimal, currAnimalSlide } from "$stores/misc.js";

    const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
		"deer", "fish", "horse", "human",
		"marine invertebrate", "mythical", "none", "pachyderm", "pig",
		"rabbit", "ram"
	];

    let Carousel; // for saving Carousel component class
    let carousel; // for calling methods of the carousel instance
    let w;
    let itemW = 140;
    let carouselLength = topgroups.length
    let particleNum;
    let carouselContainer;
    let currAnimal = "amphibian/reptile";

    function updateParticles(w) {
        particleNum = Math.ceil(w/itemW);
        // console.log(particleNum)
    }

    // async function updateNavPos(currAnimal, particleNum) {
    //     await tick(); // Ensures the DOM updates before running

    //     if (particleNum) {
    //         const index = topgroups.indexOf(currAnimal); // Find index of selected animal
    //         if (index >= 0 && carousel) {
    //             const page = Math.floor(index / particleNum); // Determine which page to show
    //             carousel.goTo(page, { animated: true }); // Move to the correct page
    //         }
    //     }
    // }

    $: updateParticles(w);
    // $: updateNavPos(currAnimal, particleNum);

    onMount(async () => {
        const module = await import('svelte-carousel');
        Carousel = module.default;
    });

    function handleItemClick(e) {
        // currAnimal = e.target.id.split("-")[0];
        // const item = e.target.parentNode.parentNode;
        // const itemClass = item.className;
        // if (itemClass.includes("navBlock")) {
        //     const itemID = e.target.parentNode.parentNode.id;
        //     const next = itemID.split("_")[1]
        //     const navBlocks = d3.selectAll(".navBlock").classed("isActive", false);
        //     const dupeBlocks = d3.selectAll(`#${itemID}`).classed("isActive", true);
        //     item.classList.add("isActive");
        // }

        // const targetElement = document.querySelector(`#animal-card-${currAnimal}`);
        // if (targetElement) {
        //     const offset = 140;
        //     const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

        //     window.scrollTo({ top: targetPosition, behavior: "smooth" });
        // }
    }
</script>


<svelte:window bind:innerWidth={w}/>
{#key particleNum}
    <nav on:click={handleItemClick}>
        <svelte:component 
            this={Carousel}
            bind:this={carousel}
            particlesToShow={particleNum}
            particlesToScroll={4}
            arrows={false}
            swiping={true}
            initialPageIndex={0}
            dots={false}>
            {#each topgroups as animal, i}
                {#if animal !== "none" && animal !== "human"}
                    <div class="navBlock" 
                        class:isActive={animal == topgroups[$currAnimalSlide]} 
                        id="nav_{animal.replace(/[^a-zA-Z0-9]/g, "")}"
                    >
                        <div class="img-wrapper">
                            <img src="assets/images/icons/{animal.replace(/[^a-zA-Z0-9]/g, "")}.png"
                            alt="{animal} icon"
                            id="{animal.replace(/[^a-zA-Z0-9]/g, "")}-nav"
                            class="navIcon">
                        </div>
                        <p>{animal}</p>
                    </div>
                {/if}
            {/each}
        </svelte:component>
    </nav>
{/key}

<style>
    nav {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        overflow-x: hidden;
        min-height: 8rem;
        pointer-events: auto;
        cursor: pointer;
        z-index: 1000;
        background: rgba(24,26,31,0.98);
        border-bottom: 1px solid var(--wine-dark-gray);
    }

    .navBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0.5;
        transform: scale(1);
		transition: all 300ms;
        pointer-events: auto;
        cursor: pointer;
        margin: 0 1rem;
        padding: 2rem 0 1rem 0;
    }

    .img-wrapper {
        width: 50px;
        aspect-ratio: 1 / 1;
        background: var(--wine-tan);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .navIcon {
        width: 80%;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
        user-select: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .navBlock p {
		font-family: var(--sans);
		text-align: center;
		width: 80%;
		font-size: var(--12px);
		color: var(--wine-tan);
        margin: 0.5rem auto 1rem auto;
        line-height: 1.25;
        user-select: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        margin: 0.5rem 0;
        text-transform: capitalize;
        font-weight: 700;
	}

    :global(.isActive) {
        opacity: 1 !important;
        transform: scale(1.2) !important;
        transition: all 300ms;
    }

    @media (hover: hover) {
        .navBlock:hover {
            transform: scale(1);
        }
    }
</style>