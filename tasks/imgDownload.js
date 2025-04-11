import download from "image-downloader";
import fs from "fs";
import * as d3 from "d3";

const raw = fs.readFileSync("./src/data/wineData.csv", "utf8");
const csvData = d3.csvParse(raw);

let options = {
    url: "",
    dest: "",
};
let delay = 2000;
let promise = Promise.resolve();

csvData.forEach((d, i) => {
    promise = promise.then(function() {
        if (d.imageUrl) {
            options.url = `https://${d.imageUrl}`;
            options.dest = `../../static/assets/images/img_${d.id}.png`;
    
            download.image(options)
                .then(({ filename, image }) => {
                    console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
                })
                .catch((err) => console.error(err));

            return new Promise(function (resolve) {
                setTimeout(resolve, delay);
            });
        }
    })
})
