<script>
    import {
        falseWinesList,
		wineSet
	} from "$stores/misc.js";
    import { onMount } from "svelte";
    import Select from "$components/helpers/Select.svelte";
	import data from "$data/withGPTData.csv";
    import { select, csvFormat } from "d3";
    const animals = data.filter(d => d.gptAnimal !== "none" && d.gptAnimal !== "");
    const noAnimals = data.filter(d => d.gptAnimal == "none");
    let options = ["animals/humans", "no animals"];
    let highlight = false;
    let csvElement;
    $: disabled = $falseWinesList.length > 0 ? false : true;

    onMount(() => {
        csvElement = document.createElement("a")
    })

    function logWine() {
        let id = this.parentElement.id.split("-")[1];
        let animalName = this.children[0].value;
        this.parentElement.classList.toggle('highlight');

        if (this.parentElement.classList.contains("highlight")) {
            falseWinesList.set([...$falseWinesList, { id, animalName }]);
        } else {
            const indexOfObject = $falseWinesList.findIndex(object => { return object.id == id })
            $falseWinesList.splice(indexOfObject, 1);
            falseWinesList.set($falseWinesList);
        }
        console.log($falseWinesList)
    }

    function saveWines() {
        const data = $falseWinesList;
        if (data.length > 0) {
            const concatData = [].concat(...data).map(d => ({
                id: d.id,
                animalName: d.animalName
            }));
            const csv = csvFormat(concatData)
            const csvBlob = new Blob([csv]);
            const blobUrl = URL.createObjectURL(csvBlob);
            let setType = $wineSet == "animals/humans" ? "animals-humans" : "no-animals";
            csvElement.href = blobUrl;
            csvElement.download = `${setType}_false-wines.csv`;

            csvElement.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );
        } 
    }
    $: console.log($falseWinesList);
</script>

<div class="wrapper">
    <div class="controls">
        <Select options={options}/>
        <button disabled='{disabled}' on:click={saveWines}>Save wines</button>
    </div>
    <div class="stats">
        {#if $wineSet == "animals/humans"}
            <p><strong>Animals/humans:</strong> {animals.length}</p>
            <p><strong>Flagged:</strong> {$falseWinesList.length}</p>
            <p><strong>Flagged %:</strong> {($falseWinesList.length/animals.length*100).toFixed(2)}%</p>
        {:else}
            <p><strong>Non-animals:</strong> {noAnimals.length}</p>
            <p><strong>Flagged:</strong> {$falseWinesList.length}</p>
            <p><strong>Flagged %:</strong> {$falseWinesList.length}</p>
        {/if}
    </div>
</div>
<section>
    {#if $wineSet == "animals/humans" || $wineSet == undefined }
        {#each animals as wine,i}
            <div id="wine-{wine.id}" class="wine-wrapper"> 
                <img class:highlight class="wine-img" src="assets/images/img_{wine.id}.png" />
                <p>{wine.id}</p>
                <form on:submit|preventDefault={logWine}>
                    <input value="{wine.gptAnimal}" />
                </form>
            </div>
        {/each}
    {:else}
        {#each noAnimals as wine,i}
            <div id="wine-{wine.id}" class="wine-wrapper"> 
                <img class:highlight class="wine-img" src="assets/images/img_{wine.id}.png" />
                <p>{wine.id}</p><form on:submit|preventDefault={logWine}>
                    <input value="{wine.gptAnimal}" />
                </form>
            </div>
        {/each}
    {/if}
</section>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
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
