import fs from "fs";
import OpenAI from "openai";
const apiKey = "";
const INPATH = "./tasks/output/";
const files = fs.readdirSync(INPATH);
const filteredFiles = files.filter(file => { 
   return file.includes(".txt");
})
let spent = 0;

const start = 825;

const openai = new OpenAI({
    organization: "",
    apiKey: apiKey
});

function readText(file) {
    const txt = fs.readFileSync(`${INPATH}${file}`, 'utf-8');
    return txt.toString();
}

const content = "Using the text provided that describes a wine label, answer two questions: 1. What animal is on this wine label? If there are no animals, is there a human? If there are neither return 'none', otherwise return the name of the animal or human. 2. How certain are you of this assessment? Return either 'low', 'medium', or 'high'. Return both 'animal' and 'certainty' as keys in a json object.";

async function sendPrompt(txt, file, i) {
    const response = await openai.chat.completions.create({
        model:  "gpt-4",
        max_tokens: 300,
        messages: [
            {
              role: "system",
              content: [
                { type: "text", text: content }
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
    const c = a + b;
    spent += c;

    console.log(`${i}: ${c.toFixed(2)} - ${spent.toFixed(2)} `)

    if (response?.choices.length && response.choices[0].finish_reason === "stop") {
        const outFile = `json_${file}`;
        const content = response.choices[0].message.content;
        fs.writeFileSync(`./tasks/output/json/${outFile}`, content);
    } else {
        throw new Error("response didn't finish");
    }
}

function pause(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

(async () => {
    const files = filteredFiles;
    // const files = filteredFiles;
    let i = start;
    for (const file of files) {
        const txt = await readText(file);
        try {
            const txt = await readText(file);
            await sendPrompt(txt, file, i);
        } catch (err) {
            console.log(err);
        }
        await pause(2000);
        i++;
    }
})();