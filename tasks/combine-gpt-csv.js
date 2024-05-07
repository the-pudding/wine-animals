import fs from "fs";
import * as d3 from "d3";

const raw = fs.readFileSync("./src/data/wine-animals_LIMITED.csv", "utf8");
const csvData = d3.csvParse(raw);
let gptData = [];
let existsList = [];
let completeList = []
let rerunList = [];

function findDataMatch(id, prop) {
    let file = fs.existsSync(`./tasks/output/response_${id}.json`)
    if (file) {
        if (existsList.indexOf(id) === -1) { existsList.push(id) };
        let fileTxt = fs.readFileSync(`./tasks/output/response_${id}.json`, "utf8") ;
        fileTxt = fileTxt.replace(`"responseB":"{`, `"responseB":{`)
            .replace(`}"}`, `}}`)
        let fileTxtSplitA = fileTxt.split(`"responseA":"`)[1];
        let fileTxtSplitB = fileTxtSplitA.split(`","responseB":`)[0];
        let fileTxtReplaceQuotes = fileTxtSplitB.replaceAll(`"`, `'`);
        let replacedTxt = fileTxt.split(`"responseA":"`)[0]
            .concat(`"responseA":"`, fileTxtReplaceQuotes)
            .concat(`","responseB":`, fileTxtSplitA.split(`","responseB":`)[1])
        if (fileTxt.includes("{") && fileTxt.includes(`"responseB":{`)) {
            if (completeList.indexOf(id) === -1) { completeList.push(id) };
            let jsonData = JSON.parse(replacedTxt)
            let jsonDesc = jsonData.responseA;
            let jsonAnimal = jsonData.responseB.animal;
            let jsonCertainty = jsonData.responseB.certainty;
            if (prop == "desc") {
                return jsonDesc
            } else if (prop == "animal") {
                return jsonAnimal
            } else {
                return jsonCertainty
            }
        } else {
            if (fileTxt.includes("apologies") || fileTxt.includes("sorry")) {
                if (rerunList.indexOf(id) === -1) { rerunList.push(id) };
                return ""
            } else {
                return ""
            }
        }
    } else {
        return ""
    }
}

function addGPTData(data) {
    gptData = data.map((d, i) => ({
        ...d,
        gptDescription: findDataMatch(d.id, "desc"),
        gptAnimal: findDataMatch(d.id, "animal"),
        gptCertainty: findDataMatch(d.id, "certainty")
    }))
}

function init() {
    addGPTData(csvData)
    const csv = d3.csvFormat(gptData)

    const concatRerunData = [].concat(...rerunList).map(d => ({
        id: d,
    }));
    const rerunCSV = d3.csvFormat(concatRerunData)
    
    console.log(csvData.length, existsList.length, completeList.length, rerunList.length)
    fs.writeFileSync(`./src/data/withGPTData.csv`, csv)
    fs.writeFileSync(`./src/data/rerun.csv`,rerunCSV)
}

init();