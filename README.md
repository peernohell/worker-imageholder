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