<script>
    import { get } from 'svelte/store';
    import MultiSelect from 'svelte-multiselect';
    import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, searchedWineSTORE, tooltipType, tooltipData, lockedSelection, stealPercent, stealPriceNum, stealRatingNum, withFiltersData, tooltipVisible } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import Icon from "$components/helpers/Icon.svelte";
    import Typeahead from "$components/TypeaheadLocal.svelte";
    import { selectAll, select } from 'd3-selection';
    import { format } from 'd3-format';
    import { median } from 'd3-array';

    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "none" && d.topgroup !== "human");
    const formatter = format(",");

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
        stealPriceNum,
        stealRatingNum
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
            if (d.price > stealPriceNum || d.rating < stealRatingNum) {
                return false;
            }
            return true;
        });

        withFiltersData.set(filteredData);

        let stealsPercentLOCAL = $withFiltersData.length/$bigScatterData.length *100;

        stealPercent.set(stealsPercentLOCAL);
    }

    $: if (!$lockedSelection && foundWine) {
		resetCircle(foundWine)
	}

    function updateSearchedWine(detail) {
        if (!detail || !detail.original || !detail.original.value) return;

        const wineId = detail.original.value;
        foundWine = rawData.find(d => d.id === wineId);
        if (!foundWine) return;

        lockedSelection.set(true);

        // Wait until the element is in the DOM
        const wine = select(`#scatterplot #circle-${wineId}`);
        if (wine.empty()) { return; }

        const parent = select(wine.node().parentNode);

        selectAll(".selected-circle").style("opacity", 0.5);

        wine
            .classed("selected-wine", true)
            .classed("filteredOut", false)
            .transition()
            .duration(500)
            .attr("r", 10)
            .style("fill", "#CFCABF")
            .style("opacity", 1);

        parent
            .raise()
            .classed("filteredOut", false)
            .style("opacity", 1);

        if (get(tooltipData)?.id !== foundWine.id) {
            tooltipVisible.set(true);
            tooltipData.set(foundWine);
            tooltipType.set("bottle");
        }
    }

    function resetCircle(wine) {
        const circle = select(`#scatterplot #circle-${wine.id}`);
        if (!circle.empty()) {
            circle
                .classed("selected-wine", false)
                .transition()
                .duration(500)
                .attr("r", 5)
                .style("fill", () =>
                    wine.price <= 29.99 && wine.rating >= 4 ? "#3E5C4B" : "#475171"
                )
                .style("opacity", 0.8);
        }
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
                            <Icon name="chevrons-up-down" size={"12px"} rotation={0}/>
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
                            <Icon name="chevrons-up-down" size={"12px"} rotation={0}/>
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
                            <Icon name="chevrons-up-down" size={"12px"} rotation={0}/>
                        </span>
                    </MultiSelect>
                </div>
                <div class="search-wrapper">
                    <Typeahead
                        bind:value={searchTerm}
                        hideLabel
                        label="U.S. States"
                        placeholder={`Find a wine`}
                        data={availableWines}
                        limit={4}
                        extract={(item) => item.label}
                        on:select={({ detail }) => {
                            updateSearchedWine(detail); // ✅ It lives in this scope now
                          }}
                          on:clear={() => {
                            if (foundWine) {
                              resetCircle(foundWine);
                            }
                        
                            tooltipVisible.set(false);
                            tooltipData.set(null);
                            lockedSelection.set(false);
                          }}
                    />
                    {#if searchTerm}
                        <button class="clear-btn" on:click={() => searchTerm = ''}>
                            <Icon name="x" size={"12px"} rotation={0}/>
                        </button>
                    {/if}
                </div>
            </div>
            <p class="steals-sentence">
                <span class="bold">
                {#if $withFiltersData.length !== 1}
                    {formatter($withFiltersData.length)} wines
                {:else}
                    {formatter($withFiltersData.length)} wine
                {/if}
                </span>
            or <span class="bold highlight">{$stealPercent !== undefined ? $stealPercent.toFixed(2) : $stealPercent}% are good deals</span> 
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
        width: calc(25% - 0.5rem);
    }

    .search-wrapper {
        width: calc(25% - 0.5rem);
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

    @media(max-width: 700px) {
        .select-wrapper {
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .filter, .search-wrapper {
            width: calc(50% - 0.25rem);
        }

        :global(#filters .multiselect) {
            font-size: var(--14px) !important;
        }

        :global([data-svelte-typeahead] input) {
            font-size: var(--14px) !important;
        }

        .steals-sentence {
            font-size: var(--14px);
        }
    }
</style>