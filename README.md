# 👷 `worker-image-placeholder`

A cloudflare workers to generate placeholder image

It use rollup to build.

To build use the following command
```console
$ wrangler dev
```

# TODO
* make node_modules dependency work again
* fix pureimage-js that is in node_modules to works with cloudlfare workers (import png/browser + replace Buffer.concat)
* pureimage-js (index.js): replace `import 'pngjs'` by `import 'pngjs/browser'`
* pureimage-js (index.js): `import * as JPEG from "jpeg-js"`
* pureimage-js (bitmap.js): replace `this.data = Buffer.alloc(w*h*4);` by `new Uint8Array(w*h*4);`
* make index import 'pureimage.mjs' as module (as defined in package.json module)