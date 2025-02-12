import fs from "fs";
import * as d3 from "d3";
const raw = fs.readFileSync("./src/data/wineData.csv", "utf8");
const data = d3.csvParse(raw);
const OUT_PATH = "./src/data/";

const topgroups = ["amphibian/reptile", "bear", "bird", "canine", "cat", "cattle/camelus",
   "deer-like", "fish-like", "horse", "human", "insect",
   "marine invertebrate", "mythical", "none", "pachyderm",
   "rabbit", "ram-like", "suid"
];

const catData = data.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle"));
const cats = ["cat", "cheetah", "cougar", "jaguar/leopard/panther", "lion", "lion crest", "lynx", "tiger"];

const birdData = data.filter(d => d.topgroup.includes("bird"));
const birds = ["duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "raptor", "shorebird", "songbird", "wading bird"]; 

const priceBuckets = ["<10", "10–19.99", "20–29.99", "30–39.99", "40–49.99", "50–59.99", "60–69.99", "70–79.99", "80–89.99", "90–99.99", "100+"];
const ratingBuckets = ["3 & less", "3.1–3.5", "3.6–4", "4.1–4.5", "4.6 & above"];
const wineTypeBuckets = ["Dessert", "Fortified", "Red", "Rose", "Sparkling", "White"]

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
    const price10below = filteredWines.filter(d => d.priceBucket == priceBuckets[0]);
    const price10_19 = filteredWines.filter(d => d.priceBucket == priceBuckets[1]);
    const price20_29 = filteredWines.filter(d => d.priceBucket == priceBuckets[2]);
    const price30_39 = filteredWines.filter(d => d.priceBucket == priceBuckets[3]);
    const price40_49 = filteredWines.filter(d => d.priceBucket == priceBuckets[4]);
    const price50_59 = filteredWines.filter(d => d.priceBucket == priceBuckets[5]);
    const price60_69 = filteredWines.filter(d => d.priceBucket == priceBuckets[6]);
    const price70_79 = filteredWines.filter(d => d.priceBucket == priceBuckets[7]);
    const price80_89 = filteredWines.filter(d => d.priceBucket == priceBuckets[8]);
    const price90_99 = filteredWines.filter(d => d.priceBucket == priceBuckets[9]);
    const price100above = filteredWines.filter(d => d.priceBucket == priceBuckets[10]);

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

    // WINE TYPE
    const typeDessert = filteredWines.filter(d => d.type == wineTypeBuckets[0]);
    const typeFortified = filteredWines.filter(d => d.type == wineTypeBuckets[1]);
    const typeRed = filteredWines.filter(d => d.type == wineTypeBuckets[2]);
    const typeRose = filteredWines.filter(d => d.type == wineTypeBuckets[3]);
    const typeSparkling = filteredWines.filter(d => d.type == wineTypeBuckets[4]);
    const typeWhite = filteredWines.filter(d => d.type == wineTypeBuckets[5]);

    const typeDessertPercent = typeDessert.length/filteredWines.length*100;
    const typeFortifiedPercent = typeFortified.length/filteredWines.length*100;
    const typeRedPercent = typeRed.length/filteredWines.length*100;
    const typeRosePercent = typeRose.length/filteredWines.length*100;
    const typeSparklingPercent = typeSparkling.length/filteredWines.length*100;
    const typeWhitePercent = typeWhite.length/filteredWines.length*100;

    // MEDIANS
    const medianPrice = d3.median(filteredWines, d => d.price);
    const medianRating = d3.median(filteredWines, d => d.rating);

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
        rating45abovePercent,
        typeDessertCount: typeDessert.length,
        typeFortifiedCount: typeFortified.length,
        typeRedCount: typeRed.length,
        typeRoseCount: typeRose.length,
        typeSparklingCount: typeSparkling.length,
        typeWhiteCount: typeWhite.length,
        typeDessertPercent,
        typeFortifiedPercent,
        typeRedPercent,
        typeRosePercent,
        typeSparklingPercent,
        typeWhitePercent,
        medianPrice,
        medianRating
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
            { category: "price", bucket: "$100–109", percent: d.price100_109Percent, count: d.price100_109Count },
            { category: "price", bucket: "$110–119", percent: d.price110_119Percent, count: d.price110_119Count },
            { category: "price", bucket: "$120–129", percent: d.price120_129Percent, count: d.price120_129Count },
            { category: "price", bucket: "$130–139", percent: d.price130_139Percent, count: d.price130_139Count },
            { category: "price", bucket: "$140–150", percent: d.price140_149Percent, count: d.price140_149Count },
            { category: "price", bucket: "$150+", percent: d.price150abovePercent, count: d.price150aboveCount},
            { category: "rating", bucket: "rating3below", percent: d.rating3belowPercent, count: d.rating3belowCount },
            { category: "rating", bucket: "rating3_35", percent: d.rating3_35Percent, count: d.rating3_35Count },
            { category: "rating", bucket: "rating35_4", percent: d.rating35_4Percent, count: d.rating35_4Count },
            { category: "rating", bucket: "rating4_45", percent: d.rating4_45Percent, count: d.rating4_45Count },
            { category: "rating", bucket: "rating45above", percent: d.rating45abovePercent, count: d.rating45aboveCount },
            { category: "type", bucket: "typeDessert", percent: d.typeDessertPercent, count: d.typeDessertCount },
            { category: "type", bucket: "typeFortified", percent: d.typeFortifiedPercent, count: d.typeFortifiedCount },
            { category: "type", bucket: "typeRed", percent: d.typeRedPercent, count: d.typeRedCount },
            { category: "type", bucket: "typeRose", percent: d.typeRosePercent, count: d.typeRoseCount },
            { category: "type", bucket: "typeSparkling", percent: d.typeSparklingPercent, count: d.typeSparklingCount },
            { category: "median", bucket: "medianPrice", percent: null, count: d.medianPrice },
            { category: "median", bucket: "medianRating", percent: null, count: d.medianRating }
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

function addTotalCounts(fullData, metric) {
        let totalCount = fullData.length;
        let totalprice10below = fullData.filter(d => d.priceBucket == "<10").length;
        let totalprice10_19 = fullData.filter(d => d.priceBucket == "10–19.99").length;
        let totalprice20_29 = fullData.filter(d => d.priceBucket == "20–29.99").length;
        let totalprice30_39 = fullData.filter(d => d.priceBucket == "30–39.99").length;
        let totalprice40_49 = fullData.filter(d => d.priceBucket == "40–49.99").length;
        let totalprice50_59 = fullData.filter(d => d.priceBucket == "50–59.99").length;
        let totalprice60_69 = fullData.filter(d => d.priceBucket == "60–69.99").length;
        let totalprice70_79 = fullData.filter(d => d.priceBucket == "70–79.99").length;
        let totalprice80_89 = fullData.filter(d => d.priceBucket == "80–89.99").length;
        let totalprice90_99 = fullData.filter(d => d.priceBucket == "90–99.99").length;
        let totalprice100_109 = fullData.filter(d => d.priceBucket == "100–109.99").length;
        let totalprice110_119 = fullData.filter(d => d.priceBucket == "110–119.99").length;
        let totalprice120_129 = fullData.filter(d => d.priceBucket == "120–129.99").length;
        let totalprice130_139 = fullData.filter(d => d.priceBucket == "130–139.99").length;
        let totalprice140_149 = fullData.filter(d => d.priceBucket == "140–150").length;
        let totalprice150above = fullData.filter(d => d.priceBucket == "150+").length;
        let total3below = fullData.filter(d => d.ratingBucket == "3 & less").length;
        let total3_35 = fullData.filter(d => d.ratingBucket == "3.1–3.5").length;
        let total35_4 = fullData.filter(d => d.ratingBucket == "3.6–4").length;
        let total4_45 = fullData.filter(d => d.ratingBucket == "4.1–4.5").length;
        let total45above = fullData.filter(d => d.ratingBucket == "4.6 & above").length;
        let totalDessert = fullData.filter(d => d.type == "Dessert").length;
        let totalFortified = fullData.filter(d => d.type == "Fortified").length;
        let totalRed = fullData.filter(d => d.type == "Red").length;
        let totalRose = fullData.filter(d => d.type == "Rose").length;
        let totalSparkling = fullData.filter(d => d.type == "Sparkling").length;
        let totalWhite = fullData.filter(d => d.type == "White").length;

        let animalOnlyCount = fullData.filter(d => d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice10below = fullData.filter(d => d.priceBucket == "<10" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice10_19 = fullData.filter(d => d.priceBucket == "10–19.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice20_29 = fullData.filter(d => d.priceBucket == "20–29.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice30_39 = fullData.filter(d => d.priceBucket == "30–39.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice40_49 = fullData.filter(d => d.priceBucket == "40–49.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice50_59 = fullData.filter(d => d.priceBucket == "50–59.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice60_69 = fullData.filter(d => d.priceBucket == "60–69.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice70_79 = fullData.filter(d => d.priceBucket == "70–79.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice80_89 = fullData.filter(d => d.priceBucket == "80–89.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice90_99 = fullData.filter(d => d.priceBucket == "90–99.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice100_109 = fullData.filter(d => d.priceBucket == "100–109.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice110_119 = fullData.filter(d => d.priceBucket == "110–119.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice120_129 = fullData.filter(d => d.priceBucket == "120–129.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice130_139 = fullData.filter(d => d.priceBucket == "130–139.99" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice140_149 = fullData.filter(d => d.priceBucket == "140–150" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyprice150above = fullData.filter(d => d.priceBucket == "150+" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnly3below = fullData.filter(d => d.ratingBucket == "3 & less" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnly3_35 = fullData.filter(d => d.ratingBucket == "3.1–3.5" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnly35_4 = fullData.filter(d => d.ratingBucket == "3.6–4" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnly4_45 = fullData.filter(d => d.ratingBucket == "4.1–4.5" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnly45above = fullData.filter(d => d.ratingBucket == "4.6 & above" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyDessert = fullData.filter(d => d.type == "Dessert" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyFortified = fullData.filter(d => d.type == "Fortified" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyRed = fullData.filter(d => d.type == "Red" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyRose = fullData.filter(d => d.type == "Rose").length;
        let animalOnlySparkling = fullData.filter(d => d.type == "Sparkling" && d.topgroup !== "none" && d.topgroup !== "human").length;
        let animalOnlyWhite = fullData.filter(d => d.type == "White" && d.topgroup !== "none" && d.topgroup !== "human").length;

        // MEDIANS
        let totalMedianPrice = d3.median(fullData.filter(d => d.price <= 150), d => d.price);
        let totalMedianRating = d3.median(fullData.filter(d => d.price <= 150), d => d.rating);
        let animalOnlyMedianPrice = d3.median(fullData.filter(d => d.price <= 150 &&  d.topgroup !== "none" && d.topgroup !== "human"), d => d.price);
        let animalOnlyMedianRating = d3.median(fullData.filter(d => d.price <= 150 &&  d.topgroup !== "none" && d.topgroup !== "human"), d => d.rating);

        let allObject = {
            animalGroup: "all",
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
            price100_109Count: totalprice100_109,
            price110_119Count: totalprice110_119,
            price120_129Count: totalprice120_129,
            price130_139Count: totalprice130_139,
            price140_149Count: totalprice140_149,
            price150aboveCount: totalprice150above,

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
            price100_109Percent: totalprice100_109/totalCount*100,
            price110_119Percent: totalprice110_119/totalCount*100,
            price120_129Percent: totalprice120_129/totalCount*100,
            price130_139Percent: totalprice130_139/totalCount*100,
            price140_149Percent: totalprice140_149/totalCount*100,
            price150abovePercent: totalprice150above/totalCount*100,
        
            rating3belowCount: total3below,
            rating3_35Count: total3_35,
            rating35_4Count: total35_4,
            rating4_45Count: total4_45,
            rating45aboveCount: total45above,
            rating3belowPercent: total3below/totalCount*100,
            rating3_35Percent: total3_35/totalCount*100,
            rating35_4Percent: total35_4/totalCount*100,
            rating4_45Percent: total4_45/totalCount*100,
            rating45abovePercent: total45above/totalCount*100,

            typeDessertPercent: totalDessert/totalCount*100,
            typeFortifiedPercent: totalFortified/totalCount*100,
            typeRedPercent: totalRed/totalCount*100,
            typeRosePercent: totalRose/totalCount*100,
            typeSparklingPercent: totalSparkling/totalCount*100,
            typeWhitePercent: totalWhite/totalCount*100,
            medianPrice:  totalMedianPrice,
            medianRating: totalMedianRating
        }

        let animalOnlyObject = {
            animalGroup: "animal wine",
            count: animalOnlyCount,
            price10belowCount: animalOnlyprice10below,
            price10_19Count: animalOnlyprice10_19,
            price20_29Count: animalOnlyprice20_29,
            price30_39Count: animalOnlyprice30_39,
            price40_49Count: animalOnlyprice40_49,
            price50_59Count: animalOnlyprice50_59,
            price60_69Count: animalOnlyprice60_69,
            price70_79Count: animalOnlyprice70_79,
            price80_89Count: animalOnlyprice80_89,
            price90_99Count: animalOnlyprice90_99,
            price100_109Count: animalOnlyprice100_109,
            price110_119Count: animalOnlyprice110_119,
            price120_129Count: animalOnlyprice120_129,
            price130_139Count: animalOnlyprice130_139,
            price140_149Count: animalOnlyprice140_149,
            price150aboveCount: animalOnlyprice150above,

            price10belowPercent: animalOnlyprice10below/animalOnlyCount*100,
            price10_19Percent: animalOnlyprice10_19/animalOnlyCount*100,
            price20_29Percent: animalOnlyprice20_29/animalOnlyCount*100,
            price30_39Percent: animalOnlyprice30_39/animalOnlyCount*100,
            price40_49Percent: animalOnlyprice40_49/animalOnlyCount*100,
            price50_59Percent: animalOnlyprice50_59/animalOnlyCount*100,
            price60_69Percent: animalOnlyprice60_69/animalOnlyCount*100,
            price70_79Percent: animalOnlyprice70_79/animalOnlyCount*100,
            price80_89Percent: animalOnlyprice80_89/animalOnlyCount*100,
            price90_99Percent: animalOnlyprice90_99/animalOnlyCount*100,
            price100_109Percent: animalOnlyprice100_109/animalOnlyCount*100,
            price110_119Percent: animalOnlyprice110_119/animalOnlyCount*100,
            price120_129Percent: animalOnlyprice120_129/animalOnlyCount*100,
            price130_139Percent: animalOnlyprice130_139/animalOnlyCount*100,
            price140_149Percent: animalOnlyprice140_149/animalOnlyCount*100,
            price150abovePercent: animalOnlyprice150above/animalOnlyCount*100,
        
            rating3belowCount: animalOnly3below,
            rating3_35Count: animalOnly3_35,
            rating35_4Count: animalOnly35_4,
            rating4_45Count: animalOnly4_45,
            rating45aboveCount: animalOnly45above,
            rating3belowPercent: animalOnly3below/animalOnlyCount*100,
            rating3_35Percent: animalOnly3_35/animalOnlyCount*100,
            rating35_4Percent: animalOnly35_4/animalOnlyCount*100,
            rating4_45Percent: animalOnly4_45/animalOnlyCount*100,
            rating45abovePercent: animalOnly45above/animalOnlyCount*100,

            typeDessertPercent: animalOnlyDessert/animalOnlyCount*100,
            typeFortifiedPercent: animalOnlyFortified/animalOnlyCount*100,
            typeRedPercent: animalOnlyRed/animalOnlyCount*100,
            typeRosePercent: animalOnlyRose/animalOnlyCount*100,
            typeSparklingPercent: animalOnlySparkling/animalOnlyCount*100,
            typeWhitePercent: animalOnlyWhite/animalOnlyCount*100,
            medianPrice:  animalOnlyMedianPrice,
            medianRating: animalOnlyMedianRating
        }

        if (metric == "cats") { 
            catSummary.push(animalOnlyObject);
            catSummary.push(allObject);
        } else if (metric == "birds") { 
            birdSummary.push(animalOnlyObject); 
            birdSummary.push(allObject); 
        }   else { 
            summary.push(animalOnlyObject);
            summary.push(allObject);
        }
}

function init() {
    // SUMMARY
    topgroups.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"all", data, i) }
    );
    addTotalCounts(data, "all");

    // CREATE FLAT DATA
    console.log(summary)
    formatCSV(summary, "all");

    const concatSummaryData = [].concat(...flatSummary).map(d => ({ ...d }));
    const csvSummary = d3.csvFormat(concatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_summary.csv`, csvSummary);

    // CATS
    cats.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"cat", catData, i) }
    );
    addTotalCounts(data, "cats");

    formatCSV(catSummary, "cats");

    const concatCatSummaryData = [].concat(...flatCatSummary).map(d => ({ ...d }));
    const csvCatSummary = d3.csvFormat(concatCatSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_catSummary.csv`, csvCatSummary);

    // BIRDS
    birds.map(
        function(animalGroup, i) { return summarizeWines(animalGroup,"bird", birdData, i) }
    );
    addTotalCounts(data, "birds");

    formatCSV(birdSummary, "birds");

    const concatBirdSummaryData = [].concat(...flatBirdSummary).map(d => ({ ...d }));
    const csvBirdSummary = d3.csvFormat(concatBirdSummaryData);
	fs.writeFileSync(`${OUT_PATH}/wineData_birdSummary.csv`, csvBirdSummary);
}   
init();