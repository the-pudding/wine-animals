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
const cats = ["cat", "cheetah", "cougar", "jaguar/leopard/panther", "lion plain", "lion crest", "lynx", "tiger"];

const birdData = data.filter(d => d.topgroup.includes("bird"));
const birds = ["bird of prey", "duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "shorebird", "songbird", "wading bird"]; 

const priceBuckets = ["<10", "10–19.99", "20–29.99", "30–39.99", "40–49.99", "50–59.99", "60–69.99", "70–79.99", "80–89.99", "90–99.99", "100+"];
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
    const price10_19 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[1]);
    const price20_29 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[2]);
    const price30_39 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[3]);
    const price40_49 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[4]);
    const price50_59 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[5]);
    const price60_69 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[6]);
    const price70_79 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[7]);
    const price80_89 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[8]);
    const price90_99 = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[9]);
    const price100above = filteredWines.filter(d => d.priceBucketOurs == priceBuckets[10]);

    const price10belowPercent = price10below.length/filteredWines.length*100;
    const price10_19Percent = price10_19.length/filteredWines.length*100;
    const price20_29Percent = price20_29.length/filteredWines.length*100;
    const price30_39Percent = price30_39.length/filteredWines.length*100;
    const price40_49Percent = price40_49.length/filteredWines.length*100;
    const price50_59Percent = price50_59.length/filteredWines.length*100;
    const price60_69Percent = price60_69.length/filteredWines.length*100;
    const price70_79Percent = price70_79.length/filteredWines.length*100;
    const price80_89Percent = price80_89.length/filteredWines.length*100;
    const price90_99Percent = price90_99.length/filteredWines.length*100;
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
        price10_19Count: price10_19.length, 
        price20_29Count: price20_29.length, 
        price30_39Count: price30_39.length, 
        price40_49Count: price40_49.length,
        price50_59Count: price50_59.length,
        price60_69Count: price60_69.length,
        price70_79Count: price70_79.length,
        price80_89Count: price80_89.length,
        price90_99Count: price90_99.length,
        price100aboveCount: price100above.length,
        price10belowPercent, 
        price10_19Percent, 
        price20_29Percent, 
        price30_39Percent, 
        price40_49Percent,
        price50_59Percent,
        price60_69Percent,
        price70_79Percent,
        price80_89Percent,
        price90_99Percent,
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
            { category: "price", bucket: "$10–19", percent: d.price10_19Percent, count: d.price10_19Count },
            { category: "price", bucket: "$20–29", percent: d.price20_29Percent, count: d.price20_29Count },
            { category: "price", bucket: "$30–39", percent: d.price30_39Percent, count: d.price30_39Count },
            { category: "price", bucket: "$40–49", percent: d.price40_49Percent, count: d.price40_49Count },
            { category: "price", bucket: "$50–59", percent: d.price50_59Percent, count: d.price50_59Count },
            { category: "price", bucket: "$60–69", percent: d.price60_69Percent, count: d.price60_69Count },
            { category: "price", bucket: "$70–79", percent: d.price70_79Percent, count: d.price70_79Count },
            { category: "price", bucket: "$80–89", percent: d.price80_89Percent, count: d.price80_89Count },
            { category: "price", bucket: "$90–99", percent: d.price90_99Percent, count: d.price90_99Count },
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
    let totalprice10_19 = d3.rollup(data, v => d3.sum(v, d => d.price10_19Count));
    let totalprice20_29 = d3.rollup(data, v => d3.sum(v, d => d.price20_29Count));
    let totalprice30_39 = d3.rollup(data, v => d3.sum(v, d => d.price30_39Count));
    let totalprice40_49 = d3.rollup(data, v => d3.sum(v, d => d.price40_49Count));
    let totalprice50_59 = d3.rollup(data, v => d3.sum(v, d => d.price50_59Count));
    let totalprice60_69 = d3.rollup(data, v => d3.sum(v, d => d.price60_69Count));
    let totalprice70_79 = d3.rollup(data, v => d3.sum(v, d => d.price70_79Count));
    let totalprice80_89 = d3.rollup(data, v => d3.sum(v, d => d.price80_89Count));
    let totalprice90_99 = d3.rollup(data, v => d3.sum(v, d => d.price90_99Count));
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
        price10_19Count: totalprice10_19,
        price20_29Count: totalprice20_29,
        price30_39Count: totalprice30_39,
        price40_49Count: totalprice40_49,
        price50_59Count: totalprice50_59,
        price60_69Count: totalprice60_69,
        price70_79Count: totalprice70_79,
        price80_89Count: totalprice80_89,
        price90_99Count: totalprice90_99,
        price100aboveCount: totalprice100above,

        price10belowPercent: totalprice10below/totalCount*100,
        price10_19Percent: totalprice10_19/totalCount*100,
        price20_29Percent: totalprice20_29/totalCount*100,
        price30_39Percent: totalprice30_39/totalCount*100,
        price40_49Percent: totalprice40_49/totalCount*100,
        price50_59Percent: totalprice50_59/totalCount*100,
        price60_69Percent: totalprice60_69/totalCount*100,
        price70_79Percent: totalprice70_79/totalCount*100,
        price80_89Percent: totalprice80_89/totalCount*100,
        price90_99Percent: totalprice90_99/totalCount*100,
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