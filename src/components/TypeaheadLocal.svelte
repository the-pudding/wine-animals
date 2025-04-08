<script>
    import fuzzy from "fuzzy";
    import Search from "svelte-search";
    import { tick, createEventDispatcher, afterUpdate } from "svelte";
    import { lockedSelection, tooltipData, tooltipType, tooltipVisible } from "$stores/misc.js";
    import rawData from "$data/wineData.csv";
    import { selectAll } from 'd3-selection'; 

    export let id = "typeahead-" + Math.random().toString(36);
    export let value = ""; // Ensure this is always a string
    export let selectHandler = null;
  
    /** @type {TItem[]} */
    export let data = [];
  
    /** @type {(item: TItem) => any} */
    export let extract = (item) => item;
    export let disable = (item) => false;
    export let filter = (item) => false;
    export let autoselect = true;
  
    /** @type {"update" | "clear" | "keep"} */
    export let inputAfterSelect = "update";
    export let focusAfterSelect = false;
    export let showDropdownOnFocus = false;
    export let showAllResultsOnFocus = false;
    export let limit = Infinity;
  
    const dispatch = createEventDispatcher();
    const filteredRawData = rawData.filter(d => d.price <= 150 && d.topgroup !== "none" && d.topgroup !== "human");
  
    let comboboxRef = null;
    let searchRef = null;
    let hideDropdown = false;
    let selectedIndex = -1;
    let prevResults = "";
    let isFocused = false;
    let foundWine;
  
    let localResults = [];

    $: safeValue = value ?? "";
  
    afterUpdate(() => {
      if (prevResults !== resultsId && autoselect) {
        selectedIndex = getNextNonDisabledIndex();
      }
  
      if (prevResults !== resultsId && !$$slots["no-results"]) {
        hideDropdown = localResults.length === 0;
      }
  
      prevResults = resultsId;
    });

    function setTooltip(data) {
        tooltipVisible.set(true);
		tooltipData.set(data);
		tooltipType.set("bottle");
	}

    function updateSearchedWine(detail) {
        if (!detail || !detail.original || !detail.original.value) {
            return;
        }

        selectAll(".selected-circle")
            .style("opacity", 0.5)

        foundWine = filteredRawData.find(d => d.id === detail.original.value);

        if (foundWine) {
            lockedSelection.set(true);
            const wine = selectAll(`#scatterplot #circle-${foundWine.id}`);
            const parent = selectAll(wine.parentNode);
            wine
                .classed("selected-wine", true)
                .classed("filteredOut", false)
                .raise()
                .transition()
                .duration(500)
                .attr("r", 10)
                .style("fill", "#CFCABF")
                .style("opacity", 1);
                
            parent
              .style("opacity", 1);

            setTooltip(foundWine);
        }
    }
  
    async function select() {
        const result = localResults[selectedIndex];
        if (!result || result.disabled) return;

        const selectedValue = extract(result.original);
        const searchedValue = value;

        if (inputAfterSelect === "clear") value = "";
        if (inputAfterSelect === "update") value = selectedValue;

        const payload = {
            selectedIndex,
            searched: searchedValue,
            selected: selectedValue,
            original: result.original,
            originalIndex: result.index,
        };

        dispatch("select", payload);

        await tick();
        updateSearchedWine(payload)
        if (focusAfterSelect) searchRef?.focus();
        close();
        }
  
    function getNextNonDisabledIndex() {
      if (!Array.isArray(localResults) || localResults.length === 0) return -1;
  
      let index = 0;
      let disabled = localResults[index]?.disabled ?? false;
  
      while (disabled && index < localResults.length) {
        index = (index + 1) % localResults.length;
        disabled = localResults[index]?.disabled ?? false;
      }
  
      return index;
    }
  
    function change(direction) {
      if (!Array.isArray(localResults) || localResults.length === 0) return;
  
      let index =
        direction === 1 && selectedIndex === localResults.length - 1
          ? 0
          : selectedIndex + direction;
  
      if (index < 0) index = localResults.length - 1;
  
      let disabled = localResults[index]?.disabled ?? false;
  
      while (disabled) {
        index = (index + direction + localResults.length) % localResults.length;
        disabled = localResults[index]?.disabled ?? false;
      }
  
      selectedIndex = index;
    }
  
    const open = () => (hideDropdown = false);
    const close = () => {
      hideDropdown = true;
      isFocused = false;
    };
  
    $: options = { pre: "<mark>", post: "</mark>", extract };
  
    $: {
        const search = safeValue; // Always fallback to empty string
  
      if (isFocused && showAllResultsOnFocus && search.length === 0) {
        localResults = Array.isArray(data)
          ? data
              .filter((datum) => !filter(datum))
              .map((original, index) => ({
                disabled: disable(original),
                index,
                original,
                score: 0,
                string: extract(original),
              }))
          : [];
      } else {
        localResults = Array.isArray(data)
          ? fuzzy
              .filter(search, data, options)
              .filter(({ score }) => score > 0)
              .slice(0, limit)
              .filter((result) => !filter(result.original))
              .map((result) => ({
                ...result,
                disabled: disable(result.original),
              }))
          : [];
      }
    }
  
    $: resultsId = localResults.map((r) => extract(r.original)).join("");
    $: showResults = !hideDropdown && localResults.length > 0;
    $: if (showDropdownOnFocus) {
      showResults = showResults && isFocused;
    }
  </script>
  

<svelte:window
  on:click={({ target }) => {
    if (!hideDropdown && !comboboxRef?.contains(target)) {
      close();
    }
  }}
/>

<div
  data-svelte-typeahead
  bind:this={comboboxRef}
  role="combobox"
  aria-haspopup="listbox"
  aria-controls="{id}-listbox"
  class:dropdown={localResults.length > 0}
  aria-expanded={showResults}
  id="{id}-typeahead"
>
  <Search
    {id}
    removeFormAriaAttributes={true}
    {...$$restProps}
    bind:ref={searchRef}
    aria-autocomplete="list"
    aria-controls="{id}-listbox"
    aria-labelledby="{id}-label"
    aria-activedescendant={selectedIndex >= 0 &&
    !hideDropdown &&
    localResults.length > 0
      ? `${id}-result-${selectedIndex}`
      : null}
    bind:value
    on:type
    on:input
    on:change
    on:focus
    on:focus={() => {
      open();
      if (showDropdownOnFocus || showAllResultsOnFocus) {
        showResults = true;
        isFocused = true;
      }
    }}
    on:clear
    on:clear={open}
    on:blur
    on:keydown
    on:keydown={(e) => {
      if (localResults.length === 0) return;

      switch (e.key) {
        case "Enter":
          select();
          break;
        case "ArrowDown":
          e.preventDefault();
          change(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          change(-1);
          break;
        case "Escape":
          e.preventDefault();
          value = "";
          searchRef?.focus();
          close();
          break;
      }
    }}
  />
  <ul
    class:svelte-typeahead-list={true}
    role="listbox"
    aria-labelledby="{id}-label"
    id="{id}-listbox"
  >
    {#if showResults}
      {#each localResults as result, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          role="option"
          id="{id}-result-{index}"
          class:selected={selectedIndex === index}
          class:disabled={result.disabled}
          aria-selected={selectedIndex === index}
          on:click={() => {
            if (result.disabled) return;
            selectedIndex = index;
            select();
          }}
          on:mouseenter={() => {
            if (result.disabled) return;
            selectedIndex = index;
          }}
        >
          <slot {result} {index} value={safeValue}>
            {@html result.string}
          </slot>
        </li>
      {/each}
    {/if}
    {#if $$slots["no-results"] && !hideDropdown && safeValue.length > 0 && localResults.length === 0}
    <div class:no-results={true}>
        <slot name="no-results" value={safeValue} />
    </div>
    {/if}
  </ul>
</div>

<style>
  [data-svelte-typeahead] {
    position: relative;
    background-color: #fff;
  }

  ul {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: inherit;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  [aria-expanded="true"] ul {
    z-index: 1;
  }

  li,
  .no-results {
    padding: 0.25rem 1rem;
  }

  li {
    cursor: pointer;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }

  li:hover {
    background-color: #e5e5e5;
  }

  .selected {
    background-color: #e5e5e5;
  }

  .selected:hover {
    background-color: #cacaca;
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :global([data-svelte-search] label) {
    margin-bottom: 0.25rem;
    display: inline-flex;
    font-size: 0.875rem;
  }

  :global([data-svelte-search] input) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: none;
    font-size: 1rem;
    border: 0;
    border-radius: 0;
    border: 1px solid #e5e5e5;
  }

  :global([data-svelte-search] input:focus) {
    outline-color: #0f62fe;
    outline-offset: 2px;
    outline-width: 1px;
  }

  @media(max-width: 700px) {
      :global([data-svelte-search] input) {
        font-size: var(--14px) !important;
      }
  }
</style>
