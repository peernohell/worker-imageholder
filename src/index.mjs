import * as PImage from 'pureimage/dist/index.esm.js';
import opentype from 'opentype.js';
// import fontBuffer from './Gilland-Regular.otf';
import fontBuffer from './Manrope-Regular.otf';
// import fontBuffer from './Roboto-Regular.ttf';
// import fontBuffer from './Roboto-Regular.ttf';
import { generateImage, generateO, example1, example2 } from './draw.mjs';

const gen = generateImage;

console.log('starting...');
export default {
  async fetch(request, env) {
    console.log('fetch ...');
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
  prependListener(evt, cb) { this.addEventListener(evt, cb); }
}

const handleRequest = async (req, env, writable) => {
  console.log('handleRequest ...');
  // special font loading
  const url = new URL(req.url);
  const accept = req.headers.get('accept');
  if (req.method === 'GET' && url.pathname.startsWith('/fonts.gstatic.com/')) {
    // Proxy the font file requests
    return proxyRequest('https:/' + url.pathname, req);
  }

  var fnt = PImage.registerFont('','Roboto');
  // var fnt = PImage.registerFont('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf','Roboto');
  console.log('handleRequest ...');

  const font = await opentype.parse(fontBuffer); // await response.arrayBuffer());
  fnt.font = font;
  fnt.loaded = true;


  const bitmap = gen();
  // convert bitmap to png stream

  // await bitmapToPNG(bitmap, new Writer());
  await PImage.encodePNGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.
  // await PImage.encodeJPEGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.

  console.log('encodingPNG ok');
};
