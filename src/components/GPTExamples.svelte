<script>
   export let exampleType;

   const rightData = [
       {
           img: "3216207",
           text: "The image on the wine label features a <span class='bold'>duck</span>, which is an animal."
       },
       {
           img: "151590018",
           text: "There is an image of a <span class='bold'>bird</span> on this wine label, identified as a 'Gruccione' (<span class='bold'>European Bee-eater</span>, scientific name: Merops apiaster)."
       },
       {
           img: "155725899",
           text: "The image on the wine label appears to depict a stylized <span class='bold'>peacock</span>, which is an animal."
       },
       {
           img: "168501049",
           text: "The image shows a wine label. There is an illustration of a <span class='bold'>bird</span> in flight at the top of the label, which is an animal."
       },
       {
           img: "154534671",
           text: "There is an image of a <span class='bold'>bird, specifically a <span class='bold'>goose</span>, on the wine label."
       }
   ];

   const wrongData = [
       {
           img: "163091436",
           text: "There are no animals or humans on this wine label. The image prominently features a hot air balloon with the text 'Balance BEST BLEND Chenin Blanc Colombard south africa.'"
       },
       {
           img: "150722226",
           text: "The image is a wine label that reads 'Terrasse du Diable' and 'Les Pallières Gigondas.' To the left side of the label, there are illustrations that resemble demonic or mythical creatures which are neither real animals nor humans."
       },
       {
           img: "176113705",
           text: "The image depicts two animated characters on a wine label. One appears to be a stylized, humanoid version of a mythical creature often known as a 'chupacabra,' and the other is an anthropomorphic goat. Both characters are portrayed in a cartoonish style, and there are no real animals or humans present on the label."
       },
       {
           img: "167324613",
           text: "This appears to be an image of a wine label that reads 'Spook Light - Skin Fermented - Pinot Gris' from 'Hawke's Bay'. The label features some illustrations that resemble insects around the edges, such as moths or butterflies. I do not see any animals or humans on this label."
       },
       {
           img: "170789857",
           text: "This wine label features a branch which appears to have leaves and possibly grapes or some kind of fruit on it. There are no visible animals or humans on the label. "
       }
   ];
   
   $: data = exampleType == "right" ? rightData : wrongData;

</script>

<div class="example-wrapper">
    {#each data as example, i}
        <div class="example">
            <img src={`./assets/images/vivinoLabels/img_${example.img}.png`} alt="Wine label" />
            <p>{@html example.text}</p>
        </div>
    {/each}
</div>

<style>
        .example-wrapper {
        max-width: 1000px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.5rem;
        margin: 4rem auto;
    }

    .example {
        width: 20%;
    }

    .example img {
        width: 100%;
    }

    .example p {
        font-family: var(--sans);
        font-size: var(--16px);
        color: var(--wine-tan);
    }
</style>