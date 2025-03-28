<script>
    import { onMount, onDestroy } from "svelte";
    import Icon from "$components/helpers/Icon.svelte";
    import { tooltipType, lockedSelection, tooltipData } from "$stores/misc.js";
    import { useLazyImage as lazyImage } from 'svelte-lazy-image';

    function tooltipCloseClick() {
  		lockedSelection.set(false);
        tooltipType.set(null);
        tooltipData.set(null);
	}
  
    function formatStars(rating) {
      if (!rating) return '';
      let ratingReplaced = String(rating).replace(".", "_");
      return `star${ratingReplaced}.svg`;
    }

    $: data = $tooltipData;
    let handleClick;
    let tooltipEl;

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
  </script>
  
<div id="universal-tooltip" class:visible={$tooltipData} bind:this={tooltipEl}>
    {#if data}
        {#if $tooltipType == "bottle"}
            <button class="close" aria-label="close tooltip" on:click={tooltipCloseClick}>
                <Icon name="x" size={"1.5rem"}/>
            </button>
            <img class="label-img" use:lazyImage src={`./assets/images/vivinoLabels/img_${data.id}.png`} alt="wine label" />
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
                    <p class="price">${data.price.toFixed(2)}</p>
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
                            of <span class="bolded">{data[0][0][0].animalGroup}</span> wines 
                            are from <span class="bolded">{data[0][0][0].bucket}</span>,
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

    #universal-tooltip.visible {
		bottom: 0 !important;
        transition: bottom 0.5s linear;
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
  </style>