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

const generateImage = () => {
  var img = PImage.make(500,50);
  console.log('generateImage: start');
  var ctx = img.getContext('2d');
  console.log('generateImage: ctx created');

  ctx.fillStyle = '#AAAAAA';
  ctx.fillRect(0,0,500,50);
  ctx.fillStyle = '#FF3333';
  ctx.font = "18px 'Roboto'";
  console.log('generateImage: ctx.font set');
  
  ctx.fillText('hello world', 40, 40);
  console.log('generateImage: ctx.fillText done');

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
 if (req.method === 'GET' && url.pathname.startsWith('/fonts.gstatic.com/')) {
 
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

      const img = generateImage();
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
