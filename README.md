# MutablePromise
Wrapper for Promise.  Resolvable, rejectable, redirectable. 

## Import

install
```
npm i mutable-promise -S
```
```
yarn add mutable-promise
```

import
```mjs
import MutablePromise from 'mutable-promise';
```
```js
const MutablePromise = require('mutable-promise');
```

CDN
```html
<script type="module">
    import MutablePromise from 'https://cdn.jsdelivr.net/npm/mutable-promise@1.0.0/dist/mutable-promise.esm.min.js';
</script>
```
```html
<script src="https://cdn.jsdelivr.net/npm/mutable-promise@1.0.0/dist/mutable-promise.min.js"></script>
```

## Example

```js
let p;
// can use like a native `Promise`
p = new MutablePromise((resolve, reject)=>setTimeout(reject,1000));
// can get status
console.log(p.status); // "pending"
// can resolve outside
p.then(anything=>console.log(anything)); // 'resolve called' 
p.resolve('resolve called');
console.log(p.status); // "fulfilled"
p = new MutablePromise(resolve=>setTimeout(resolve,1000));
// can reject outside
p.catch(anything=>console.log(anything)); // 'reject called'
p.reject('reject called');
console.log(p.status); // "rejected"
// Allow setting no arguments, define a `innerPromise` later
p = new MutablePromise();
p.then(anything=>console.log(anything));
p.innerPromise = new Promise(resolve=>resolve('msg from later define innerPromise'));
// Can change task by change `innerPromise`
p = new MutablePromise(resolve=>setTimeout(()=>{resolve('original task')},1000));
p.then(anything=>console.log(anything)); // 'new task'
// Can also use a `MutablePromise` as `innerPromise`
p.innerPromise = new MutablePromise(resolve=>setTimeout(()=>{resolve('new task')},2000));
```
