// app/scripts/getbase64.js
const fs = require("fs");

// Update the file path to match your actual font file name
const fontFilePath = "./NotoSansJP-VariableFont_wght.ttf";
const outputFilePath = "./NotoSansJP-base64.txt";

fs.readFile(fontFilePath, (err, data) => {
  if (err) {
    console.error("Error reading font file:", err);
    return;
  }

  const base64Data = data.toString("base64");
  fs.writeFile(outputFilePath, base64Data, (err) => {
    if (err) {
      console.error("Error writing base64 file:", err);
      return;
    }
    console.log("Base64 conversion completed! File:", outputFilePath);
  });
});
