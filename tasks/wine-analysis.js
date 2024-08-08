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
const birds = ["bird of prey", "duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "shorebird", "songbird", "wading bird"]; 

const priceBuckets = ["<=10", "10.01–15", "15.01–20", "20.01–25", "25.01–30", "30.01–35", "35.01–40", "40.01–60", "60.01–80", "80.01–100", ">100"];
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
    const price10below = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[0]);
    const price10_15 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[1]);
    const price15_20 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[2]);
    const price20_25 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[3]);
    const price25_30 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[4]);
    const price30_35 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[5]);
    const price35_40 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[6]);
    const price40_60 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[7]);
    const price60_80 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[8]);
    const price80_100 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[9]);
    const price100above = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[10]);

    const price10belowPercent = price10below.length/filteredWines.length*100;
    const price10_15Percent = price10_15.length/filteredWines.length*100;
    const price15_20Percent = price15_20.length/filteredWines.length*100;
    const price20_25Percent = price20_25.length/filteredWines.length*100;
    const price25_30Percent = price25_30.length/filteredWines.length*100;
    const price30_35Percent = price30_35.length/filteredWines.length*100;
    const price35_40Percent = price35_40.length/filteredWines.length*100;
    const price40_60Percent = price40_60.length/filteredWines.length*100;
    const price60_80Percent = price60_80.length/filteredWines.length*100;
    const price80_100Percent = price80_100.length/filteredWines.length*100;
    const price100abovePercent = price100above.length/filteredWines.length*100;

    // RATING
    const rating3below = filteredWines.filter(d => d.ratingBucket == ratingBuckets[0]);
    const rating3_35 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[1]);
    const rating35_4 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[2]);
    const rating4_45 = filteredWines.filter(d => d.ratingBucket == ratingBuckets[3]);
    const rating45above = filteredWines.filter(d => d.ratingBucket == ratingBuckets[4]);

    const rating3belowPercent = rating3below.length/filteredWines.length*100;
    const rating3_35Percent = rating3_35.length/filteredWines.length*100;
    const rating35_4Percent = rating35_4.length/filteredWines.length*100;
    const rating4_45Percent = rating4_45.length/filteredWines.length*100;
    const rating45abovePercent = rating45above.length/filteredWines.length*100;

    const toPush = {animalGroup, 
        count: filteredWines.length, 
        price10belowCount: price10below.length, 
        price10_15Count: price10_15.length, 
        price15_20Count: price15_20.length, 
        price20_25Count: price20_25.length, 
        price25_30Count: price25_30.length,
        price30_35Count: price30_35.length,
        price35_40Count: price35_40.length,
        price40_60Count: price40_60.length,
        price60_80Count: price60_80.length,
        price80_100Count: price80_100.length,
        price100aboveCount: price100above.length,
        price10belowPercent, 
        price10_15Percent, 
        price15_20Percent, 
        price20_25Percent, 
        price25_30Percent,
        price30_35Percent,
        price35_40Percent,
        price40_60Percent,
        price25_30Percent,
        price60_80Percent,
        price80_100Percent,
        price100abovePercent,
        rating3belowCount: rating3below.length, 
        rating3_35Count: rating3_35.length, 
        rating35_4Count: rating35_4.length,
        rating4_45Count: rating4_45.length, 
        rating45aboveCount: rating45above.length, 
        rating3belowPercent,
        rating3_35Percent, 
        rating35_4Percent, 
        rating4_45Percent, 
        rating45abovePercent
    };

    if (metric == "all") {
        summary.push(toPush);
    } else if (metric == "cat") {
        catSummary.push(toPush);
    } else if (metric == "bird") {
        birdSummary.push(toPush);
    }
}

function formatCSV(data, metric) {
    data.forEach(d => {
        const animalGroup = d.animalGroup;
        const bucketData = [
            { category: "price", bucket: "$10 below", percent: d.price10belowPercent, count: d.price10belowCount },
            { category: "price", bucket: "$10–15", percent: d.price10_15Percent, count: d.price10_15Count },
            { category: "price", bucket: "$15–20", percent: d.price15_20Percent, count: d.price15_20Count },
            { category: "price", bucket: "$20–25", percent: d.price20_25Percent, count: d.price20_25Count },
            { category: "price", bucket: "$25–30", percent: d.price25_30Percent, count: d.price25_30Count },
            { category: "price", bucket: "$30–35", percent: d.price30_35Percent, count: d.price30_35Count },
            { category: "price", bucket: "$35–40", percent: d.price35_40Percent, count: d.price35_40Count },
            { category: "price", bucket: "$40–60", percent: d.price40_60Percent, count: d.price40_60Count },
            { category: "price", bucket: "$60–80", percent: d.price60_80Percent, count: d.price60_80Count },
            { category: "price", bucket: "$80–100", percent: d.price80_100Percent, count: d.price80_100Count },
            { category: "price", bucket: "$100+", percent: d.price100abovePercent, count: d.price100aboveCount },
            { category: "rating", bucket: "rating3below", percent: d.rating3belowPercent, count: d.rating3belowCount },
            { category: "rating", bucket: "rating3_35", percent: d.rating3_35Percent, count: d.rating3_35Count },
            { category: "rating", bucket: "rating35_4", percent: d.rating35_4Percent, count: d.rating35_4Count },
            { category: "rating", bucket: "rating4_45", percent: d.rating4_45Percent, count: d.rating4_45Count },
            { category: "rating", bucket: "rating45above", percent: d.rating45abovePercent, count: d.rating45aboveCount },
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

function addTotalCounts(data, metric) {
    let totalCount = d3.rollup(data, v => d3.sum(v, d => d.count));
    let totalprice10below = d3.rollup(data, v => d3.sum(v, d => d.price10belowCount));
    let totalprice10_15 = d3.rollup(data, v => d3.sum(v, d => d.price10_15Count));
    let totalprice15_20 = d3.rollup(data, v => d3.sum(v, d => d.price15_20Count));
    let totalprice20_25 = d3.rollup(data, v => d3.sum(v, d => d.price20_25Count));
    let totalprice25_30 = d3.rollup(data, v => d3.sum(v, d => d.price25_30Count));
    let totalprice30_35 = d3.rollup(data, v => d3.sum(v, d => d.price30_35Count));
    let totalprice35_40 = d3.rollup(data, v => d3.sum(v, d => d.price35_40Count));
    let totalprice40_60 = d3.rollup(data, v => d3.sum(v, d => d.price40_60Count));
    let totalprice60_80 = d3.rollup(data, v => d3.sum(v, d => d.price60_80Count));
    let totalprice80_100 = d3.rollup(data, v => d3.sum(v, d => d.price80_100Count));
    let totalprice100above = d3.rollup(data, v => d3.sum(v, d => d.price100aboveCount));
    let total3below = d3.rollup(data, v => d3.sum(v, d => d.rating3belowCount));
    let total3_35 = d3.rollup(data, v => d3.sum(v, d => d.rating3_35Count));
    let total35_4 = d3.rollup(data, v => d3.sum(v, d => d.rating35_4Count));
    let total4_45 = d3.rollup(data, v => d3.sum(v, d => d.rating4_45Count));
    let total45above = d3.rollup(data, v => d3.sum(v, d => d.rating45aboveCount));
    let animalGroup = metric == "all" 
        ? "all"
        : metric == "cats"
        ? "allCats"
        : "allBirds";

    let allObject = {
        animalGroup: animalGroup,
        count: totalCount,
        price10belowCount: totalprice10below,
        price10_15Count: totalprice10_15,
        price15_20Count: totalprice15_20,
        price20_25Count: totalprice20_25,
        price25_30Count: totalprice25_30,
        price30_35Count: totalprice30_35,
        price35_40Count: totalprice35_40,
        price40_60Count: totalprice40_60,
        price60_80Count: totalprice60_80,
        price80_100Count: totalprice80_100,
        price100aboveCount: totalprice100above,

        price10belowPercent: totalprice10below/totalCount*100,
        price10_15Percent: totalprice10_15/totalCount*100,
        price15_20Percent: totalprice15_20/totalCount*100,
        price20_25Percent: totalprice20_25/totalCount*100,
        price25_30Percent: totalprice25_30/totalCount*100,
        price30_35Percent: totalprice30_35/totalCount*100,
        price35_40Percent: totalprice35_40/totalCount*100,
        price40_60Percent: totalprice40_60/totalCount*100,
        price60_80Percent: totalprice60_80/totalCount*100,
        price80_100Percent: totalprice80_100/totalCount*100,
        price100abovePercent: totalprice100above/totalCount*100,
       
        rating3belowCount: total3below,
        rating3_35Count: total3_35,
        rating35_4Count: total35_4,
        rating4_45Count: total4_45,
        rating45aboveCount: total45above,
        rating3belowPercent: total3below/totalCount*100,
        rating3_35Percent: total3_35/totalCount*100,
        rating35_4Percent: total35_4/totalCount*100,
        rating4_45Percent: total4_45/totalCount*100,
        rating45abovePercent: total45above/totalCount*100
    }

    if (metric == "all") { summary.push(allObject); }
    else if (metric == "cats") { catSummary.push(allObject); }
    else if (metric == "birds") { birdSummary.push(allObject); }
}

function init() {
    // SUMMARY
    topgroups.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"all", data, i) }
    );
    addTotalCounts(summary, "all");

    // CREATE FLAT DATA
    formatCSV(summary, "all");

    const concatSummaryData = [].concat(...flatSummary).map(d => ({ ...d }));
    const csvSummary = d3.csvFormat(concatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_summary.csv`, csvSummary);

    // CATS
    cats.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"cat", catData, i) }
    );
    addTotalCounts(catSummary, "cats");

    formatCSV(catSummary, "cats");

    const concatCatSummaryData = [].concat(...flatCatSummary).map(d => ({ ...d }));
    const csvCatSummary = d3.csvFormat(concatCatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_catSummary.csv`, csvCatSummary);

    // BIRDS
    birds.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"bird", birdData, i) }
    );
    addTotalCounts(birdSummary, "birds");

    formatCSV(birdSummary, "birds");

    const concatBirdSummaryData = [].concat(...flatBirdSummary).map(d => ({ ...d }));
    const csvBirdSummary = d3.csvFormat(concatBirdSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_birdSummary.csv`, csvBirdSummary);
}   
init();