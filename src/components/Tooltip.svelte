<script>
    import { onMount, onDestroy } from "svelte";
    import Icon from "$components/helpers/Icon.svelte";
    import { tooltipType, lockedSelection, tooltipData, tooltipVisible } from "$stores/misc.js";
    import { useLazyImage as lazyImage } from 'svelte-lazy-image';
	import viewport from "$stores/viewport.js";

	// SCREENSIZE
	$: w = $viewport.width;
	$: h = $viewport.height;
	$: isMobile = w <= 500;

    function tooltipCloseClick() {
  		lockedSelection.set(false);
		tooltipVisible.set(false);
        tooltipType.set(null);
        tooltipData.set(null);
	}
  
    function formatStars(rating) {
      if (!rating) return '';
      let ratingReplaced = String(rating).replace(".", "_");
      return `star${ratingReplaced}.svg`;
    }

    let handleClick;
    let tooltipEl;
	let wrapper; 
	let lens;
	let zoomFactor = 4;
	let imgSrc;

	$: data = $tooltipData;
	$: if (data) {
		imgSrc = `./assets/images/vivinoLabels/img_${data.id}.png`;
	}

	// INTERACTIVE FUNCTIONS
	function handleMouseEnter() {
		lens.style.display = 'block';
		lens.style.backgroundImage = `url('${imgSrc}')`;
	}

	function handleMouseLeave() {
		lens.style.display = 'none';
	}

	function handleMouseMove(e) {
		const rect = wrapper.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const lensSize = lens.offsetWidth / 2;
		let lensX = x - lensSize;
		let lensY = y - lensSize;

		// Constrain lens inside wrapper
		lensX = Math.max(0, Math.min(lensX, wrapper.offsetWidth - lens.offsetWidth));
		lensY = Math.max(0, Math.min(lensY, wrapper.offsetHeight - lens.offsetHeight));

		lens.style.left = `${lensX}px`;
		lens.style.top = `${lensY}px`;

		// Set background position relative to mouse
		const bgX = (x / wrapper.offsetWidth) * 100;
		const bgY = (y / wrapper.offsetHeight) * 100;
		lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
	}

	// LIFECYCLE FUNCTIONS
	onMount(() => {
		handleClick = (e) => {
			const clickedEl = e.target;
			const isInsideTooltip = tooltipEl && tooltipEl.contains(clickedEl);
			const isScatterplot = clickedEl.closest('#scatterplot');

			if (!isInsideTooltip && !isScatterplot) {
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
  </script>
  
<div id="universal-tooltip" class:visible={$tooltipData && $tooltipVisible} bind:this={tooltipEl}>
    {#if data}
        {#if $tooltipType == "bottle"}
            <button class="close" aria-label="close tooltip" on:click={tooltipCloseClick}>
                <Icon name="x" size={"1.5rem"}/>
            </button>
            <div class="zoom-container"
					bind:this={wrapper}
					on:mouseenter={(e) => {
						if (!isMobile) handleMouseEnter(e)
					}}
					on:mouseleave={(e) => {
						if (!isMobile) handleMouseLeave(e)
					}}
					on:mousemove={(e) => {
						if (!isMobile) handleMouseMove(e)
					}}>
					<img class="label-img zoom-target" use:lazyImage src={`./assets/images/vivinoLabels/img_${data.id}.png`} alt="wine label" />
					{#if !isMobile}
						<div class="zoom-lens" bind:this={lens} style="background-size: {zoomFactor * 100}%"></div>
						<span class="mag">
							<Icon name="zoom-in" size={"1.5rem"}/>
						</span>
					{/if}
				</div>
            <div class="deets">
                <p class="wine-name">{data.name}</p>
                <p class="winery-name">{data.winery}, {data.country}</p>
                <p class="animal">
                    {data.topgroup}
                    <span class="chevron"><img src="./assets/images/chevron-right.png" alt=">" /></span>
                    {data.finalAnimal}
                </p>
                <p class="type">{data.type}</p>
                <div class="price-rating">
                    <p class="price">${data.price}</p>
                    <p class="rating">
                    {data.rating}
                    <span class="stars">
                        <img use:lazyImage src={`./assets/images/stars/${formatStars(data.rating)}`} alt="stars" />
                    </span>
                    </p>
                </div>
            </div>
            {:else if $tooltipType == "histo"}
                <button class="close" aria-label="close tooltip" on:click={tooltipCloseClick}>
                    <Icon name="x" size={"1.5rem"}/>
                </button>
                <div class="summary">
                    {#if data[0][0][0].category == "price"}
                        <p class="details">
                            <span class="bolded">{Math.round(data[0][0][0].percent)}%</span> 
                            of <span class="bolded">{data[0][0][0].animalGroup}</span> wines 
                            cost between <span class="bolded">${data[0][0][0].bucket}</span>,
                            compared to <span class="bolded">{Math.round(data[0][1][0].percent)}%</span> of all wines 
                        </p>
                    {:else if data[0][0][0].category == "rating"}
                        <p class="details">
                        <span class="bolded">{Math.round(data[0][0][0].percent)}%</span> 
                            of <span class="bolded">{data[0][0][0].animalGroup}</span> wines 
                            are rated between <span class="bolded">{data[0][0][0].bucket} stars</span>,
                            compared to <span class="bolded">{Math.round(data[0][1][0].percent)}%</span> of all wines 
                        </p>
                    {:else if data[0][0][0].category == "type"}
                        <p class="details">
                            <span class="bolded">{Math.round(data[0][0][0].percent)}%</span> 
                            of <span class="bolded">{data[0][0][0].animalGroup}</span> wines 
                            are <span class="bolded">{data[0][0][0].bucket}</span> wines,
                            compared to <span class="bolded">{Math.round(data[0][1][0].percent)}%</span> of all wines 
                        </p>
                    {:else if data[0][0][0].category == "country"}
                        <p class="details">
                            <span class="bolded">{Math.round(data[0][0][0].percent)}%</span> 
                            of wines from
                            <span class="bolded">{data[0][0][0].bucket}</span>
							are <span class="bolded">{data[0][0][0].animalGroup}</span> wines,
                            compared to <span class="bolded">{Math.round(data[0][1][0].percent)}%</span> of all wines 
                        </p> 
                    {/if}
                </div>
            {/if}
    {/if}
</div>

  <style>
	#universal-tooltip {
        position: fixed;
        left: 0;
        bottom: -200px;
        width: 100%;
        height: 200px;
		padding: 0.5rem;
        background: rgba(207, 202, 191, 0.98);
		border-top: 1px solid var(--wine-dark-gray);
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		z-index: 1000;
		transition: bottom var(--500ms) linear;
    }

    #universal-tooltip.visible {
		bottom: 0 !important;
        transition: bottom var(--500ms) linear;
	}

	.zoom-container {
		position: relative;
		height: 100%;
		width: auto;
	}

	.zoom-target {
		height: 100%;
		object-fit: contain;
		min-width: 130px;
		display: block;
	}

	.zoom-lens {
		position: absolute;
		pointer-events: none;
		border: 2px solid var(--wine-black);
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-size: 200%; /* adjust zoom level */
		display: none; /* hidden until hover */
	}

	.mag {
		position: absolute;
		bottom: -0.5rem;
		right: -0.5rem;
		background: var(--wine-black);
		/* border: 2px solid var(--wine-tan); */
		border-radius: 50%;
		height: 2rem;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.mag .icon) {
		width: 80%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.mag .icon svg) {
		width: 80%;
	}

	:global(.mag .icon svg circle, .mag .icon svg line) {
		stroke: var(--wine-tan);
		stroke-width: 2px;
	}

	button {
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

	button:hover {
		background: var(--wine-black);
	}

	:global(#universal-tooltip button svg) {
		margin-top: 4px;
	}

	:global(#universal-tooltip button:hover svg path) {
		stroke: var(--wine-tan);
	}

	.label-img {
		height: 100%;
	}

	.deets {
		display: flex;
		flex-direction: column;
	}

	.deets p {
		margin: 0;
		padding: 0;
		font-family: var(--sans);
		text-transform: capitalize;
	}

	.details {
		margin: 0;
		padding: 1rem;
		max-width: 550px;
		font-family: var(--sans);
		font-size: var(--18px);
	}

	.wine-name {
		font-weight: 700;
	}

	.winery-name {
		font-style: italic;
	}

	.deets .price-rating {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.deets .rating {
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

	@media(max-width: 700px) {
		#universal-tooltip {
			bottom: -140px;
			height: 140px;
		}
		.deets {
			font-size: var(--14px);
			padding-right: 3rem;
		}

		.zoom-target {
			min-width: 100px;
		}

		.close {
			width: 2rem;
			height: 2rem;
			top: 0.5rem;
			right: 0.5rem;
		}
	}
  </style>