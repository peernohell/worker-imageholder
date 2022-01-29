import * as PImage from 'pureimage/src/';
import {fromBytesBigEndian, getBytesBigEndian} from 'pureimage/src/uint32.js'
import opentype from 'opentype.js';
import {PNG} from "pngjs/browser";
import fontBuffer1 from 'font.ttf';
import fontBuffer2 from 'Gilland-Regular.otf';
import fontBuffer3 from 'Arturito Slab.ttf';
// Gilland-Regular
// addEventListener('fetch', event => {
//   event.respondWith(handleRequest(event))
// })


export default {
  async fetch(request, env) {
    try {
      let { readable, writable } = new TransformStream();
      const response = await handleRequest(request, env, writable);
      // const response = await handleRequest(request, env);

      var myHeaders = new Headers();

      myHeaders.append('Content-Type', 'image/png');
      return new Response(readable, { headers: myHeaders });
      // return new Response(response, { headers: myHeaders });
    } catch (e) {
      return new Response(e.message + '<br><pre>' + e.stack + '</pre>');
    }
  },
}

// Create the bézier paths for each of the glyphs.
// Note that the .notdef glyph is required.
const notdefGlyph = new opentype.Glyph({
  name: '.notdef',
  unicode: 0,
  advanceWidth: 650,
  path: new opentype.Path()
});

const aPath = new opentype.Path();
aPath.moveTo(100, 0);
aPath.lineTo(100, 700);
// more drawing instructions...
const aGlyph = new opentype.Glyph({
  name: 'A',
  unicode: 65,
  advanceWidth: 650,
  path: aPath
});

const bPath = new opentype.Path();
// bPath.moveTo(100, 0);
bPath.moveTo(10, 0);
bPath.lineTo(10, 10);
bPath.lineTo(20, 10);
bPath.lineTo(20, 50);
bPath.lineTo(0, 10);
// more drawing instructions...
const bGlyph = new opentype.Glyph({
  name: 'B',
  unicode: 66,
  advanceWidth: 650,
  path: bPath
});

const glyphs = [notdefGlyph, aGlyph, bGlyph];
// const font = new opentype.Font({
//   familyName: 'Roboto',
//   styleName: 'Medium',
//   unitsPerEm: 1000,
//   ascender: 800,
//   descender: -200,
//   glyphs: glyphs,
// });

const fn1 = () => {
  var img = PImage.make(500,50);
  console.log('img ok');
  var ctx = img.getContext('2d');
  console.log('ctx ok');
  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0,0,500,50);
  ctx.fillStyle = '#FF3333';
  ctx.font = "18px 'Roboto'";
  console.log('ctx.font ok');
  ctx.fillText('hello world  abcdefg', 40, 40);

  return img;
}

const fn2 = () => {
  var img = PImage.make(100,100);
  var ctx = img.getContext('2d');
  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0,0,100,100);

  ctx.fillStyle = '#00FF00';
  ctx.beginPath();
  ctx.arc(50,50,40,0,Math.PI*2,true); // Outer circle
  ctx.closePath();
  ctx.fill();

  return img;
}

const fn22 = () => {
  var img = PImage.make(100,100);
  var ctx = img.getContext('2d');
  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0,0,100,100);

  ctx.fillStyle = '#00FF00';
  ctx.beginPath();

  // ctx.arc(50,50,40,0,Math.PI*2,true)
  const x = 50;
  const y = 50;
  const rad = 40;
  let start = 0;
  let end = Math.PI * 2;
  const anticlockwise = false;

  function calcPoint(angle) {
      let px = x + Math.cos(angle)*rad;
      let py = y + Math.sin(angle)*rad;
      return [px, py];
  }

  if(start > end) end += Math.PI*2;

  let step = Math.PI / 16
  if (anticlockwise) {
      let temp = end;
      end = start + Math.PI * 2;
      start = temp;
  }
  let [p1, p2] = calcPoint(start);
  console.log('start', { p1, p2 })
  ctx.moveTo(p1, p2);
  for (let a = start; a <= end; a += step) {
    ([p1, p2] = calcPoint(a));
    console.log('step', { p1, p2 })
    ctx.lineTo(p1, p2);
  }
  ([p1, p2] = calcPoint(end));
  console.log('end', { p1, p2 })
  ctx.lineTo(p1, p2);
  
  ctx.closePath();
  ctx.fill();

  return img;
}

const fn3 = () => {
  var img = PImage.make(100,100);
  var ctx = img.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0,0,10,10);

  ctx.font = "12px 'Roboto'";
  console.log('ctx.font ok');
  ctx.fillText("A", 8, 8);

  return img;
}

const fn4 = () => {
  var img = PImage.make(150,150);
  var ctx = img.getContext('2d');
  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0, 0, 150, 150);

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.fillStyle = '#0000FF';
  ctx.strokeRect(50, 50, 50, 50);


  ctx.beginPath();
  ctx.moveTo(75, 50);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);
  ctx.fill();

  return img;
}

const fn5 = () => {
  var img = PImage.make(150,150);
  var ctx = img.getContext('2d');

  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  ctx.moveTo(110, 75);
  ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
  ctx.stroke();

  return img;
};



const handleRequest = async (req, env, writable) => {

  // special font loading
  const url = new URL(req.url);
 const accept = req.headers.get('accept');
 if (req.method === 'GET' &&
     url.pathname.startsWith('/fonts.gstatic.com/')) {
 
   // Proxy the font file requests
   return proxyRequest('https:/' + url.pathname, req);
 
 }



  // render the image

  //var fnt = PImage.registerFont('/Users/peernohell/lempire/lemlist/app/public/fonts/bilbo.ttf','Source Sans Pro');
  var fnt = PImage.registerFont('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf','Roboto');
  console.log('handleRequest ...');
  // return new Promise(async (resolve, reject) => {
      // console.log('opentype ', err, font);
      // if (err) {
      //   console.log(err);
      //   res.end('failed' + err.message);
      //   reject(err);
      //   return;
      // }

      // const response = slug; // await fetch('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf');
      // const response = slug2; // await fetch('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf');
      console.log('handleRequest fetch ok');
      const font = await opentype.parse(fontBuffer3); // await response.arrayBuffer());

      // const font = await opentype.load('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2');

      console.log('opentype ', font, {fontKeys: Object.keys(font) });

      fnt.font = font;
      fnt.loaded = true;

      const img = fn1();
      // console.log('starting encodingPNG ...', img.width, img.height, { pixel: img.getPixelRGBA(0,0), isFFFF: img.getPixelRGBA(0,0) === 0xffffffff, data: img.data });
      // await PImage.encodePNGToStream(img, writable);
    // return img.data;
      const png = new PNG({
        width: img.width,
        height: img.height
      })

      // png.data.pipe(writable);
      // const data = new Uint8ClampedArray(img.width*img.height*4);

      for(let i=0; i<img.width; i++) {
        for(let j=0; j<img.height; j++) {
            const rgba = img.getPixelRGBA(i, j)
            
            const n = (j * img.width + i) * 4
            const bytes = getBytesBigEndian(rgba)
            if (!i && !j) console.log('rgba', rgba, n, bytes);

            for(let k=0; k<4; k++) {
                png.data[n+k] = bytes[k];
                // data[n+k] = bytes[k];
            }
        }
      }

      const writer = writable.getWriter()
      // writer.write(png.pack(), 'binary');
      // console.log('encodingPNG ok');
      // writer.close();
      // return png.pack().pipe(writer);
      // return data;
      // return img;
      // resolve(img);

      // for await (const chunk of Readable.from(png.pack())) {
      //   writer.write(chunk, 'binary');
      // }

      // writer.close();
      // png.pack().pipe({
      //   on(data) {
      //     console.log('on', data);
      //     writer.write(data, 'binary');
      //   }
      // });
      png._packer.on('data', chunk => { writer.write(chunk, 'binary'); });
      png._packer.on('end', () => writer.close());
      png.pack()
      // await readableToString(png, writer);
      console.log('encodingPNG ok');


    // });
  // });
};
