<script>
    import { onMount } from "svelte";
    import { LayerCake, Svg, Html } from 'layercake';
    import ScatterSvg from "$components/layercake/Scatter.svg.svelte";
    import { animalSelect, bigScatterData } from "$stores/misc.js";
    import allWineData from "$data/wineData.csv"

    import AxisX from "$components/layercake/AxisX.svg.svelte";
    import AxisY from "$components/layercake/AxisY.svg.svelte";
    import * as d3 from "d3";
    import * as d3Regression from 'd3-regression';
    import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';

    export let data;

    const meanData = allWineData.filter(d => d.price <= 150);

    let topgroups = $animalSelect == "birds" 
        ? ["duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "raptor", "shorebird", "songbird", "wading bird"]
        : $animalSelect == "cats"
        ? ["cat", "cheetah", "cougar", "jaguar/leopard/panther", "lion", "lion crest", "lynx", "tiger"]
        : ["amphibian/reptile", "bear", "bird", "canine", "cat", "cattle/camelus",
                "deer-like", "fish-like", "horse", "human", "insect",
                "marine invertebrate", "mythical", "none", "pachyderm",
                "rabbit", "ram-like", "suid"
                ];

    function findMissingItem(array1, array2) {
        // Serialize objects to strings for comparison
        const stringify = obj => JSON.stringify(obj);

        // Create a frequency map based on serialized objects
        const combined = [...array1, ...array2];
        const frequencyMap = {};

        combined.forEach(item => {
            const key = stringify(item);
            frequencyMap[key] = (frequencyMap[key] || 0) + 1;
        });

        // Find the item with an odd frequency and parse it back into an object
        for (const key in frequencyMap) {
            if (frequencyMap[key] % 2 !== 0) {
                return JSON.parse(key); // Return the original object
            }
        }

        return null; // No missing item found
    }

    function filterData(animal) {

        let filteredData;
        if ($animalSelect == "birds") {
           filteredData = animal == "owl" 
           ? filteredData = data.filter(d => d.subgroup.includes(animal) && !d.subgroup.includes("junglefowl") && d.price<= 150)
           : filteredData = data.filter(d => d.subgroup.includes(animal) && d.price <= 150)
           let birdArray = data.filter(d => d.topgroup.includes("bird"));
        } else if ($animalSelect == "cats") {
            filteredData = data.filter(d => d.finalAnimal.includes(animal) && !d.topgroup.includes("cattle") && d.price <= 150)
        } else {
            filteredData = animal == "cat" 
            ? data.filter(d => d.topgroup.includes(animal) && !d.topgroup.includes("cattle") && d.price <= 150)
            : data.filter(d => d.topgroup.includes(animal) && d.price <= 150)
        }
        return filteredData;
    }

    const curve = d3.curveLinear;
    const yKey = 'price';
    const xKey = 'rating';
    const xKeyReg = d => +d.rating;
    const yKeyReg = d => +d.price;

    data.forEach(d => {
        d[xKey] = +d[xKey];
        d[yKey] = +d[yKey];
    });

    const r = 4;
    const padding = 10;
    const color = '#d0c8a8';

    const tweenOptions = {
		duration: 300,
		easing: eases.cubicInOut
	};

    // Regression Line
    const regression = d3Regression.regressionExp()
        .x(d => d.x)  // Accessor for x value
        .y(d => d.y); // Accessor for y value

    function calcSteepness(data, animal) {
        let sumSlopes = 0;
        data.forEach(point => {
            const [x, y] = point;
            const slope = data.a * data.b * Math.exp(data.b * x);
            sumSlopes += slope;
        });
        const averageSteepness = sumSlopes / data.length;
        return averageSteepness;
    }
</script>

<section id="scatter">
        {#each topgroups as animal, i}
            {@const animalData = filterData(animal)}
            {@const points = animalData.map(d => ({
                x: +d.rating,  // Convert price to a number
                y: +d.price  // Convert rating to a number
            }))}
            {@const trendLine = regression(points)}
            {@const steepness = calcSteepness(trendLine, animal)}
            {@const avgPrice = d3.mean(meanData, d => d.price)}
            {@const avgRating = d3.mean(meanData, d => d.rating)}
            {@const lowPriceGoodRating = animalData.filter(d => d.price < avgPrice && d.rating > avgRating).length}
            <div class="chart-wrapper">
                <h3>{animal}</h3>
                <p class="tot-count">{animalData.length} wines</p>
                <p class="tot-count">{Math.round(steepness)} avg. steepness</p>
                <p class="tot-count">{Math.round(lowPriceGoodRating/animalData.length*100)}% ({lowPriceGoodRating}/{animalData.length})</p>
                <div class="chart-container" id="scatterplot" style="pointer-events:none">
                        <LayerCake
                            padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
                            x={xKey}
                            y={yKey}
                            data={[animalData, trendLine]}
                            xDomain={[2, 5]}
                            yDomain={[0, 150]}
                        >
                            <Svg>
                                <AxisX 
                                    gridlines={true} 
                                    ticks={7}
                                />
                                <AxisY 
                                    gridlines={true} 
                                    ticks={3} />
                                <ScatterSvg {r} fill={color} />
                            </Svg>
                        </LayerCake>
                </div>
            </div>
        {/each}
</section>

<style>
    #scatter {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 5rem;
        background: var(--color-bg);
    }

    .chart-wrapper {
        width: 100%;
        width: 250px;
        max-width: 250px;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 2rem;
    }
    h3 {
        font-family: var(--sans);
        font-size: var(--14px);
        font-weight: 700;
        text-align: center;
        margin: 0;
    }

    .tot-count {
        font-family: var(--sans);
        font-size: var(--14px);
        text-align: center;
        margin: 0 0;
        font-size: 0.8rem;
    }

    .chart-container {
        width: 100%;
        height: 250px;
        overflow: hidden;
        padding-right: 3px;
    }
</style>