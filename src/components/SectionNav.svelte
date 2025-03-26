<script>
    import { activeSection } from "$stores/misc.js";
    const sections = ["Finding the Deals", "About the Animals", "The Top Bottle", "Methods + Explore More"];

    function handleSectionClick(section) {
        activeSection.set(section);
    }

    // $:console.log($activeSection);
 </script>

<nav id="section-nav">
    {#each sections as section, i}
        <button
            class:active={section == $activeSection}
            on:click={() => handleSectionClick(section)}
        >
            {section}
        </button>
    {/each}
</nav>

<style>
    nav {
        width: 100%;
        overflow-x: hidden;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        overflow-x: hidden;
        min-height: 3rem;
        pointer-events: auto;
        cursor: pointer;
        z-index: 1000;
        background: rgba(24,26,31,0.98);
        border-bottom: 1px solid var(--wine-dark-gray);
    }

    button {
        width: 100%;
        background: transparent;
        color: var(--wine-dark-tan);
        text-transform: uppercase;
        font-weight: 700;
        font-size: var(--14px);
        border-bottom: 2px solid var(--wine-black);
        border-radius: 0;
    }

    button.active {
        border-bottom: 2px solid var(--wine-red);
        pointer-events: none;
    }

    button:hover {
        border-bottom: 2px solid var(--wine-dark-tan);
    }
</style>