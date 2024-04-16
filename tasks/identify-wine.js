import fs from "fs";
import OpenAI from "openai";
const apiKey = "";
const INPATH = "static/assets/images/";
const files = fs.readdirSync(INPATH);
const filteredFiles = files.filter(file => { 
   return file.includes(".png");
})
let spent = 0;

const start = 825;

const openai = new OpenAI({
    organization: "",
    apiKey: apiKey
});

function encodeImageToBase64(file) {
    return fs.readFileSync(`${INPATH}${file}`, 'base64');
}

const content = "This image is a wine label. Do you see any animals on it? How sure are you?";

async function sendPrompt(file, i) {
    const response = await openai.chat.completions.create({
        model:  "gpt-4-vision-preview",
        max_tokens: 300,
        messages: [
            {
              role: "assistant",
              content: [
                { type: "text", text: content },
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
    const c = a + b;
    spent += c;

    console.log(`${i}: ${c.toFixed(2)} - ${spent.toFixed(2)} `)

    if (response?.choices.length && response.choices[0].finish_reason === "stop") {
        const outFile = file.replace(".png", ".txt");
        const content = response.choices[0].message.content;
        fs.writeFileSync(`./tasks/output/guesses/${outFile}`, content);
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
    const files = filteredFiles.slice(start, filteredFiles.length - 1);
    // const files = filteredFiles;
    let i = start;
    for (const file of files) {
        try {
            await sendPrompt(file, i);
        } catch (err) {
            console.log(err);
        }
        await pause(2000);
        i++;
    }
})();