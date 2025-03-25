<script>
    // SVELTE
    import { getContext } from "svelte";

    // LIBARIES
    import { fit, parent_style } from "@leveluptuts/svelte-fit";

    // EXPORTS
    export let scrollIndex;

    //VARIABLES
    const copy = getContext("copy");
</script>

<div class="headline-wrapper">
    <div class="head-container" style={parent_style} class:hidden={scrollIndex == "exit"}>
        <h1 class:highlight={scrollIndex == 8} use:fit={{min_size: 12, max_size:350 }}>The pour-igin<br> of species</h1>
        <h1 aria-hidden="true" class:highlight={scrollIndex == 8} use:fit={{min_size: 12, max_size:350 }}>The pour-igin<br> of species</h1>
    </div>
    <div class="byline" style="opacity: {scrollIndex == 8 ? 1 : 0}">
        <p class="strikethrough">By {copy.bylineFake}<span class="strike-line" class:animate={scrollIndex == 8 || scrollIndex == "exit"}></span></p>
        <p>By {@html copy.byline}</p>
    </div>
</div>

<style>
    .headline-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        max-height: 80svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2rem;
        margin: 4rem auto;
    }

    h1 {
        width: 100%;
        font-size: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: "Manuka";
        text-transform: uppercase;
        color: var(--wine-dark-gray);
        line-height: 0.8;
        text-align: center;
        opacity: 0.4;
        transition: all 1s linear;
    }

    h1:nth-child(2) {
        opacity: 0;
        animation: animate 8s ease-in-out infinite;
        animation-play-state: paused; 
    }

    h1:nth-child(1).highlight {
        opacity: 1;
        color: var(--wine-tan);
    }

    h1:nth-child(2).highlight {
        color: var(--wine-red);
        opacity: 1;
        animation-play-state: running;
    }

    @keyframes animate {
        0%, 100% {
            clip-path: path("M0,100 C150,0 350,250 600,100 C850,0 1050,250 1200,100 C1350,0 1550,250 1800,100 L1800,600 L0,600 Z");
        }
        50% {
            clip-path: path("M0,160 C150,40 350,340 600,160 C850,-20 1050,340 1200,160 C1350,40 1550,340 1800,160 L1800,600 L0,600 Z");
        }
    }

    .byline {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--wine-tan);
        font-family: var(--sans);
        padding-top: 4rem;
        transition: opacity 0.5s ease-in;
    }

    .byline p {
        font-size: var(--18px);
        margin: 0;
        padding: 0;
        position: relative;
    }

    :global(.byline p a) {
        color: var(--wine-tan);
    }

    :global(.byline p a:hover) {
        color: var(--wine-red);
    }

    .strike-line {
        position: absolute;
        top: 50%;
        left: -5%;
        border-top: 3px solid var(--wine-red);
        width: 0;
        transform: rotate(-1deg);
        transition: width 0.5s ease-out 1s;
    }

    .strike-line.animate {
        width: 175px;
    }

    .hidden {
        opacity: 0;
        transition: all 0.5s ease-in;
    }
</style>