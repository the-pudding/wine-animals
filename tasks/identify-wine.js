import fs from "fs";
import OpenAI from "openai";
const apiKey = "";
const INPATH = "static/assets/images/";
const files = fs.readdirSync(INPATH);
const filteredFiles = files.filter(file => { 
   return file.includes(".png");
})
const testingSet = ["img_168261371.png"]

const start = 5510;
let spent = 0;

const openai = new OpenAI({
    organization: "",
    apiKey: apiKey
});

function encodeImageToBase64(file) {
    return fs.readFileSync(`${INPATH}${file}`, 'base64');
}

const contentA = "This image is a wine label. Do you see any animals or humans on it? On a scale of 0-1, with 0 being 'not certain at all' and 1 being 'very certain', how sure are you?";
const contentB = "Using the text provided that describes a wine label, return the following in json format with two keys 'animal' and 'certainty': 'animal' = if there is an animal(s) or human(s) on the label, return its name, otherwise return 'none'; 'certainty' = your certainty assessment as a number between 0 - 1";

let responseA;
let responseB;
let costA;
let costB;

async function sendPromptA(file, i) {
    const response = await openai.chat.completions.create({
        model:  "gpt-4-vision-preview",
        max_tokens: 300,
        messages: [
            {
              role: "assistant",
              content: [
                { type: "text", text: contentA },
                {
                    type: "image_url",
                    image_url: {
                       "url": `data:image/png;base64,${encodeImageToBase64(file)}`, 
                    },
                },
              ], 
            },
        ],
    });
    const a = (response.usage.completion_tokens / 1000) * 0.06;
    const b = (response.usage.prompt_tokens / 1000) * 0.03;
    costA = a + b;

    if (response?.choices.length && response.choices[0].finish_reason === "stop") {
        responseA = response.choices[0].message.content;
    } else {
        throw new Error("response didn't finish");
    }
}

async function sendPromptB(txt, file, i) {
    const response = await openai.chat.completions.create({
        model:  "gpt-4",
        max_tokens: 300,
        messages: [
            {
              role: "system",
              content: [
                { type: "text", text: contentB }
              ], 
            },
            {
                role: "user",
                content: [
                  { type: "text", text: txt }
                ], 
              }
        ],
    });
    const a = (response.usage.completion_tokens / 1000) * 0.06;
    const b = (response.usage.prompt_tokens / 1000) * 0.03;
    costB = a + b;

    if (response?.choices.length && response.choices[0].finish_reason === "stop") {
        responseB = response.choices[0].message.content;
    } else {
        throw new Error("response didn't finish");
    }
}

async function combineData(id, responseA, responseB) {
    const stringified = JSON.stringify({id, responseA, responseB})
    const output = stringified.replace(/\\n/g, '').replaceAll('\\', '');
    console.log(output)
    fs.writeFileSync(`./tasks/output/response_${id}.json`, output);
}

function pause(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

(async () => {
    const files = filteredFiles.slice(start, filteredFiles.length - 1);
    // const files = testingSet;
    let i = start;
    for (const file of files) {
        const id = file.substring(
            file.indexOf("_") + 1,
            file.lastIndexOf(".")
        )
        try {
            await sendPromptA(file, i);
            await sendPromptB(responseA, file, i);
            await combineData(id, responseA, responseB);
            let totalCost = costA + costB;
            spent += totalCost;
            console.log(`${i}: ${totalCost.toFixed(2)} - ${spent.toFixed(2)} `)
        } catch (err) {
            console.log(err);
        }
        await pause(2000);
        i++;
    }
})();