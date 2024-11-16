import * as PImage from 'pureimage/dist/index.esm.js';
import * as client from "https";

const url = "https://vr.josh.earth/webxr-experiments/physics/jinglesmash.thumbnail.png";

export const generateImage = () => {
  const bitmap = PImage.make(500,80);
  console.log('generateImage: start');

  const ctx = bitmap.getContext('2d');
  console.log('generateImage: ctx created');

  ctx.fillStyle = "blue";
  ctx.fillRect(0,0,500,100);
  ctx.fillStyle = '#FF3333';
  ctx.font = "60pt Roboto";
  // ctx.font = "60pt source";
  ctx.fillText('hello world', 50, 80);
  console.log('generateImage: ctx.fillText done');

  return bitmap;
}


export const generateO = () => {
  const bitmap = PImage.make(24,24);
  console.log('generateO: start');

  const ctx = bitmap.getContext('2d');
  console.log('generateO: ctx created');

  ctx.fillStyle = "blue";
  ctx.fillRect(0,0, 24, 24);
  ctx.fillStyle = '#FF3333';
  ctx.font = "24px 'Roboto'";
  ctx.fillText('O', 4, 24);
  console.log('generateO: ctx.fillText done');

  return bitmap;
}


export const example1 = () => {
  var img = PImage.make(150,150);
  var ctx = img.getContext('2d');

  ctx.fillStyle = "blue";
  ctx.fillRect(0,0,150,150);


  ctx.fillStyle = "#00ff00";
  ctx.beginPath();
  ctx.arc(50, 50, 40, 0, Math.PI * 2, true); // Outer circle
  ctx.closePath();
  ctx.fill();
  
  return img;
};

export const example2 = () => {
  var img = PImage.make(150,150);
  var ctx = img.getContext('2d');

  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  console.log('arc done');
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
  console.log('arc2 done');
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
  console.log('arc3 done');
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
  ctx.stroke();
  console.log('stroke done');
  return img;
};

// export const example3 = async () => {

//   const image_stream = await new Promise(res => client.get(url, res));
//   // const image_stream = await fetch(url).then(res => res.blob());
// console.log('*** *** *** *** stream', image_stream)
//   const img = await PImage.decodePNGFromStream(image_stream);
//   console.log('*** *** *** *** img', img)
//   //get context
//   const ctx = img.getContext("2d");
//   ctx.fillStyle = "#000000";
//   ctx.font = "60pt MyFont";
//   ctx.fillText(new Date().toDateString(), 50, 80);
// console.log('*** *** *** ***', img)
//     return img;
// };