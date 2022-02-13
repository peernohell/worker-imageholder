import * as PImage from 'pureimage/src/';
import opentype from 'opentype.js';
import fontBuffer from 'SourceSansPro-Regular.ttf';

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
  const bitmap = PImage.make(500,80);
  console.log('generateImage: start');

  const ctx = bitmap.getContext('2d');
  console.log('generateImage: ctx created');

  ctx.fillRect(0,0,500,100);
  ctx.fillStyle = '#FF3333';
  ctx.font = "60pt 'Roboto'";
  ctx.fillText('hello world', 50, 80);
  console.log('generateImage: ctx.fillText done');

  return bitmap;
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

class Writer extends EventTarget {
  constructor(writer) {
    super();
    this.writer = writer;
  }
  emit(event, data) {
    this.dispatchEvent(new Event(event));

    // TODO only on pipe
    if (event === 'pipe') {
      data.on('data', this.onData.bind(this));
      data.on('end', this.onEnd.bind(this));
    }
  }
  onData(chunk) {
    this.writer.write(chunk, 'binary');
  }
  onEnd() {
    console.log('writer.close');
    this.emit('finish');
    this.writer.close();
  }
  end() { /* needed but writer.close must be called later. */ }
  on(evt, cb) { this.addEventListener(evt, cb); return this; }
  removeListener(evt, cb) { this.removeEventListener(evt, cb); }
}

const handleRequest = async (req, env, writable) => {
  // special font loading
  const url = new URL(req.url);
  const accept = req.headers.get('accept');
  if (req.method === 'GET' && url.pathname.startsWith('/fonts.gstatic.com/')) {
    // Proxy the font file requests
    return proxyRequest('https:/' + url.pathname, req);
  }

  //var fnt = PImage.registerFont('/Users/peernohell/lempire/lemlist/app/public/fonts/bilbo.ttf','Source Sans Pro');
  var fnt = PImage.registerFont('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf','Roboto');
  console.log('handleRequest ...');

  const font = await opentype.parse(fontBuffer); // await response.arrayBuffer());
  fnt.font = font;
  fnt.loaded = true;

  const bitmap = generateImage();
  // convert bitmap to png stream

  // await bitmapToPNG(bitmap, new Writer());
  await PImage.encodePNGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.
  // await PImage.encodeJPEGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.

  console.log('encodingPNG ok');
};
