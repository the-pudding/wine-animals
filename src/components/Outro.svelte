<script>
    import { getContext } from "svelte";
    const copy = getContext("copy");
    import ChevronRight from "lucide-svelte/icons/chevron-right";
	import SpinningBottle from "./SpinningBottle.svelte";
    import inView from "$actions/inView.js";

    let bottlesWidth = 0;
    let bottlesHeight = 0;
    let outroVisible = false;

    const wine = { animal: "fish", name: "Sauvignon Blanc", winery: "Mount Fishtail", country: "New Zealand", price: 15.99, bottleSlot: "center-lone", targetPos: "50%", startingPos: "-50%"};
</script>

<section id='outro'>
    <div id="closing">
        {#each copy.outro as graf, i}
            <p>{@html graf.value}</p>
        {/each}
        <div 
            class="bottle-wrapper" 
            bind:clientHeight={bottlesHeight} 
            bind:clientWidth={bottlesWidth}
            use:inView
            on:enter={() => outroVisible = true}
            on:exit={() => outroVisible = false}>
            <SpinningBottle 
                wineData={wine}
                scrollIndex={null}
                bottleIndex={4}
                containerDimensions={{bottlesWidth, bottlesHeight}}
                {outroVisible}
                bottlePosLeft={outroVisible
                    ? wine.targetPos 
                    : wine.startingPos} />
        </div>
    </div>
    <div id="methods">
        <h3>Methodology</h3>
        {#each copy.methodsA as graf, i}
            <p>{@html graf.value}</p>
        {/each}
        <div class="examples">
            <div class="change">
                <h5>Were rolled up</h5>
                <ul>
                    {#each copy.methodsExChange as example, i}
                        <li>
                            <span>{example.animal}</span>
                            <ChevronRight color={"#CFCABF"} strokeWidth={2} />
                            <span>{example.subgroup}</span>
                            <ChevronRight color={"#CFCABF"} strokeWidth={2} />
                            <span>{example.topgroup}</span>
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="same">
                <h5>Stayed the same</h5>
                <ul>
                    {#each copy.methodsExSame as example, i}
                        <li>
                            <span>{example.animal}</span>
                            <ChevronRight color={"#CFCABF"} strokeWidth={2} />
                            <span>{example.subgroup}</span>
                            <ChevronRight color={"#CFCABF"} strokeWidth={2} />
                            <span>{example.topgroup}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        {#each copy.methodsB as graf, i}
            <p>{@html graf.value}</p>
        {/each}
    </div>
</section>

<style>
    #outro {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--wine-tan);
        padding: 4rem 1rem 1rem 1rem;
        position: relative;
        z-index: 1000;
    }

    .bottle-wrapper {
        width: 100%;
        height: 80svh;
    }

    #methods, #closing {
        width: 100%;
        max-width: 720px;
    }

    #closing p {
        font-size: var(--18px);
        line-height: 1.65;
    }

    h3 {
        font-weight: 700;
        font-size: var(--20px);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    #methods p, li {
        font-family: var(--sans);
        font-size: var(--14px);
        line-height: 1.65;
    }

    li {
        padding: 0 0 0.5rem 0;
    }

    li:not(:last-of-type) {
        border-bottom: 1px solid var(--wine-med-gray);
    }

    :global(#methods li svg) {
        width: 18px;
        position: relative;
        top: 7px;
    }

    :global(#outro a, #methods a) {
        color: var(--wine-tan);
    }

    :global(#outro a:hover, #methods a:hover) {
        color: var(--wine-red);
    }

    .examples {
        display: flex;
        flex-direction: row;
        gap: 4rem;
        margin: 2rem 0rem 3rem 0rem;
    }

    .change, .same {
        min-width: 200px;
    }

    h5 {
        text-transform: uppercase;
        font-family: var(--sans);
        font-weight: 700;
        font-size: var(--16px);
        margin: 0;
    }

    :global(#methods span.code, #methods li span) {
        background: var(--wine-dark-tan);
        color: var(--wine-black);
        font-family: var(--mono);
        border-radius: 3px;
        padding: 0.125rem 0.25rem;
        font-size: var(--12px);
    }

    @media(max-width: 700px) {
        #closing p {
            font-size: var(--16px);
        }
    }

    @media(max-width: 600px) {
        .examples {
            flex-direction: column;
            gap: 2rem;
            margin: 2rem 0;
        }
    }
</style>