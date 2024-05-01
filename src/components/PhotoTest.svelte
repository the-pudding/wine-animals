<script>
    import { onMount } from "svelte";
	import data from "$data/withGPTData.csv";
    import { csvFormat } from "d3";
    const noAnimals = data.filter(d => d.gptAnimal == "none");
    let falseWines = [];
    let highlight = false;
    let csvElement;

    onMount(() => {
        csvElement = document.createElement("a")
    })

    function logWine() {
        let id = this.id.split("-")[1]
        this.classList.toggle('highlight');
        if (this.classList.contains("highlight")) {
            if (!falseWines.includes(id)) {
                falseWines.push(id)  
            }
        } else {
            if (falseWines.includes(id)) {
                const match = falseWines.indexOf(id);
                if (match > -1) {
                    falseWines.splice(match, 1)
                }
            }
        }
    }

    function saveWines() {
        const concatData = [].concat(...falseWines).map(d => ({
            id: d,
        }));
        const csv = csvFormat(concatData)
        const csvBlob = new Blob([csv]);
        const blobUrl = URL.createObjectURL(csvBlob);
        csvElement.href = blobUrl;
        csvElement.download = "false-wines.csv";

        csvElement.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );
    }
</script>

<div class="wrapper">
    <button on:click={saveWines}>Save wines</button>
</div>
<section>
    {#each noAnimals as wine,i}
    <div on:click={logWine} id="wine-{wine.id}"> 
        <img class:highlight class="wine-img" src="assets/images/img_{wine.id}.png" />
        <p>{wine.id}</p>
    </div>
    {/each}
</section>

<style>
    .wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 0 0 3rem 0;
        position: sticky;
        top: 0;
        background: rgba(255,255,255,0.9);
        border: none;
        padding: 1rem;
    }
    section {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    div {
        width: 200px;
        height: auto;
        margin: 0.5rem;
        border: 2px solid white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
