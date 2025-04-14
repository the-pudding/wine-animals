<script>
    import { getContext } from "svelte";
    import { animalSelected} from "$stores/misc.js";
    import Scrolly from "$components/helpers/ChartScrolly.svelte";
    import ScrollScatter from "$components/ScrollScatter.svelte";
    import rawData from "$data/wineData.csv";
    import SummaryBottles from "$components/ChartScroll.SummaryBottles.svelte";
    import Filters from "$components/Filters.svelte";
    import Icon from "$components/helpers/Icon.svelte";

    const copy = getContext("copy");
    
    let chartScrollIndex;

    function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}_tan.svg`
    }

    $: selectedWine = $animalSelected == "cat" ? "161008470"
        : $animalSelected == "bird" ? "173188559"
        : $animalSelected == "pig" ?"171574314"
        : "161239002";

    $: selectedBottleData = rawData.filter(d => d.id == selectedWine);
</script>

<section id="chart-scroll">
    <div class="sticky">
        {#if chartScrollIndex == 14 || chartScrollIndex == "exit"}
            <Filters />
        {/if}
        <div class="chart-wrapper">
            <div class="scatter-wrapper" 
                class:active={chartScrollIndex !== 13}
            >
                <ScrollScatter chartScrollIndex={chartScrollIndex}/>
            </div>
            <div class="lineup-wrapper" class:active={chartScrollIndex == 13}>
                <SummaryBottles scrollIndex={chartScrollIndex}/>
            </div>
        </div>
    </div>
    <Scrolly bind:value={chartScrollIndex} bottom={0}>
        {#each copy.chartScroll as step, i}
            <div id="step-{i}" class="step">
                <div class="step-inner">
                    {#each step.block as graf, i}
                        <p>{@html graf.value}</p>
                    {/each}
                    {#if i == 0 && $animalSelected} 
                        <p>The <span class=selected-bottle-circle-span>animal group on the wine you selected</span> is highlighted in yellow.</p>
                    {:else if i == 5 && $animalSelected}  
                        <p>Here’s the <span class=selected-bottle-circle-span>bottle you selected.</span></p>
                        <div class="selected-bottle-display">
                            <img class="bottle-img" src="./assets/images/vivinoLabels/img_{selectedWine}.png" alt="wine label with {$animalSelected} on it"/>
                            <div class="deets">
                                <p class="wine-name"><span class="bold">{selectedBottleData[0].name}</span></p>
                                <p class="winery-name">{selectedBottleData[0].winery}</p>
                                <p class="animal">{selectedBottleData[0].topgroup}</p>
                                <p class="type">{selectedBottleData[0].type}</p>
                                <div class="price-rating">
                                    <p class="price">${selectedBottleData[0].price}</p>
                                    <p class="rating">
                                        {selectedBottleData[0].rating}
                                        <span class="stars"><img alt="stars" src="./assets/images/stars/{formatStars(selectedBottleData[0].rating)}" /></span>
                                    </p>
                                </div>
                            </div>
                        </div> 
                    {/if}  
                    {#if i == 8 && $animalSelected}
                        <p>{@html $animalSelected == "amphibian/reptile" ? copy.opening[0][("amphibianQuad")] : copy.opening[0][($animalSelected + "Quad")]}</p>
                    {/if} 
                    {#if i == 14}
                        <div class="scroll-hint">
                            <Icon name="chevron-down" size={"24px"} rotation={0}/>
                        </div>
                    {/if}       
                </div>
            </div>
        {/each}
    </Scrolly>
    <div class="spacer" />
</section>

<style>
    #chart-scroll {
        width: 100%;
    }
    .sticky {
        width: 100%;
        height: 100svh;
		position: sticky;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
		top: 0;
        left: 0;
		transition: all var(--1000ms);
        z-index: 1;
        overflow: hidden;
	}

    .chart-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .scatter-wrapper, .lineup-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 900;
        opacity: 0;
    }

    .scatter-wrapper {
        width: 100%;
        height: 100%;
        left: 0;
        transform: translate(0,0);
        padding: 4rem 0 10rem 0;
        transition: opacity var(--750ms) linear;
    }

    .lineup-wrapper {
        width: 100%;
        height: 100%;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity var(--250ms) linear;
    }

    .scatter-wrapper.active, .lineup-wrapper.active {
        opacity: 1;
    }

    .spacer {
		height: 140svh;
	}

	.step {
		height: 90vh;
        z-index: 900;
        max-width: 400px;
        opacity: 1;
	}

    #step-13 {
        height: 140vh;
    }

    .step-inner { 
        background: rgba(24, 26, 31, 0.98);
        padding: 1rem 2rem;
        border: 1px solid var(--wine-dark-gray);
        border-radius: 3px;
        box-shadow: -4px 4px 10px rgb(17, 17, 17, 0.5);
        position: relative;
    }

    .step p {
        text-align: left;
        max-width: 720px;
        line-height: 1.65;
        color: var(--wine-tan);
        font-size: var(--18px);
        line-height: 1.65;
        background: none;
        z-index: 900;
        margin: 1rem 0;
        pointer-events: auto;
    }

    .scroll-hint {
        width: 3rem;
        height: 3rem;
        background: var(--wine-gold);
        position: absolute;
        bottom: -1.5rem;
        left: 50%;
        transform: translate(-50%, 0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: bounceUp 1s infinite;
    }

    .selected-bottle-display {
        width: 100%;
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
    }

    .bottle-img {
        width: 140px;
        aspect-ratio: 1 / 1.325;
    }

    .selected-bottle-display .deets {
        width: calc(100% - 140px);
    }

    .selected-bottle-display .deets p {
        margin: 0;
        font-family: var(--sans);
        font-size: var(--16px);
        line-height: 1.25rem;
    }

    .selected-bottle-display .winery-name {
		font-style: italic;
	}

	.selected-bottle-display .deets .price-rating {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

    .selected-bottle-display .deets .rating {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		align-items: center;
	}

    .selected-bottle-display .deets .rating .stars {
        display: inline-block;
    }

	.stars img {
        width: auto;
		height: 18px;
		margin-top: -4px;
	}

    :global(.skipToExplore) {
        font-family: var(--sans);
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
    }

    :global(.skipToExplore:hover) {
        opacity: 0.5;
    }

    :global(.median-line-span, .compare-line-span, .sweet-rect-span, .cream-line-span, .selected-bottle-circle-span, .best-deals-span) {
        position: relative;
        font-weight: 700;
        margin-left: 2.25rem;

        font-family: var(--sans);
        
    }

    :global(.median-line-span::before, .compare-line-span::before, .sweet-rect-span::before, .cream-line-span::before, .selected-bottle-circle-span::before, .best-deals-span::before) {
        position: absolute;
        top: 50%;
        left: -2rem;
        width: 1.5rem;
        height: 1.5rem;
        content: "";
        margin: 0 1rem 0 0;
    }

    :global(.selected-bottle-circle-span::before) {
        border: 2px solid var(--wine-gold);
        border-radius: 50%;
        top: 0%;
    }

    :global(.best-deals-span::before) {
        background: var(--wine-green);
        border-radius: 50%;
        top: 0%;
    }

    :global(.median-line-span::before) {
        border-top: 3px solid var(--wine-red);
        top: 8px;
    }

    :global(.cream-line-span::before) {
        border-top: 3px solid var(--wine-tan);
    }

    :global(.compare-line-span::before) {
        top: 40%;
        height: 0.5rem;
        border-top: 2px solid var(--color-gray-600);
        border-bottom: 2px solid var(--color-gray-600);
    }

    :global(.sweet-rect-span::before) {
        background: rgb(54, 59, 69, 0.75);
        top: 0;
        border-top: 2px solid var(--wine-tan);
        border-left: 2px solid var(--wine-tan);
    }

    :global(.more-span) {
        font-weight: 700;
        background: var(--wine-green);
        color: var(--wine-tan);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-family: var(--sans);
    }

    :global(.less-span) {
        font-weight: 700;
        background: var(--wine-red);
        color: var(--wine-tan);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-family: var(--sans);
    }

    :global(.bold) {
        font-weight: 700;
        font-family: var(--sans);
    }

    :global(.slider-span) {
        font-weight: 700;
        font-family: var(--sans);
        position: relative;
        padding-left: 2rem;
        color: var(--wine-gold);
        font-size: var(--16px);
        line-height: 1;
    }

    :global(.slider-span::before) {
        content: '';
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        left: 0;
        top: -2px;
        background: url("/assets/images/range-vert.png");
        background-size: 1.5rem 1.5rem;
        background-repeat: no-repeat;
    }

    @keyframes bounceUp {
        0%       { bottom:-24px; }
        50%      { bottom:-28px; }
        100%     { bottom:-24px; }
    }

    @media(max-width: 1400px) {
		.sticky {
			align-items: center;
            justify-content: center;
		}

        .chart-wrapper {
            justify-content: center;
            align-items: center;
        }

        .scatter-wrapper {
            left: 50%;
            transform: translate(-50%,0);
        }

        .step {
            max-width: 550px;
        }
	}

    @media(max-width: 700px) {
        .scatter-wrapper {
            width: 100%;
            padding: 10rem 0 4rem 0;
        }

        .step {
            height: 90vh;
            z-index: 900;
            max-width: 90%;
            opacity: 1;
        }
        .step-inner {
            padding: 1rem 1rem 2rem 1rem;
        }

        .step p {
            font-size: var(--16px);
            margin: 0;
        }

        .bottle-img {
            width: 100px;
        }

        :global(.median-line-span, .compare-line-span, .sweet-rect-span, .cream-line-span, .selected-bottle-circle-span, .best-deals-span) {
            margin-left: 1.75rem;     
        }

        :global(.median-line-span::before, .compare-line-span::before, .sweet-rect-span::before, .cream-line-span::before, .selected-bottle-circle-span::before, .best-deals-span::before) {
            left: -1.5rem;
            width: 1.25rem;
            height: 1.25rem;
            content: "";
            margin: 0;
        }

        :global(.median-line-span::before) {
            top: 8px;
        }
    }
</style>