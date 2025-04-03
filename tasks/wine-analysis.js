import fs from "fs";
import * as d3 from "d3";

// LOAD DATA
const raw = fs.readFileSync("./src/data/wineData.csv", "utf8");
const data = d3.csvParse(raw);
const OUT_PATH = "./src/data/";

// ANIMAL GROUPINGS
const topgroups = ["amphibian/reptile", "bear", "bird", "bug", "canine", "cat", "cattle",
   "deer", "fish", "horse", "human",
   "marine invertebrate", "mythical creature", "none", "pachyderm",
   "rabbit", "sheep", "pig"
];

const cats = ["cat", "cheetah", "cougar", "jaguar/leopard/panther", "lion", "lion crest", "lynx", "tiger"];
const birds = ["duck", "flightless bird", "game bird", "junglefowl", "owl", "peacock", "penguin", "raptor", "shorebird", "songbird", "wading bird"]; 

// BUCKETS
const priceBuckets = ["<10", "10–19.99", "20–29.99", "30–39.99", "40–49.99", "50–59.99", "60–69.99", "70–79.99", "80–89.99", "90–99.99", "100–109.99", "110–119.99", "120–129.99", "130–139.99", "140–149.99", "150+"];
const ratingBuckets = ["3 & less", "3.1–3.5", "3.6–4", "4.1–4.5", "4.6 & above"];
const wineTypeBuckets = ["Dessert", "Fortified", "Red", "Rose", "Sparkling", "White"];
const countryBuckets = ["France", "United States", "Italy", "Spain", "Argentina",
                        "Portugal", "South Africa", "Australia", "Germany", "Chile", "New Zealand", "Austria"]

// AVERAGES
const totalAvgPrice = d3.median(data.filter(d => d.price <= 150), d => d.price);
const totalAvgRating = d3.median(data.filter(d => d.price <= 150), d => d.rating);

// CAT AND BIRD FILTER
const catData = data.filter(d => d.topgroup.includes("cat") && !d.topgroup.includes("cattle"));
const birdData = data.filter(d => d.topgroup.includes("bird"));

// SUMMARIZE DATA
function summarizeWines(animalGroup, dataset, metric) {
    let filteredWines;

    if (metric === "all wines") {
        filteredWines = dataset;
    } else if (metric === "animal wines") {
        filteredWines = dataset.filter(d => d.topgroup !== "none" && d.topgroup !== "human"); // Exclude "none" and "human"
    } else if (metric === "cat") {
        if (animalGroup == "lion crest" || "lion") {
            filteredWines = catData.filter(d => {
                const animals = d.finalAnimal.split(",").map(a => a.trim());
                return animals.includes(animalGroup);
              });
        } else {
            filteredWines = catData.filter(d => d.finalAnimal.includes(animalGroup));
        }
    } else if (metric === "bird") {
        filteredWines = birdData.filter(d => d.subgroup.includes(animalGroup));
    } else {
        if (animalGroup == "cat") {
            filteredWines = dataset.filter(d => d.topgroup.includes(animalGroup) && !d.topgroup.includes("cattle"))
        } else {
            filteredWines = dataset.filter(d => d.topgroup.includes(animalGroup));
        }
    }

    const getCountsAndPercents = (buckets, key) => {
        const counts = d3.rollup(filteredWines, v => v.length, d => d[key]);
        return Object.fromEntries(buckets.map(bucket => [
            bucket, { count: counts.get(bucket) || 0, percent: ((counts.get(bucket) || 0) / filteredWines.length) * 100 }
        ]));
    };

    return {
        animalGroup,
        count: filteredWines.length,
        priceData: getCountsAndPercents(priceBuckets, "priceBucket"),
        ratingData: getCountsAndPercents(ratingBuckets, "ratingBucket"),
        typeData: getCountsAndPercents(wineTypeBuckets, "type"),
        countryData: getCountsAndPercents(countryBuckets, "country"),
        medianPrice: d3.median(filteredWines, d => d.price),
        medianRating: d3.median(filteredWines, d => d.rating),
        steals: {
            count: filteredWines.filter(d => d.price <= totalAvgPrice && d.rating >= totalAvgRating).length,
            percent: (filteredWines.filter(d => d.price <= totalAvgPrice && d.rating >= totalAvgRating).length / filteredWines.length) * 100
        }
    };
}

// FORMAT CSV
function formatCSV(summaryData) {
    return summaryData.flatMap(d => [
        ...priceBuckets.map(bucket => ({
            animalGroup: d.animalGroup, category: "price", bucket,
            percent: d.priceData[bucket].percent || 0, count: d.priceData[bucket].count || 0
        })),
        ...ratingBuckets.map(bucket => ({
            animalGroup: d.animalGroup, category: "rating", bucket,
            percent: d.ratingData[bucket].percent || 0, count: d.ratingData[bucket].count || 0
        })),
        ...wineTypeBuckets.map(bucket => ({
            animalGroup: d.animalGroup, category: "type", bucket,
            percent: d.typeData[bucket].percent || 0, count: d.typeData[bucket].count || 0
        })),
        ...countryBuckets.map(bucket => ({
            animalGroup: d.animalGroup, category: "country", bucket,
            percent: d.countryData[bucket].percent || 0, count: d.countryData[bucket].count || 0
        })),
        { animalGroup: d.animalGroup, category: "median", bucket: "medianPrice", percent: null, count: d.medianPrice },
        { animalGroup: d.animalGroup, category: "median", bucket: "medianRating", percent: null, count: d.medianRating },
        { animalGroup: d.animalGroup, category: "count", bucket: "count", percent: null, count: d.count },
        { animalGroup: d.animalGroup, category: "steals", bucket: "steals", percent: d.steals.percent, count: d.steals.count }
    ]);
}

// FORMAT MEDIAN CSV
function formatMedianCSV(summaryData) {
    return summaryData.map(d => ({
        animalGroup: d.animalGroup,
        medianPrice: d.medianPrice,
        medianRating: d.medianRating,
        stealPercent: d.steals.percent,
        totalCount: d.count
    }));
}

// GENERATE SUMMARIES
function generateSummary(dataset, metric, groups) {
    console.log(`Generating summary for ${metric}...`);
       
    // DATA VALIDATION
    if (!Array.isArray(dataset) || dataset.length === 0) {
        console.error(`Invalid dataset for ${metric}. Expected an array but received:`, dataset);
        return [];
    }

    console.log(`Dataset size for ${metric}:`, dataset.length);

    const groupSummaries = groups.map(group => summarizeWines(group, dataset, metric));

    const allWinesSummary = summarizeWines("all", dataset, "all wines");
    const animalWinesSummary = summarizeWines("animal wines", dataset, "animal wines");

    if (metric !== "cat" && metric !== "bird") {
        return formatCSV([...groupSummaries, allWinesSummary, animalWinesSummary]);
    } else {
        return formatCSV([...groupSummaries]);
    }
}

// WRITE CSVS
function writeCSV(filename, summaryData) {
    fs.writeFileSync(`${OUT_PATH}/${filename}.csv`, d3.csvFormat(summaryData));
}

// INIT
function init() {
    console.log("Starting wine analysis...");

    writeCSV("wineData_summary", generateSummary(data, "all", topgroups));
    writeCSV("wineData_catSummary", generateSummary(catData, "cat", cats));
    writeCSV("wineData_birdSummary", generateSummary(birdData, "bird", birds));

    const medianSummary = formatMedianCSV([
        ...topgroups.map(group => summarizeWines(group, data, "all")),
        summarizeWines("all", data, "all wines"),
        summarizeWines("animal wines", data, "animal wines")
    ]);

    writeCSV("wineData_median", medianSummary);

    console.log("Wine analysis complete!");
}

init();
