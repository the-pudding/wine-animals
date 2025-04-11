import fs from "fs/promises"; // use the promises API
import path from "path";
import * as d3 from "d3";

// LOAD DATA
const raw = await fs.readFile("./src/data/wineData.csv", "utf8");
const data = d3.csvParse(raw);

const filteredData = data.filter(
	d => +d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none"
);

// CREATE A SET OF VALID IDS
const validIds = new Set(filteredData.map(d => d.id));

const imageDir = "./static/assets/images/vivinoLabels";

try {
	const files = await fs.readdir(imageDir);

	if (files.length === 0) {
		console.log("📁 No files found in the directory.");
	} else {
		let deletedCount = 0;

		const deletions = files.map(async file => {
			const match = file.match(/^img_(\d+)\.png$/);
			if (match) {
				const id = match[1];
				if (!validIds.has(id)) {
					const filePath = path.join(imageDir, file);
					await fs.unlink(filePath);
					console.log(`🗑️ Deleted ${file}`);
					deletedCount++;
				}
			}
		});

		await Promise.all(deletions);

		const remainingFiles = await fs.readdir(imageDir);
		const remainingImages = remainingFiles.filter(f => /^img_\d+\.png$/.test(f));

		console.log(`✅ Done. ${remainingImages.length} image(s) remaining.`);
		console.log(`🧹 Deleted ${deletedCount} image(s).`);
	}
} catch (err) {
	console.error("❌ Error processing images:", err);
}