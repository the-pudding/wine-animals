import fs from "fs";
import * as d3 from "d3";
const raw = fs.readFileSync("./src/data/wineData.csv", "utf8");
const data = d3.csvParse(raw);
const OUT_PATH = "./src/data/";

const topgroups = ["amphibian/reptile", "bat", "bear", "bird", "camelus", "cat", "cattle",
   "deer-like", "dog", "elephant", "fish", "hippopotamus", "horse", "human", "insect",
   "marine invertebrate", "marsupial", "monkey", "mustelid-like", "mythical", "none",
   "rabbit", "ram-like", "rhino", "rodent-like", "suid", "whale/shark/dolphin"  
];

const catData = data.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle"));
const cats = ["cat", "cheetah", "cougar", "jaguar/leopard/panther", "lion", "lynx", "tiger"];

const birdData = data.filter(d => d.topgroup.includes("bird"));
const birds = ["bird of prey", "chicken", "duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "shorebird", "songbird", "wading bird"]; 

const priceBuckets = ["1. Value", "2. Popular", "3. Premium", "4. Luxury", "5. Icon"];
const ratingBuckets = ["3 & less", "3.1–3.5", "3.6–4", "4.1–4.5", "4.6 & above"];

let summary = [];
let catSummary = [];
let birdSummary = [];

let flatSummary = [];
let flatCatSummary = [];
let flatBirdSummary = [];

function summarizeWines(animalGroup, metric, data, i) {
    const filteredWines = metric == "cat"
        ? catData.filter(d => d.finalAnimal.includes(animalGroup))
        : metric == "bird"
        ? birdData.filter(d => d.subgroup.includes(animalGroup))
        : data.filter(d => d.topgroup.includes(animalGroup))

    // PRICE
    const valueWines = filteredWines.filter(d => d.priceBucketNarrow == priceBuckets[0]);
    const popularWines = filteredWines.filter(d => d.priceBucketNarrow == priceBuckets[1]);
    const premiumWines = filteredWines.filter(d => d.priceBucketNarrow == priceBuckets[2]);
    const luxuryWines = filteredWines.filter(d => d.priceBucketNarrow == priceBuckets[3]);
    const iconWines = filteredWines.filter(d => d.priceBucketNarrow == priceBuckets[4]);

    const valuePercent = valueWines.length/filteredWines.length*100;
    const popularPercent = popularWines.length/filteredWines.length*100;
    const premiumPercent = premiumWines.length/filteredWines.length*100;
    const luxuryPercent = luxuryWines.length/filteredWines.length*100;
    const iconPercent = iconWines.length/filteredWines.length*100;

    // RATING
    const wines3below = filteredWines.filter(d => d.ratingBucket == ratingBuckets[0]);
    const wines3_35 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[1]);
    const wines35_4 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[2]);
    const wines4_45 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[3]);
    const wines45above = filteredWines.filter(d => d.ratingBucket == ratingBuckets[4]);

    const wines3belowPercent = wines3below.length/filteredWines.length*100;
    const wines3_35Percent = wines3_35.length/filteredWines.length*100;
    const wines35_4Percent = wines35_4.length/filteredWines.length*100;
    const wines4_45Percent = wines4_45.length/filteredWines.length*100;
    const wines45abovePercent = wines45above.length/filteredWines.length*100;

    if (metric == "all") {
        summary.push({animalGroup, count: filteredWines.length, valueCount: valueWines.length, popularCount: popularWines.length, 
            premiumCount: premiumWines.length, luxuryCount: luxuryWines.length, iconCount: iconWines.length,
            valuePercent, popularPercent, premiumPercent, luxuryPercent, iconPercent,
            wines3belowCount: wines3below.length, wines3_35Count: wines3_35.length, wines35_4Count: wines35_4.length,
            wines4_45Count: wines4_45.length, wines45aboveCount: wines45above.length, wines3belowPercent,
            wines3_35Percent, wines35_4Percent, wines4_45Percent, wines45abovePercent
        });
    } else if (metric == "cat") {
        catSummary.push({animalGroup, count: filteredWines.length, valueCount: valueWines.length, popularCount: popularWines.length, 
            premiumCount: premiumWines.length, luxuryCount: luxuryWines.length, iconCount: iconWines.length,
            valuePercent, popularPercent, premiumPercent, luxuryPercent, iconPercent,
            wines3belowCount: wines3below.length, wines3_35Count: wines3_35.length, wines35_4Count: wines35_4.length,
            wines4_45Count: wines4_45.length, wines45aboveCount: wines45above.length, wines3belowPercent,
            wines3_35Percent, wines35_4Percent, wines4_45Percent, wines45abovePercent
        });
    } else if (metric == "bird") {
        birdSummary.push({animalGroup, count: filteredWines.length, valueCount: valueWines.length, popularCount: popularWines.length, 
            premiumCount: premiumWines.length, luxuryCount: luxuryWines.length, iconCount: iconWines.length,
            valuePercent, popularPercent, premiumPercent, luxuryPercent, iconPercent,
            wines3belowCount: wines3below.length, wines3_35Count: wines3_35.length, wines35_4Count: wines35_4.length,
            wines4_45Count: wines4_45.length, wines45aboveCount: wines45above.length, wines3belowPercent,
            wines3_35Percent, wines35_4Percent, wines4_45Percent, wines45abovePercent
        });
    }
}

function formatCSV(data, metric) {
    data.forEach(d => {
        const animalGroup = d.animalGroup;
        const bucketData = [
            { category: "price", bucket: "value", percent: d.valuePercent, count: d.valueCount },
            { category: "price", bucket: "popular", percent: d.popularPercent, count: d.popularCount },
            { category: "price", bucket: "premium", percent: d.premiumPercent, count: d.premiumCount },
            { category: "price", bucket: "luxury", percent: d.luxuryPercent, count: d.luxuryCount },
            { category: "price", bucket: "icon", percent: d.iconPercent, count: d.iconCount },
            { category: "rating", bucket: "wines3below", percent: d.wines3belowPercent, count: d.wines3belowCount },
            { category: "rating", bucket: "wines3_35", percent: d.wines3_35Percent, count: d.wines3_35Count },
            { category: "rating", bucket: "wines35_4", percent: d.wines35_4Percent, count: d.wines35_4Count },
            { category: "rating", bucket: "wines4_45", percent: d.wines4_45Percent, count: d.wines4_45Count },
            { category: "rating", bucket: "wines45above", percent: d.wines45abovePercent, count: d.wines45aboveCount },
        ];

        if (metric == "all") {
            bucketData.forEach(d => {
                flatSummary.push({
                    animalGroup: animalGroup,
                    category: d.category,
                    bucket: d.bucket,
                    percent: d.percent,
                    count: d.count
                });
            });
        } else if (metric == "cats") {
            bucketData.forEach(d => {
                flatCatSummary.push({
                    animalGroup: animalGroup,
                    category: d.category,
                    bucket: d.bucket,
                    percent: d.percent,
                    count: d.count
                });
            });
        } else if (metric == "birds") {
            bucketData.forEach(d => {
                flatBirdSummary.push({
                    animalGroup: animalGroup,
                    category: d.category,
                    bucket: d.bucket,
                    percent: d.percent,
                    count: d.count
                });
            });
        }
    })
}

function init() {
    // SUMMARY
    topgroups.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"all", data, i) }
    );

    formatCSV(summary, "all");

    const concatSummaryData = [].concat(...flatSummary).map(d => ({ ...d }));
    const csvSummary = d3.csvFormat(concatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_summary.csv`, csvSummary);

    // CATS
    cats.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"cat", catData, i) }
    );

    formatCSV(catSummary, "cats");

    const concatCatSummaryData = [].concat(...flatCatSummary).map(d => ({ ...d }));
    const csvCatSummary = d3.csvFormat(concatCatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_catSummary.csv`, csvCatSummary);

    // BIRDS
    birds.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"bird", birdData, i) }
    );

    formatCSV(birdSummary, "birds");

    const concatBirdSummaryData = [].concat(...flatBirdSummary).map(d => ({ ...d }));
    const csvBirdSummary = d3.csvFormat(concatBirdSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_birdSummary.csv`, csvBirdSummary);
}   
init();