<script>
    import MultiSelect from 'svelte-multiselect';
    import DoubleRange from "$components/helpers/DoubleRange.svelte";
    import { bigScatterData, selectedAnimalSTORE, selectedTypeSTORE, selectedCountrySTORE, selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE } from "$stores/misc.js";
    import rawData from "$data/wineData.csv"
    import * as d3 from 'd3';

    const filteredRawData = rawData.filter(d => d.price <= 100 && d.topgroup !== "none");

    const topgroups = ["amphibian/reptile", "bat", "bear", "bird", "canine", "cat", "cattle/camelus",
        "deer-like", "fish-like", "horse", "human", "insect",
        "marine invertebrate", "marsupial", "monkey", "mustelid-like/rodent-like", "mythical", "pachyderm",
        "rabbit", "ram-like", "suid"
    ];
    const wineType = ["Dessert", "Fortified", "Red", "Rose", "Sparkling", "White"];
    const wineCountry = ["Argentina", "Australia", "Austria", "Chile", "France", "Georgia", "Germany",
        "Hungary", "Italy", "New Zealand", "North Macedonia", "Portugal", "Romania", "South Africa",
        "Spain", "Switzerland", "United States", "Uruguay"
    ];

    let selectedAnimal = [];
    let selectedType = [];
    let selectedCountry = [];

    function storeUpdates(selectedGroup, valType) {
        if (valType == "animal") {
            selectedAnimalSTORE.set(selectedGroup)
        } else if (valType == "type") {
            selectedTypeSTORE.set(selectedGroup)
        } else {
            selectedCountrySTORE.set(selectedGroup)
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

    $: storeUpdates(selectedAnimal, "animal")
    $: storeUpdates(selectedType, "type")
    $: storeUpdates(selectedCountry, "country")
    $: updateScatterData($selectedAnimalSTORE, $selectedTypeSTORE, $selectedCountrySTORE, $selectedPriceRangeSTORE, $selectedRatingRangeSTORE, $selectedYearRangeSTORE);

    function findSteals(data) {
        let avgPrice = d3.mean(filteredRawData, d => d.price);
        let avgRating = d3.mean(filteredRawData, d => d.rating);
        let steals = data.filter(d => d.price <= avgPrice && d.rating >= avgRating).length;

        return steals
    }

    $: belowPriceAboveRating = findSteals($bigScatterData)
</script>

<p>Now showing {$bigScatterData.length} total wines. {belowPriceAboveRating} ({Math.round(belowPriceAboveRating/$bigScatterData.length*100)}%) have below avg. price and above avg. rating</p>
<div id="filters">
    <div class="select-wrapper">
        <div class="filter">
            <MultiSelect 
                bind:selected={selectedAnimal}
                options={topgroups} 
                valType = "animal"
                placeholder="All animals"
                removeAllTitle="Remove all animals"
            /> 
        </div>
        <div class="filter">
            <MultiSelect 
                bind:selected={selectedType}
                options={wineType} 
                valType = "type"
                placeholder="All types"
                removeAllTitle="Remove all types"
            /> 
        </div>
        <div class="filter">
            <MultiSelect 
                bind:selected={selectedCountry}
                options={wineCountry} 
                valType = "country"
                placeholder="All countries"
                removeAllTitle="Remove all countries"
            /> 
        </div>
    </div>
    <div class="range-wrapper">
        <div class="filter">
            <label>Price</label>
            <DoubleRange start={3} end={100} min={3} max={100} valType={"price"}/>
        </div>
        <div class="filter">
            <label>Rating</label>
            <DoubleRange start={2.5} end={5} min={2.5} max={5} valType={"rating"}/>
        </div>
        <div class="filter">
            <label>Year</label>
            <DoubleRange start={1850} end={2023} min={1850} max={2023} valType={"years"}/>
        </div>
    </div>
</div>

<style>
    p {
        color: white;
        max-width: 800px;
        margin: 1rem auto;
        font-family: var(--sans);
        font-weight: 700;
        font-size: var(--18px);
    }
    #filters {
        display: flex;
        flex-direction: row;
        gap: 4rem;
        max-width: 800px;
        align-items: center;
        margin: 0 auto;
    }

    .select-wrapper, .range-wrapper {
        width: 50%;
        display: flex;
        flex-direction: column;
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
        color: white;
    }

    :global(#filters .multiselect) {
        background: white !important;
    }
</style>