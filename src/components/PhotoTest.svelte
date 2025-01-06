<script>
    import { photoSelect, favWinesList } from "$stores/misc.js";
    import { onMount } from "svelte";
    import Select from "$components/helpers/Select.svelte";
	import data from "$data/wineData.csv";
    import { select, csvFormat } from "d3";
    const animals = ["amphibian/reptile", "bear", "bird", "cat", "cattle/camelus",
		"deer-like", "dog", "fish-like", "horse", "human", "insect",
		"marine invertebrate", "mythical", "none", "pachyderm",
		"rabbit", "ram-like", "suid"
	];

    $: filteredData = $photoSelect !== "cat"
        ? data.filter(d => d.topgroup.includes($photoSelect))
        : data.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle"));

    let highlight = false;
    let csvElement;
    $: disabled = $favWinesList.length > 0 ? false : true;

    onMount(() => {
        csvElement = document.createElement("a")
    })

    function logWine() {
        let id = this.id.split("-")[1];
        this.classList.toggle('highlight');

        if (this.classList.contains("highlight")) {
            favWinesList.set([...$favWinesList, { id }]);
        } else {
            const indexOfObject = $favWinesList.findIndex(object => { return object.id == id })
            $favWinesList.splice(indexOfObject, 1);
            favWinesList.set($favWinesList);
        }
    }

    function saveWines() {
        console.log("save");
        const data = $favWinesList;
        if (data.length > 0) {
            const concatData = [].concat(...data).map(d => ({
                id: d.id
            }));
            const csv = csvFormat(concatData)
            const csvBlob = new Blob([csv]);
            const blobUrl = URL.createObjectURL(csvBlob);
            csvElement.href = blobUrl;
            csvElement.download = `fav-wines.csv`;

            csvElement.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );
        } 
    }
</script>

<section>
    <div class="wrapper">
        <Select options={animals} id={"id-photoSelect"}/>
        <button disabled='{disabled}' on:click={saveWines}>Save wines</button>
    </div>
    {#key filteredData}
        {#each filteredData as wine,i}
            <div on:click={logWine} id="wine-{wine.id}" class="wine-wrapper" class:highlight> 
                <img class="wine-img" src="https://{wine.imageUrl}" />
                <p>{wine.id}</p>
                <p>${wine.price}</p>
                <p>{wine.rating} stars</p>
            </div>
        {/each}
    {/key}
</section>

<style>
    section {
        border-top: 1px solid black;
        margin: 4rem 0 0 0;
    }
    .wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin: 0 0 3rem 0;
        position: sticky;
        top: 0;
        background: rgba(255,255,255,0.9);
        border: none;
        padding: 1rem;
    }
    .controls {
        display: flex;
        width: 100%;
        flex-direction: row; 
        justify-content: center;
        align-items: center;
        margin: 0 0 1rem 0;
    }
    .stats {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .stats p {
        margin: 0 1rem;
    }
    button {
        height: 50px;
        margin: 0 0 0 1rem;
    }
    section {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .wine-wrapper {
        width: 200px;
        height: auto;
        margin: 0.5rem;
        border: 2px solid white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
    }
    .wine-wrapper:hover{
        border: 2px solid var(--color-gray-200);
    }
    .wine-img {
        width: 200px;
    }
    p {
        font-family: var(--sans);
        margin: 0.25rem;
    }
    .highlight {
        border: 2px solid red;
    }
</style>
