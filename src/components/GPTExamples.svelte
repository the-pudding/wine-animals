<script>
   import { fade } from 'svelte/transition';
   import Icon from "$components/helpers/Icon.svelte";
   import { useLazyImage as lazyImage } from 'svelte-lazy-image';

   export let exampleType;
   export let scrollIndex;

   const correctData = [
       {
           img: "3216207",
           text: "The image on the wine label features a <span class='correct-prompt'>duck</span>, which is an animal."
       },
       {
           img: "151590018",
           text: "There is an image of a <span class='correct-prompt'>bird</span> on this wine label, identified as a 'Gruccione' (<span class='correct-prompt'>European Bee-eater</span>..."
       },
       {
           img: "155725899",
           text: "The image on the wine label appears to depict a stylized <span class='correct-prompt'>peacock</span>..."
       },
       {
           img: "168501049",
           text: "...There is an illustration of a <span class='correct-prompt'>bird</span> in flight at the top of the label..."
       }
   ];

   const wrongData = [
       {
           img: "163091436",
           text: "There are <span class='wrong-prompt'>no animals or humans</span> on this wine label. The image prominently features a <span class='wrong-prompt'>hot air balloon</span>...'"
       },
       {
           img: "150722226",
           text: "...there are illustrations that resemble <span class='wrong-prompt'>demonic or mythical creatures</span> which are <span class='wrong-prompt'>neither real animals nor humans</span>."
       },
       {
           img: "176113705",
           text: "...appears to be a stylized, humanoid version of a <span class='wrong-prompt'>mythical creature often known as a 'chupacabra,'</span> and the other is an <span class='wrong-prompt'>anthropomorphic goat</span>... there are <span class='wrong-prompt'>no real animals or humans</span> present..."
       },
       {
           img: "167324613",
           text: "...The label features some illustrations that resemble <span class='wrong-prompt'>insects</span> around the edges, such as moths or butterflies. I <span class='wrong-prompt'>do not see any animals or humans</span> on this label."
       }
   ];
</script>

{#if exampleType == "correct"}
    <div class="example-wrapper">
        {#each correctData as example, i}
            {#if scrollIndex == 3}
            <div class="example" in:fade={{ duration: 250, delay: i * 250 }} out:fade={{duration: 250}}>
                <img src={`./assets/images/vivinoLabels/img_${example.img}.png`} alt="Wine label" use:lazyImage />
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
                <img src={`./assets/images/vivinoLabels/img_${example.img}.png`} alt="Wine label" use:lazyImage />
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
        height: auto;
        max-height: 80svh;
        max-width: 1200px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 2rem;
        margin: 4rem auto auto auto;
        padding: 2rem;
        flex-wrap: nowrap;
    }

    .example {
        width: 25%;
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

    @media(max-width:700px) {
        .example-wrapper {
            flex-wrap: wrap;
        }

        .example {
            width: calc(50% - 2rem);
            max-width: 160px;
        }

        .example:nth-child(2) {
            clear: left; /* Forces a new row every 3 items */
        }

        .example p {
            font-size: 10px;
        }
    }
</style>