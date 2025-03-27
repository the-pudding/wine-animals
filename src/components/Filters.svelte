<script>
    import MultiSelect from 'svelte-multiselect';
    import Typeahead from 'svelte-typeahead';
    import DoubleRange from "$components/helpers/DoubleRange.svelte";
    import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE, searchedWineSTORE, tooltipType } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import Icon from "$components/helpers/Icon.svelte";
    import * as d3 from 'd3';

    const totalMedianPrice = d3.median(rawData, d => d.price);
    const totalMedianRating = d3.median(rawData, d => d.rating);
    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "none" && d.topgroup !== "human" && d.topgroup !== "bat" && d.topgroup !== "marsupial" && d.topgroup !== "monkey" && d.topgroup !== "mustelid-like/rodent-like");

    const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
        "deer", "fish", "horse", "marine invertebrate", "mythical creature", "pachyderm", "pig",
        "rabbit", "sheep"
    ];
    const wineType = ["Dessert", "Fortified", "Red", "Rose", "Sparkling", "White"];
    const wineCountry = ["Argentina", "Australia", "Austria", "Chile", "France", "Georgia", "Germany",
        "Hungary", "Italy", "New Zealand", "North Macedonia", "Portugal", "Romania", "South Africa",
        "Spain", "Switzerland", "United States", "Uruguay"
    ];

    $: availableWines = $bigScatterData.map(d => ({
        label: `${d.name}, ${d.winery}`, // This is what the user sees
        value: d.id // This is used to find the matching circle
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

    let selectedAnimal = [];
    let selectedType = [];
    let selectedCountry = [];
    let searchedWine = [];
    let events = [];
    let searchTerm = '';

    function storeUpdates(selectedGroup, valType) {
        if (valType == "animal") {
            selectedAnimalSTORE.set(selectedGroup)
        } else if (valType == "type") {
            selectedTypeSTORE.set(selectedGroup)
        } else if (valType == "country" ) {
            selectedCountrySTORE.set(selectedGroup)
        } else {
            searchedWineSTORE.set(selectedGroup)
        }
    }

    function updateScatterData(
        selectedAnimalSTORE,
        selectedTypeSTORE,
        selectedCountrySTORE,
        selectedPriceRangeSTORE,
        selectedRatingRangeSTORE,
        selectedYearRangeSTORE
    ) {
        const hasAnimalFilter = selectedAnimalSTORE.length > 0;
        const hasTypeFilter = selectedTypeSTORE.length > 0;
        const hasCountryFilter = selectedCountrySTORE.length > 0;
        const hasPriceRangeFilter = selectedPriceRangeSTORE.length === 2;
        const hasRatingRangeFilter = selectedRatingRangeSTORE.length === 2;
        const hasYearRangeFilter = selectedYearRangeSTORE.length === 2;

        const filteredData = filteredRawData.filter(d => {
            if (hasAnimalFilter) {
                const topGroups = d.topgroup.split(",").map(group => group.trim());
                if (!topGroups.some(group => selectedAnimalSTORE.includes(group))) {
                    return false;
                }
            }
            if (hasTypeFilter && !selectedTypeSTORE.includes(d.type)) {
                return false;
            }
            if (hasCountryFilter && !selectedCountrySTORE.includes(d.country)) {
                return false;
            }
            if (hasPriceRangeFilter && (d.price < selectedPriceRangeSTORE[0] || d.price > selectedPriceRangeSTORE[1])) {
                return false;
            }
            if (hasRatingRangeFilter && (d.rating < selectedRatingRangeSTORE[0] || d.rating > selectedRatingRangeSTORE[1])) {
                return false;
            }
            if (hasYearRangeFilter && d.year !== "" && (d.year < selectedYearRangeSTORE[0] || d.year > selectedYearRangeSTORE[1])) {
                return false;
            }
            return true;
        });

        bigScatterData.set(filteredData);
    }

    function updateSearchedWine(detail) {
        d3.selectAll("#scatter-explore .selected-wine")
            .transition()
            .duration(300)
            .attr("r", 4) // Reset size
            .style("stroke", "none")
            .style("stroke-width", "0px")
            .style("fill", "#38425d")
            .style("opacity", 0.8);

        const foundWine = filteredRawData.find(d => d.id === detail.original.value);


        if (foundWine) {
            d3.selectAll(`#scatter-explore #circle-${foundWine.id}`)
                .classed("selected-wine", true)
                .raise()
                .transition()
                .duration(500)
                .attr("r", 10)
                .style("fill", "#CFCABF")
                .style("opacity", 1);

            tooltipType.set("bottle");
            setTimeout(() => {
                setTooltip(foundWine);
            }, 200);
        }

        //     if ($searchedWineSTORE !== undefined && $searchedWineSTORE.length == 1) {
        //         d3.selectAll("#scatter-explore .selected-wine")
        //             .transition()
        //             .duration(300)
        //             .attr("r", 4) // Reset size
        //             .style("stroke", "none")
        //             .style("stroke-width", "0px")
        //             .style("fill", "#38425d")
        //             .style("opacity", 0.8);

        //         const wine = $searchedWineSTORE;
        //         const foundWine = filteredRawData.find(d => d.id === wine[0].value);

        //         if (foundWine) {
        //             d3.selectAll(`#scatter-explore #circle-${foundWine.id}`)
        //                 .classed("selected-wine", true)
        //                 .raise()
        //                 .transition()
        //                 .duration(500)
        //                 .attr("r", 10)
        //                 .style("fill", "#CFCABF")
        //                 .style("opacity", 1);

        //             tooltipType.set("bottle");
        //             setTimeout(() => {
        //                 setTooltip(foundWine);
        //             }, 200);
        //         }
        // }
    }

    function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}.svg`
    }

    function setTooltip(data) {
		let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", true);

		tooltip.select("img").attr("src", `./assets/images/vivinoLabels/img_${data.id}.png`);

		tooltip.select(".wine-name").text(data.name);
		tooltip.select(".winery-name").text(`${data.winery}, ${data.country}`);
		tooltip.select(".animal").html(
			`${data.topgroup}
		 	<span class="chevron"><img alt="stars" src="./assets/images/chevron-right.png" /></span>
			${data.finalAnimal}`);
		tooltip.select(".type").text(`${data.type}`);
		tooltip.select(".price").text(`$${data.price.toFixed(2)}`); // Add `$` for price formatting
		tooltip.select(".rating").html(
			`${data.rating}
			<span class="stars"><img alt="stars" src="./assets/images/stars/${formatStars(data.rating)}" /></span>`
		);	
	}

    $: storeUpdates(selectedAnimal, "animal")
    $: storeUpdates(selectedType, "type")
    $: storeUpdates(selectedCountry, "country")
    $: storeUpdates(searchedWine, "wine")
    $: updateScatterData($selectedAnimalSTORE, $selectedTypeSTORE, $selectedCountrySTORE, $selectedPriceRangeSTORE, $selectedRatingRangeSTORE, $selectedYearRangeSTORE);

    function findSteals(data) {
        let steals = data.filter(d => d.price <= totalMedianPrice && d.rating >= totalMedianRating);
        return steals
    }

    $: belowPriceAboveRating = findSteals($bigScatterData);
</script>


<div id="filters">
    <div class="filters-inner">
        <div class="wrapper">
            <div class="select-wrapper">
                <div class="filter">
                    <MultiSelect 
                        bind:selected={selectedAnimal}
                        options={topgroups} 
                        valType = "animal"
                        placeholder="All animals"
                        removeAllTitle="Remove all animals"
                        ariaLabel="select animals"
                    > 
                        <span slot="expand-icon">
                            <Icon name="chevrons-up-down" size="0.75rem"/>
                        </span>
                    </MultiSelect>
                </div>
                <div class="filter">
                    <MultiSelect 
                        bind:selected={selectedType}
                        options={wineType} 
                        valType = "type"
                        placeholder="All types"
                        removeAllTitle="Remove all types"
                        ariaLabel="select wine types"
                    > 
                        <span slot="expand-icon">
                            <Icon name="chevrons-up-down" size="0.75rem"/>
                        </span>
                    </MultiSelect>
                </div>
                <div class="filter">
                    <MultiSelect 
                        bind:selected={selectedCountry}
                        options={wineCountry} 
                        valType = "country"
                        placeholder="All countries"
                        removeAllTitle="Remove all countries"
                        ariaLabel="select countries"
                    > 
                        <span slot="expand-icon">
                            <Icon name="chevrons-up-down" size="0.75rem"/>
                        </span>
                    </MultiSelect>
                </div>
                <div class="search-wrapper">
                    <Typeahead
                        bind:value={searchTerm}
                        hideLabel
                        label="U.S. States"
                        placeholder={`Search by name or winery`}
                        data={availableWines}
                        limit={4}
                        extract={(item) => item.label}
                        on:select={({ detail }) => {
                            events = [...events, detail];
                            updateSearchedWine(detail);
                        }}
                        on:clear={() => events = [...events, "clear"]}
                    />
                    {#if searchTerm}
                        <button class="clear-btn" on:click={() => searchTerm = ''}>
                            <Icon name="x" size={"0.75rem"}/>
                        </button>
                    {/if}
                </div>
            </div>
            <div class="range-wrapper">
                <div class="filter">
                    <label for="price-range">Price</label>
                    <DoubleRange id="price-range" start={3} end={150} min={3} max={150} valType={"price"}/>
                </div>
                <div class="filter">
                    <label for="rating-range">Rating</label>
                    <DoubleRange id="rating-range" start={2.5} end={5} min={2.5} max={5} valType={"rating"}/>
                </div>
                <div class="filter">
                    <label for="year-range">Year</label>
                    <DoubleRange id="year-range" start={1850} end={2023} min={1850} max={2023} valType={"years"}/>
                </div>
            </div>
        </div>
        {#if belowPriceAboveRating.length !== 1}
            <p>There are <span class="highlight">{belowPriceAboveRating.length} good deal wines</span> with your current selections.</p>
        {:else}
        <p>There is <span class="highlight">{belowPriceAboveRating.length} good deal wine</span> with your current selections.</p>
        {/if}
    </div>
</div>

<style>
    p {
        color: var(--wine-tan);
        max-width: 800px;
        margin: 1rem auto;
        font-family: var(--sans);
        font-size: var(--16px);
    }
    .highlight {
        color: var(--wine-tan);
        background-color: var(--wine-green);
        padding: 0.25rem;
        border-radius: 3px;
        font-weight: 700;
    }
    #filters {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        flex-direction: row;
        align-items: flex-start;
        margin: 0 auto;
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 2rem;
        background: rgba(24,26,31,0.98);
        border-bottom: 1px solid var(--wine-dark-gray);
    }

    .filters-inner {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }

    .select-wrapper, .range-wrapper {
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .range-wrapper {
        gap: 2.5rem;
        margin-right: 2rem;
    }

    .filter {
        width: 100%;
    }

    .range-wrapper .filter {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    label {
        width: 80px;
        text-align: right;
        color: var(--wine-dark-tan);
        font-family: var(--sans);
        text-transform: uppercase;
        font-size: var(--14px);
    }

    .search-wrapper {
        width: 100%;
        position: relative;
    }

    .clear-btn {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        top: 4px;
        background: var(--wine-tan);
    }

    :global(#filters .multiselect) {
        background: var(--wine-tan) !important;
        height: 2.5rem !important;
        font-family: var(--sans) !important;
    }

    :global([data-svelte-typeahead]) {
        background: var(--wine-tan) !important;
        position: relative;
        border-radius: 3pt !important;
    }

    :global([data-svelte-typeahead] input) {
        border: none !important;
        border-radius: 3pt !important;
        height: 2.5rem !important;
        font-family: var(--sans) !important;
        font-size: var(--16px) !important;
        color: var(--wine-black) !important;
        outline: none !important;

        background-image: url('/assets/images/search.png') !important;
        background-repeat: no-repeat !important;
        background-size: 0.8rem !important;
        background-position: 0.3rem center !important;
        padding-left: 1.5rem !important; /* Make room for the icon */
    }

    :global([data-svelte-typeahead] input::placeholder) {
        color: var(--wine-black) !important;
    }

    :global([data-svelte-typeahead] ul) {
        font-family: var(--sans) !important;
        background: var(--wine-tan);
        transform: translateY(-3px);
    }

    :global([data-svelte-typeahead] li) {
        font-family: var(--sans) !important;
        background: var(--wine-tan) !important;
        border-bottom: 1px solid var(--wine-dark-tan) !important;
    }

    :global([data-svelte-typeahead] li.selected) {
        font-family: var(--sans) !important;
        background: var(--wine-tan) !important;
    }

    :global([data-svelte-typeahead] li.selected:hover) {
        background: var(--wine-dark-tan) !important;
    }

    :global([data-svelte-typeahead] ul mark) {
        padding: 0;
        font-weight: 700;
        background: none;
        color: var(--wine-red);
    }

    :global([data-svelte-typeahead] input[type="search"]::-webkit-search-cancel-button) {
        -webkit-appearance: none;
        appearance: none;
        display: none;
    }
</style>