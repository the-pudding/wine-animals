import fs from "fs";
import * as d3 from "d3";

const raw = fs.readFileSync("./src/data/wine-animals_LIMITED.csv", "utf8");
const csvData = d3.csvParse(raw);
let gptData = [];

function findDescriptionMatch(id) {
    let file = fs.existsSync(`./tasks/output/guesses/img_${id}.txt`)
    if (file) {
        let fileTxt = fs.readFileSync(`./tasks/output/guesses/img_${id}.txt`, "utf8") ;
        return fileTxt;
    } else {
        return ""
    }
}

function findDataMatch(id, prop) {
    let file = fs.existsSync(`./tasks/output/json/json_img_${id}.txt`)
    if (file) {
        let fileTxt = fs.readFileSync(`./tasks/output/json/json_img_${id}.txt`, "utf8") ;
        if (fileTxt.includes("{") && !fileTxt.includes("Apologies")) {
            let jsonData = JSON.parse(fs.readFileSync(`./tasks/output/json/json_img_${id}.txt`, "utf8"))
            let jsonAnimal = jsonData.animal;
            let jsonCertainty = jsonData.certainty;
            if (prop == "animal") {
                return jsonAnimal
            } else {
                return jsonCertainty
            }
        } else {
            return ""
        }
    } else {
        return ""
    }
}

function addGPTData(data) {
    gptData = data.map((d, i) => ({
        ...d,
        gptDescription: findDescriptionMatch(d.id),
        gptAnimal: findDataMatch(d.id, "animal"),
        gptCertainty: findDataMatch(d.id, "certainty")
    }))
}

function init() {
    addGPTData(csvData)
    const csv = d3.csvFormat(gptData)
    fs.writeFileSync(`./tasks/output/withGPTData.csv`, csv)
}

init();