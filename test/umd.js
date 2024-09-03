const MutablePromise = require('../dist/index.js');

console.log('================test umd================');

let p, p2000;

p = new MutablePromise((rs,rj)=>{
    setTimeout(()=>{
        rs();
        console.log(`time: 500, p status: ${p.status}, p2000 status: ${p2000.status}`);
    }, 500);
});

p2000 = p.task = new MutablePromise((rs,rj)=>{
    setTimeout(()=>{
        rs();
        console.log(`time: 2000, p status: ${p.status}, p2000 status: ${p2000.status}`);
    }, 2000);
});

(async()=>{
    await p;
    console.log(`p: wait done, p status: ${p.status}, p2000 status: ${p2000.status}`);
})();

setTimeout(()=>{
    p.resolve();
    console.log(`time: 1000, p status: ${p.status}, p2000 status: ${p2000.status}`);
},1000);

setTimeout(()=>{
    p.reject();
    console.log('p: call reject after resolved.');
    p2000.reject();
    console.log('p2000: call reject before resolved.');
    console.log(`time: 1500, p status: ${p.status}, p2000 status: ${p2000.status}`);
},1500);

