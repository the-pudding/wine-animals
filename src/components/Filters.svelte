<script>
    import MultiSelect from 'svelte-multiselect';
    import DoubleRange from "$components/helpers/DoubleRange.svelte";
    import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, searchedWineSTORE, tooltipType, tooltipData, lockedSelection, stealPercent, stealPriceNum, stealRatingNum, withFiltersData } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import Icon from "$components/helpers/Icon.svelte";
    import Typeahead from "$components/TypeaheadLocal.svelte";
    import { selectAll, select } from 'd3-selection';
    import { median } from 'd3-array';

    const totalMedianPrice = median(rawData, d => d.price);
    const totalMedianRating = median(rawData, d => d.rating);
    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "none" && d.topgroup !== "human");

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
    let foundWine;

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
        selectedYearRangeSTORE
    ) {
        const hasAnimalFilter = selectedAnimalSTORE.length > 0;
        const hasTypeFilter = selectedTypeSTORE.length > 0;
        const hasCountryFilter = selectedCountrySTORE.length > 0;

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
            if (d.price > $stealPriceNum || d.rating < $stealRatingNum) {
                return false;
            }
            return true;
        });

        withFiltersData.set(filteredData);

        let stealsPercentLOCAL = $withFiltersData.length/$bigScatterData.length *100;

        stealPercent.set(stealsPercentLOCAL);
    }

    function updateSearchedWine(detail) {
        selectAll("#scatterplot .selected-wine")
            .transition()
            .duration(300)
            .attr("r", 4) // Reset size
            .style("stroke", "none")
            .style("stroke-width", "0px")
            .style("fill", "#38425d")
            .style("opacity", 0.8);

        foundWine = filteredRawData.find(d => d.id === detail.original.value);

        if (foundWine) {
            lockedSelection.set(true);
            let wine = selectAll(`#scatterplot #circle-${foundWine.id}`)
            console.log(wine)
            wine
                .classed("selected-wine", true)
                .raise()
                .transition()
                .duration(500)
                .attr("r", 10)
                .style("fill", "#CFCABF")
                .style("opacity", 1);

            setTooltip(foundWine)
        }
    }

    function setTooltip(data) {
		tooltipData.set(data);
		tooltipType.set("bottle");
	}

    function mouseleaveCircle(point) {
        searchTerm = undefined;
		selectAll("#scatter-explore .selected-wine")
			.style("opacity", 0.8)

		selectAll(`#scatter-explore #circle-${point.id}`)
			.style("opacity", 0.8)
			.style("fill", function() {
				let fill =  (point.price <= 29.99 && point.rating >= 4) ? "#3E5C4B" : "#475171";
				return fill
			})
			.transition(500)
			.attr("r", 5)
	}

    $: if (!$lockedSelection && foundWine) {
		mouseleaveCircle(foundWine);
	}

    $: storeUpdates(selectedAnimal, "animal")
    $: storeUpdates(selectedType, "type")
    $: storeUpdates(selectedCountry, "country")
    $: storeUpdates(searchedWine, "wine")
    $: updateScatterData($selectedAnimalSTORE, $selectedTypeSTORE, $selectedCountrySTORE, $stealPriceNum, $stealRatingNum);
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
                            events = [...events, { event: "select", detail }]
                        }}
                        on:clear={() => (events = [...events, { event: "clear" }])}
                    />
                    {#if searchTerm}
                        <button class="clear-btn" on:click={() => searchTerm = ''}>
                            <Icon name="x" size={"0.75rem"}/>
                        </button>
                    {/if}
                </div>
            </div>
            <p class="steals-sentence">
            <span class="bold highlight">{$stealPercent !== undefined ? $stealPercent.toFixed(2) : $stealPercent}% of wines are good deals</span> 
            with your current selections.
        </p>
        </div>
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
        flex-direction: row;
        align-items: flex-start;
        margin: 0 auto;
        position: absolute;
        top: 0;
        z-index: 1000;
        padding: 1rem;
    }

    .filters-inner {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .steals-sentence {
        width: 100%;
        padding: 0;
        text-align: center;
        font-size: var(--18px);
    }

    .select-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 1rem;
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