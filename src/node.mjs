import * as PImage from 'pureimage';
import opentype from 'opentype.js';
// import fontBuffer from './SourceSansPro-Regular.ttf';
// import fontBuffer from './Roboto-Regular.ttf';
import * as draw from './draw.mjs';
import http from 'http';
import fs from 'fs/promises';

const port = process.env.PORT || 8000;
const html = `<header><h1>Hello, World!</h1></header>`;

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
    this.writer.end();
  }
  end() { /* needed but writer.close must be called later. */ }
  on(evt, cb) { this.addEventListener(evt, cb); return this; }
  removeListener(evt, cb) { this.removeEventListener(evt, cb); }
}

const handleRequestWorker = async (req, env, writable) => {
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

  const fontBuffer = await fs.readFile('./Roboto-Regular.ttf');

  const font = await opentype.parse(fontBuffer); // await response.arrayBuffer());
  fnt.font = font;
  fnt.loaded = true;

  const bitmap = await draw.example3();
  // convert bitmap to png stream

  // await bitmapToPNG(bitmap, new Writer());
  await PImage.encodePNGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.
  // await PImage.encodeJPEGToStream(bitmap, new Writer(writable.getWriter())) // throw an error but works.

  console.log('encodingPNG ok');
};

function toArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}
const handleRequestNode = async (req, res) => {
  // special font loading
  console.log('handleRequestNode ...', req.url);
  if (req.url === '/favicon.ico') {
    res.writeHead(404);
    res.end();
    return;
  }
  // const url = new URL(req.url);
  // const accept = req.headers.get('accept');
  // if (req.method === 'GET' && url.pathname.startsWith('/fonts.gstatic.com/')) {
  //   // Proxy the font file requests
  //   return proxyRequest('https:/' + url.pathname, req);
  // }

  //var fnt = PImage.registerFont('/Users/peernohell/lempire/lemlist/app/public/fonts/bilbo.ttf','Source Sans Pro');
  // var fnt = PImage.registerFont('https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf','Roboto');

  // const fontBuffer = await fs.readFile('./src/SourceSansPro-Regular.ttf');
  // const font = await opentype.parse(toArrayBuffer(fontBuffer)); // await response.arrayBuffer());
  // fnt.font = font;
  // fnt.loaded = true;
  var fnt = PImage.registerFont('./src/SourceSansPro-Regular.ttf','MyFont');
  fnt.loadSync();
  
  console.log('handleRequestNode font ready');

  const bitmap = await draw.example3();
  // convert bitmap to png stream
  console.log('handleRequestNode bitmap ready');

  await PImage.encodePNGToStream(bitmap, new Writer(res))

  console.log('encodingPNG ok');
};



http.createServer(function(req, res) {
  handleRequestNode(req, res).then(() => console.log('ok'), err => {
    console.log('handler failed', err);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err.message);
  });
}).listen(port, () => {
  console.log(`App running on port ${port}`);
});
