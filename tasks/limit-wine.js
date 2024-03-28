import fs from "fs";
import * as d3 from "d3";
const raw = fs.readFileSync("./src/data/wine-animals.csv", "utf8");
const data = d3.csvParse(raw);
const dataByWinery = d3.groups(data, d => d.winery);
let limitedData = [];

function limitWines(winery, i) {
    const numWines = winery[1].length;
    if (numWines > 1) {
        const wineryByType = d3.groups(winery[1], d => d.type)
        limitedData.push(wineryByType.map(limitType).flat());
    } else {
        limitedData.push(winery[1]);
    }
}

function limitType(wineType, i) {
    const numTypes = wineType[1].length;
    let wineMatch;
    if (numTypes > 1) {
        let maxRatings = d3.max(wineType[1], d => +d.numRatings);
        let minPrice = d3.min(wineType[1], d => +d.price);
        wineMatch = wineType[1].filter(d => +d.numRatings == maxRatings)
        if (wineMatch.length > 1) {
            wineMatch = wineMatch.filter(d => +d.price == minPrice);
        }
    } else {
        wineMatch = wineType[1]
    }
    return wineMatch
}

function init() {
    dataByWinery.slice(0,2).map(limitWines);
    console.log(limitedData);
}

init();