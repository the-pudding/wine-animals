<script>
   import { fly, fade } from 'svelte/transition';
   import Icon from "$components/helpers/Icon.svelte";

   export let exampleType;
   export let scrollIndex;

   const correctData = [
       {
           img: "3216207",
           text: "The image on the wine label features a <span class='correct-prompt'>duck</span>, which is an animal."
       },
       {
           img: "151590018",
           text: "There is an image of a <span class='correct-prompt'>bird</span> on this wine label, identified as a 'Gruccione' (<span class='correct-prompt'>European Bee-eater</span>, scientific name: Merops apiaster)."
       },
       {
           img: "155725899",
           text: "The image on the wine label appears to depict a stylized <span class='correct-prompt'>peacock</span>, which is an animal."
       },
       {
           img: "168501049",
           text: "The image shows a wine label. There is an illustration of a <span class='correct-prompt'>bird</span> in flight at the top of the label, which is an animal."
       },
       {
           img: "154534671",
           text: "There is an image of a <span class='correct-prompt'>bird, specifically a <span class='correct-prompt'>goose</span>, on the wine label."
       }
   ];

   const wrongData = [
       {
           img: "163091436",
           text: "There are <span class='wrong-prompt'>no animals or humans</span> on this wine label. The image prominently features a <span class='wrong-prompt'>hot air balloon</span> with the text 'Balance BEST BLEND Chenin Blanc Colombard south africa.'"
       },
       {
           img: "150722226",
           text: "The image is a wine label that reads 'Terrasse du Diable' and 'Les Pallières Gigondas.' To the left side of the label, there are illustrations that resemble <span class='wrong-prompt'>demonic or mythical creatures</span> which are <span class='wrong-prompt'>neither real animals nor humans</span>."
       },
       {
           img: "176113705",
           text: "The image depicts two animated characters on a wine label. One appears to be a stylized, humanoid version of a <span class='wrong-prompt'>mythical creature often known as a 'chupacabra,'</span> and the other is an <span class='wrong-prompt'>anthropomorphic goat</span>. Both characters are portrayed in a cartoonish style, and there are <span class='wrong-prompt'>no real animals or humans</span> present on the label."
       },
       {
           img: "167324613",
           text: "This appears to be an image of a wine label that reads 'Spook Light - Skin Fermented - Pinot Gris' from 'Hawke's Bay'. The label features some illustrations that resemble <span class='wrong-prompt'>insects</span> around the edges, such as moths or butterflies. I <span class='wrong-prompt'>do not see any animals or humans</span> on this label."
       },
       {
           img: "170789857",
           text: "This wine label features a branch which appears to have leaves and  <span class='wrong-prompt'>possibly grapes or some kind of fruit</span> on it. There are <span class='wrong-prompt'>no visible animals or humans</span> on the label. "
       }
   ];
   
   $: data = exampleType == "correct" ? correctData : wrongData;

</script>

{#if exampleType == "correct"}
    <div class="example-wrapper">
        {#each correctData as example, i}
            {#if scrollIndex == 3}
            <div class="example" in:fade={{ duration: 250, delay: i * 250 }} out:fade={{duration: 250}}>
                <img src={`./assets/images/vivinoLabels/img_${example.img}.png`} alt="Wine label" />
                <div class="correct-icon">
                    <Icon name="check" size={"1.5rem"}/>
                </div>
                <p>
                    {@html example.text}
                </p>
            </div>
            {/if}
        {/each}
    </div>
{:else}
    <div class="example-wrapper">
        {#each wrongData as example, i}
            {#if scrollIndex == 4}
            <div class="example" in:fade={{ duration: 250, delay: i * 250 }} out:fade={{duration: 250}}>
                <img src={`./assets/images/vivinoLabels/img_${example.img}.png`} alt="Wine label" />
                <div class="wrong-icon">
                    <Icon name="x" size={"1.5rem"}/>
                </div>
                <p>
                    {@html example.text}
                </p>
            </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    .example-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        max-height: 80svh;
        max-width: 1200px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 2rem;
        margin: 20svh auto auto auto;
    }

    .example {
        width: 20%;
        max-width: 170px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .example img {
        width: 100%;
        aspect-ratio: 1 / 1.5;
        object-fit: cover;
        border: 1px solid var(--wine-dark-gray);
    }

    .example p {
        font-family: var(--mono);
        font-size: var(--12px);
        color: var(--wine-tan);
    }

    .correct-icon, .wrong-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: inline-block;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--wine-tan);
        margin-top: -1.25rem;
    }

    .correct-icon {
        background: var(--wine-green);
    }

    .wrong-icon {
        background: var(--wine-red);
    }

    :global(.correct-icon span, .wrong-icon span) {
        margin-top: 0.25rem;
    }

    :global(.correct-prompt) {
        font-weight: 700;
        border-bottom: 2px solid var(--wine-green);
    }

    :global(.wrong-prompt) {
        font-weight: 700;
        border-bottom: 2px solid var(--wine-red);
    }
</style>