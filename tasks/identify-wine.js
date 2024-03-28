import fs from "fs";
import OpenAI from "openai";
const apiKey = "";
const INPATH = "static/assets/labels/";
const files = fs.readdirSync(INPATH);
const file = "fJMLVLD7S9O_wMcFjyG60Q_pb_x960.png";
const data = [];

const openai = new OpenAI({
    organization: "",
    apiKey: apiKey
});

function encodeImageToBase64(file) {
    return fs.readFileSync(`${INPATH}${file}`, 'base64');
}

async function main() {
    const response = await openai.chat.completions.create({
        model:  "gpt-4-vision-preview",
        max_tokens: 300,
        messages: [
            {
              role: "assistant",
              content: [
                { type: "text", text: "What animal is on this wine label? If there is no animal, return `unidentified.` Return all answers in csv format." },
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
    data.push({ animal: response.choices[0].message.content,
        imageFile: file })
    console.log(data)
}

main();

// async function identifyAnimalInLabel(file) {
//     const imageBase64 = encodeImageToBase64(file);


//     try {
//         const response = await axios.post(apiUrl, {
//             model: "gpt-4-vision-preview",
//             prompt: `Analyze the animal on the wine label in this image: ${imageBase64}.`,
//             max_tokens: 50  // Adjust as needed
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(response.data.choices[0].text.trim());x
//         return response.data;
//     } catch (error) {
//         console.error('Error:', error.response);
//     }
//     return;
// }

// // Iterate over images and get responses
// files.slice(0,1).forEach(file => {
//     identifyAnimalInLabel(file).then(result => {
//         console.log(`Response for ${file}:`, result);
//     });
// });