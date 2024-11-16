import * as PImage from "pureimage";
import fs from "fs";
import * as client from "https";
import opentype from 'opentype.js';

const url = "https://vr.josh.earth/webxr-experiments/physics/jinglesmash.thumbnail.png";
const filepath = "output_stream_sync.png";

// //register font
// const font = PImage.registerFont(
//   "./src/SourceSansPro-Regular.ttf",
//   "MyFont",
// );



// //load font
// font.loadSync();

// function toArrayBuffer(buffer) {
//   const arrayBuffer = new ArrayBuffer(buffer.length);
//   const view = new Uint8Array(arrayBuffer);
//   for (let i = 0; i < buffer.length; ++i) {
//     view[i] = buffer[i];
//   }
//   return arrayBuffer;
// }

// // load that dont work
// // var fnt = PImage.registerFont('./src/SourceSansPro-Regular.ttf','MyFont');

// // const fontBuffer = await fs.promises.readFile('./src/SourceSansPro-Regular.ttf');
// // const font = await opentype.parse(toArrayBuffer(fontBuffer)); // await response.arrayBuffer());

// // fnt.font = font;
// // fnt.loaded = true;

// // load that may work
// // var fnt = PImage.registerFont('https://fonts.cdnfonts.com/s/12183/SourceSansPro-Regular.woff','MyFont');
// // await fnt.load();


// // load that work
// // var fnt = PImage.registerFont('./src/SourceSansPro-Regular.ttf','MyFont');
// // fnt.loadSync();

// //get image
// client.get(url, (image_stream) => {
//   //decode image
//   PImage.decodePNGFromStream(image_stream).then((img) => {
//     //get context
//     const ctx = img.getContext("2d");
//     ctx.fillStyle = "#000000";
//     ctx.font = "60pt MyFont";
//     ctx.fillText(new Date().toDateString(), 50, 80);
//     PImage.encodePNGToStream(img, fs.createWriteStream(filepath)).then(() => {
//       console.log("done writing to ", filepath);
//     });
//   });
// });