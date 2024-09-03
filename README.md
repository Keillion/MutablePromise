# MutablePromise

Wrapper for Promise. Resolvable, rejectable, redirectable. 

<br>

## Import

<br>

install
```
npm i mutable-promise -S
```
```
yarn add mutable-promise
```

<br>

import
```mjs
import MutablePromise from 'mutable-promise';
```
```js
const MutablePromise = require('mutable-promise');
```

<br>

CDN
```html
<script type="module">
    import MutablePromise from 'https://cdn.jsdelivr.net/npm/mutable-promise@1.1.14/dist/index.esm.min.js';
</script>
```
```html
<script src="https://cdn.jsdelivr.net/npm/mutable-promise@1.1.14/dist/index.min.js"></script>
```

## Example

<br>

`resolve` outside of the executor.
Get `status` of the `promise`.
```js
// can use like a native `Promise`
let p = new MutablePromise((_, rj)=>setTimeout(rj,100)); // try to reject after 100ms

// can get status
console.log(p.status); // "pending"
console.log(p.isPending); // true

// can resolve outside
p.then(anything=>console.log(anything)); // 'resolve called' 
p.resolve('resolve called'); // resolve immediately
console.log(p.status); // "fulfilled"
console.log(p.isFulfilled); // true

(async()=>{
    await new Promise(rs=>setTimeout(rs,200)); // wait 200ms

    // status will not change after `fulfilled` or `rejected`
    console.log(p.status); // "fulfilled"
    console.log(p.isFulfilled); // true
})();
```

<br>

`reject` outside of the executor.
```js
let p = new MutablePromise(rs=>setTimeout(rs,100)); // try to resolve after 100ms

// can reject outside
p.catch(anything=>console.log(anything)); // 'reject called'
p.reject('reject called'); // reject immediately
console.log(p.status); // "rejected"
console.log(p.isRejected); // true
```

<br>

Allow setting a `promise` as argument.
```js
// simple promise
new MutablePromise(Promise.resolve('1'));
// typical promise
let nativeP = new Promise(rs=>setTimeout(rs,200));
new MutablePromise(nativeP);
// wrapper a fetch
new MutablePromise(fetch('./'));
// nested MutablePromise
let p = new MutablePromise(rs=>setTimeout(rs,200));
new MutablePromise(p);
// promise like
let pLike = { then: function(){ return 'a'; } };
new MutablePromise(pLike);
```

<br>

Allow setting no argument or `null`. Then define a `task` later.
```js
let p = new MutablePromise(); // or `new MutablePromise(null)`
p.then(anything=>console.log(anything)); // 'msg from later define task'
// The property `task` can accept the same parameter type as the constructor of `MutablePromise`
p.task = rs=>rs('msg from later define task');
```

<br>

Can change `task` before `fulfilled` or `rejected`.
```js
let p = new MutablePromise(rs=>setTimeout(()=>{rs('original task')},100));
p.then(anything=>console.log(anything)); // 'new task'
p.task = new MutablePromise(rs=>setTimeout(()=>{rs('new task')},200));
```

<br>

A change make no sense after `fulfilled` or `rejected`.
```js
let p = new MutablePromise(Promise.resolve('resolved'));
p.then(anything=>console.log(anything)); // 'resolved'

(async()=>{
    // wait next js event loop
    await new Promise(rs=>setTimeout(rs,0));

    console.log(p.status); // "fulfilled"
    p.catch(anything=>console.log(anything)); // will not log anything
    p.task = Promise.reject('make no sense');
    
    await new Promise(rs=>setTimeout(rs,0));
    p.task = (rs)=>{
        console.log('function still run after `fulfilled` or `rejected`');
        rs('but will not resolve or reject');
    };
})();
```

<br>

Set `task` as `null` can cancel the orignial task.
```js
let p = new MutablePromise(resolve=>setTimeout(()=>{
    console.log('the executor will run anyway');
    resolve('original task');
},100));
p.then(anything=>console.log(anything)); // will not log anything
p.task = null;
// the promise will keep `pending`
setTimeout(()=>{
    console.log(p.status);
},200)
// you can define a new `task` later
```

<br>

If a `MutablePromise` has been `fulfilled` or `rejected`, you can define a new `MutablePromise` instead.
```js
(async()=>{
    let p = new MutablePromise(Promise.resolve());
    await new Promise(rs=>setTimeout(rs,0)); // wait next js event loop
    console.log(p.status); // "fulfilled"
    
    p = new MutablePromise(resolve=>setTimeout(()=>{resolve('you can define a new `MutablePromise` instead')},100));
    p.then(anything=>console.log(anything));
})();
```

## TODO

Maybe need to wrap other promise function like `all`, `resolve`, `race` and so on, to `MutablePromise` edition.
