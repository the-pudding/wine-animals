<script>
    // SVELTE
    import { getContext, onMount } from "svelte";
    import { cubicInOut } from 'svelte/easing';
    import { interpolateString } from 'd3-interpolate';

    // EXPORTS
    export let scrollIndex;

    //VARIABLES
    const copy = getContext("copy");
    const startD = `M0,0.2 C0.15,0 0.35,0.42 0.6,0.2 C0.85,0 1.05,0.42 1.2,0.2 L1.2,1 L0,1 Z`;
    const endD = `M0,0.3 C0.15,0.05 0.35,0.55 0.6,0.3 C0.85,0.05 1.05,0.55 1.2,0.3 L1.2,1 L0,1 Z`;

    let animationFrame;
    let pathEl;
    let direction = 1;
    let startTime;

    // INTERACTIVE FUNCTIONS
    function animateWave(timestamp) {
        if (!startTime) startTime = timestamp;
        const duration = 4000; // 4s forward, 4s back

        let progress = (timestamp - startTime) / duration;

        if (progress >= 1) {
            direction *= -1;
            startTime = timestamp;
            progress = 0;
        }

        const eased = cubicInOut(progress);
        const interp = interpolateString(direction === 1 ? startD : endD, direction === 1 ? endD : startD);
        const newD = interp(eased);
        pathEl.setAttribute('d', newD);

        animationFrame = requestAnimationFrame(animateWave);
    }

    function startWaveAnimation() {
        window.cancelAnimationFrame(animationFrame);
        startTime = null;
        animationFrame = window.requestAnimationFrame(animateWave);
    }

    // ONMOUNT FUNCTIONS
    onMount(() => {
        pathEl = document.querySelector("#wave-path");
            if (pathEl) {
                startWaveAnimation();
            } 
    })
</script>

<div class="headline-wrapper">
    <div class="head-container" class:hidden={scrollIndex == "exit"}>
        <h1 class:highlight={scrollIndex == 8}>The pour-igin<br> of species</h1>
        <h1 style="clip-path: url(#wave-clip)" aria-hidden="true" class:highlight={scrollIndex == 8}>The pour-igin<br> of species</h1>
    </div>
    <div class="byline" style="opacity: {scrollIndex == 8 ? 1 : 0}">
        <p class="strikethrough">By {copy.bylineFake}<span class="strike-line" class:animate={scrollIndex == 8 || scrollIndex == "exit"}></span></p>
        <p>By {@html copy.byline}</p>
    </div>
</div>
<svg width="0" height="0">
    <defs>
        <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
        <path 
            id="wave-path" 
            d="M0,0.2 C0.15,0 0.35,0.42 0.6,0.2 C0.85,0 1.05,0.42 1.2,0.2 L1.2,1 L0,1 Z" 
        />
        </clipPath>
    </defs>
</svg>

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
        z-index: 1;
    }
    
    .head-container {
        height: 50svh;
        pointer-events: none;
    }

    h1 {
        width: 100%;
        font-size: 260px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: "Manuka";
        text-transform: uppercase;
        color: var(--wine-dark-gray);
        line-height: 0.8;
        text-align: center;
        opacity: 0;
        transition: all var(--1000ms) linear;
        pointer-events: none;
    }

    h1:nth-child(2) {
        opacity: 0;
    }

    h1:nth-child(1).highlight {
        opacity: 1;
        color: var(--wine-tan);
        transition: all var(--1000ms) linear;
    }

    h1:nth-child(2).highlight {
        color: var(--wine-red);
        opacity: 1;
        transition: all var(--1000ms) linear;
        /* animation-play-state: running; */
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
        transition: opacity var(--500ms) ease-in;
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
        transition: width var(--500ms) ease-out var(--1000ms);
    }

    .strike-line.animate {
        width: 175px;
    }

    .hidden {
        opacity: 0;
        transition: all var(--500ms) ease-in;
    }

    @media(max-width: 1000px) {
        h1 {
            font-size: 200px;
        }
    }

    @media(max-width: 800px) {
        h1 {
            font-size: 160px;
        }
    }

    @media(max-width: 620px) {
        h1 {
            font-size: 120px;
        }
    }

    @media(max-width: 460px) {
        h1 {
            font-size: 80px;
        }
    }
</style>