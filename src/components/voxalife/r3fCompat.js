import * as THREE from 'three';

// The Base44 Vite plugin adds `data-source-location` and `data-dynamic-content`
// attributes to every JSX element, including R3F elements (<mesh>, <material>, etc.).
// R3F's diffProps splits these by "-" into ["data","source","location"] and traverses
// instance.data.source.location — which throws because three.js objects have no `data`.
// This patch adds a `data` getter to three.js prototypes that returns a deep proxy,
// making the traversal a harmless no-op.

const deepProxy = new Proxy(function () {}, {
  get() { return deepProxy; },
  apply() { return deepProxy; },
  construct() { return deepProxy; },
});

const protoNames = ['Object3D', 'Material', 'BufferGeometry', 'Light', 'Texture', 'BufferAttribute'];
for (const name of protoNames) {
  if (THREE[name]?.prototype) {
    Object.defineProperty(THREE[name].prototype, 'data', {
      get() { return deepProxy; },
      configurable: true,
    });
  }
}
