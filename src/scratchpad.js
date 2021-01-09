// From https://rfrn.org/~shu/2013/03/20/two-reasons-functional-style-is-slow-in-spidermonkey.html
'use strict';

const uuid = require('uuid');

function benchmark2D(n, iters, f) {
  var outer = [];
  // var outer = new Int32Array(n);
  for (var i = 0; i < n; i++) {
    var inner = [];
    for (var j = 0; j < n; j++)
      inner.push(Math.random() * 100)
      // inner[j] = Math.random() * 100;
    outer.push(inner);
    // console.log(outer[outer.length-1].length)
  }
  // var start = Date.now();
  console.time(f.name);
  for (var i = 0; i < iters; i++)
    f(outer);
  // return Date.now() - start;
  console.timeEnd(f.name);
}

function forLoop(outer) {
  var max = -Infinity;
  for (var i = 0; i < outer.length; i++) {
    var inner = outer[i];
    for (var j = 0; j < inner.length; j++) {
      var v = inner[j];
      if (v > max)
        max = v;
    }
  }
}

function forLenLoop(outer) {
  var max = -Infinity;
  for (var i = 0, oLen = outer.length; i < oLen; i++) {
    var inner = outer[i];
    for (var j = 0, iLen = inner.length; j < iLen; j++) {
      var v = inner[j];
      if (v > max)
        max = v;
    }
  }
}

function forLetLoop(outer) {
  var max = -Infinity;
  for (let i = 0; i < outer.length; i++) {
    var inner = outer[i];
    for (let j = 0; j < inner.length; j++) {
      var v = inner[j];
      if (v > max)
        max = v;
    }
  }
}

function forLetLenLoop(outer) {
  var max = -Infinity;
  for (let i = 0, len = outer.length; i < len; i++) {
    var inner = outer[i];
    for (let j = 0, len = inner.length; j < len; j++) {
      var v = inner[j];
      if (v > max)
        max = v;
    }
  }
}

function arrayForEach(outer) {
  var max = -Infinity;
  outer.forEach(function(inner) {
    inner.forEach(function(v) {
      if (v > max)
        max = v;
    });
  });
}

function loopBenchmarks() {
  benchmark2D(50, 500000, arrayForEach);
  benchmark2D(50, 500000, forLoop);
  benchmark2D(50, 500000, forLenLoop);
  benchmark2D(50, 500000, forLetLoop);
  benchmark2D(50, 500000, forLetLenLoop);
}

/****************************************************************************** */

function makeBox() {
  var catState = 'Awake';
  // var dogState = 'Sleeping';

  function _eval(str) {
    return eval(str);
  }

  // function getDogState() {
  //   return dogState;
  // }

  return {
    eval: _eval,
    // getDogState,
  };
}

let makeEs6Box = () => {
  let catState = 'Awake';
  let dogState = 'Sleeping';

  const _eval = str => eval(str);

  const getDogState = () => dogState;

  return {
    eval: _eval,
    getDogState,
  };
}

/***************************************************** */

function benchmark(iters, f, ...rest) {
  let benchName = `${f.name}`;
  console.time(benchName);

  for (let i = 0; i < iters; i++) {
    f(...rest); 
  }

  console.timeEnd(benchName);
}

let src = new Uint8Array(1024 * 1024);
let dst = new Uint8Array(1024 * 1024);

let src64 = new Float64Array(src.buffer);
let dst64 = new Float64Array(dst.buffer);

for (let i = 0, len = src.length; i < len; i++) {
  src[i] = (Math.random() * 0x100) & 0xff;
}

function copy(src, dst) {
  let len = src.length < dst.length ? src.length : dst.length;
  for (let i = 0; i < len; i++) {
    dst[i] = src[i];
  }
}

function copyWhile(src, dst) {
  let len = src.length < dst.length ? src.length : dst.length;
  let i = 0;
  while (i < len) {
    dst[i] = src[i];
    i++;
  }
}

function copyUint8() {
  copy(src, dst);
}

function copyFloat64() {
  copy(src64, dst64);
}

function fastCopy(src, dst) {
  dst.set(src);
}

function benchmarkX2(iters, f, ...rest) {
  benchmark(iters, f, ...rest);
  benchmark(iters, f, ...rest);
}

function allCopyBenchmarks() {
  benchmarkX2(1e3, copyUint8);
  benchmarkX2(1e3, copyWhile, src, dst)
  benchmarkX2(1e3, copyUint8);
  benchmarkX2(1e3, copyFloat64);
  benchmarkX2(1e3, copyUint8);
  benchmarkX2(1e3, fastCopy, src, dst);
  benchmarkX2(1e3, copyUint8);
  benchmarkX2(1e3, fastCopy, src64, dst64);
  benchmarkX2(1e3, copyUint8);
}

/***************************************************** */

const nodeParseRegEx = /-/g;

function nodeParse(uuidStr) {
  if (!uuid.validate(uuidStr)) {
    throw TypeError('Invalid UUID');
  }

  // const buf = Buffer.from(uuidStr.replace(nodeParseRegEx, ''), 'hex');
  const buf = Buffer.from(`${uuidStr.slice(0, 8)}${uuidStr.slice(9, 13)}${uuidStr.slice(14, 18)}${uuidStr.slice(19, 23)}${uuidStr.slice(24, 36)}`, 'hex');
  // const buf = Buffer.from("" + uuidStr.slice(0, 8) + uuidStr.slice(9, 13) + uuidStr.slice(14, 18) + uuidStr.slice(19, 23) + uuidStr.slice(24, 36), 'hex');

  const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.length); 

  return arr;
}

function browserParse(uuidStr) {
  if (!uuid.validate(uuidStr)) {
    throw TypeError('Invalid UUID');
  }

  const arr = new Uint8Array(16);
  const view = new DataView(arr.buffer);

  // Parse ########-....-....-....-............
  view.setUint32(0, parseInt(uuidStr.slice(0, 8), 16));

  // Parse ........-####-####-....-............
  view.setUint32(4, (parseInt(uuidStr.slice(9, 13), 16) << 16) | parseInt(uuidStr.slice(14, 18), 16));
  // view.setUint32(4, +`0x${uuidStr.slice(9, 13)}${uuidStr.slice(14, 18)}`);

  // Parse ........-....-....-####-####........
  const n = parseInt(uuidStr.slice(24, 36), 16);
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  view.setUint32(8, (parseInt(uuidStr.slice(19, 23), 16) << 16) | (n / 0x100000000 & 0xffff));
  // view.setUint32(8, +`0x${uuidStr.slice(19, 23)}${uuidStr.slice(24, 28)}`);

  // Parse ........-....-....-....-....########
  view.setUint32(12, n & 0xffffffff);

  return arr;
}

const littleEndian = (function () {
  const int32Array = new Int32Array(1);
  int32Array[0] = 1;
  return new Int8Array(int32Array.buffer)[0] === 1;
})();

function browserParse2(uuidStr) {
  if (!uuid.validate(uuidStr)) {
    throw TypeError('Invalid UUID');
  }

  const arr = new Uint8Array(16);
  const arr32 = new Uint32Array(arr.buffer);

  let offset = 0;
  let stepBy = 1;
  if (littleEndian) {
    offset = 3;
    stepBy = -1;
  }

  // Parse ########-....-....-....-............
  arr32[offset] = parseInt(uuidStr.slice(0, 8), 16);

  // Parse ........-####-####-....-............
  arr32[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16);
  
  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16);
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  arr32[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff);

  // Parse ........-....-....-....-....nnnnnnnn
  arr32[offset + (stepBy * 3)] = n & 0xffffffff;

  if (littleEndian) arr.reverse();

  return arr;
}

const _arr = new Uint8Array(16)
const _arr32 = new Uint32Array(_arr.buffer);

function browserParse3(uuidStr) {
  if (!uuid.validate(uuidStr)) {
    throw TypeError('Invalid UUID');
  }

  let offset = 0;
  let stepBy = 1;
  if (littleEndian) {
    offset = 3;
    stepBy = -1;
  }

  // Parse ########-....-....-....-............
  _arr32[offset] = parseInt(uuidStr.slice(0, 8), 16);

  // Parse ........-####-####-....-............
  _arr32[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16);
  
  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16);
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  _arr32[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff);

  // Parse ........-....-....-....-....nnnnnnnn
  _arr32[offset + (stepBy * 3)] = n & 0xffffffff;

  // Copy from pre-allocated array
  const arr = new Uint8Array(_arr);

  if (littleEndian) arr.reverse();

  return arr;
}

// const _uuidPoolLength = 1;
const _uuidPoolLength = 8192 / 16;
let _PoolIndex = _uuidPoolLength;
const _uuid8Size = 16;
const _uuid32Size = 4;
let _arr32Pool = new Uint32Array(_uuid32Size * _uuidPoolLength);

function browserParse4(uuidStr) {
  if (!uuid.validate(uuidStr)) {
    throw TypeError('Invalid UUID');
  }
  
  // Try sub-allocating a larger buffer
  _PoolIndex++;
  if (_PoolIndex >= _uuidPoolLength) {
    _arr32Pool = new Uint32Array(_uuid32Size * _uuidPoolLength);
    _PoolIndex = 0;
  }

  let offset = 0;
  let stepBy = 1;
  if (littleEndian) {
    offset = 3;
    stepBy = -1;
  }

  offset += (_PoolIndex * _uuid32Size);

  // Parse ########-....-....-....-............
  _arr32Pool[offset] = parseInt(uuidStr.slice(0, 8), 16);

  // Parse ........-####-####-....-............
  _arr32Pool[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16);

  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16);
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  _arr32Pool[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff);

  // Parse ........-....-....-....-....nnnnnnnn
  _arr32Pool[offset + (stepBy * 3)] = n & 0xffffffff;

  // Reference pooled array
  const arr = new Uint8Array(_arr32Pool.buffer, _PoolIndex * _uuid8Size, _uuid8Size);

  if (littleEndian) arr.reverse();

  return arr;
}

function uuidBenchmarks() {
  let testUuid = '50d21d57-12d7-4319-8558-ef29f69e4d51';
  let testParse = uuid.stringify(nodeParse(testUuid));
  console.log(testParse);
  testParse = uuid.stringify(browserParse(testUuid));
  console.log(testParse);
  testParse = uuid.stringify(browserParse2(testUuid));
  console.log(testParse);
  testParse = uuid.stringify(browserParse3(testUuid));
  console.log(testParse);
  testParse = uuid.stringify(browserParse4(testUuid));
  
  testUuid = '82f83510-3cd4-11eb-9426-2fb3003bc7e9';
  let testParse2 = uuid.stringify(browserParse4(testUuid));
  let testParse3 = uuid.stringify(browserParse4(testUuid));
  let testParse4 = uuid.stringify(browserParse4(testUuid));
  console.log(testParse2);
  console.log(testParse3);
  console.log(testParse4);
  
  benchmarkX2(1e6, browserParse4, testUuid);
  benchmarkX2(1e6, uuid.parse, testUuid);
  benchmarkX2(1e6, nodeParse, testUuid);
  benchmarkX2(1e6, browserParse, testUuid);
  benchmarkX2(1e6, browserParse2, testUuid);
  benchmarkX2(1e6, browserParse3, testUuid);
}

/***************************************************** */

/**
 * 
 *
 * @param {*} cb
 * @param {*} startInterval
 * @param {*} factor
 * @param {*} limit
 */
async function pinger(cb, startInterval, factor, limit) {
  let delay = startInterval;

  while (delay > limit) {
    await new Promise((resolve) => setTimeout(() => resolve(), delay));
    cb();
    delay *= factor;
  }
}

async function timePinger(label, ...args) {
  console.time(label);
  await pinger(...args);
  console.timeEnd(label);
}

function startPingers() {
  timePinger('ping', () => console.log('ping'), 50000, 0.9, 10);
  timePinger('pong', () => console.log('     pong'), 51000, 0.9, 10);
  timePinger('zip', () => console.log('          zip'), 52000, 0.9, 10);
  timePinger('spazz!', () => console.log('              spazz!'), 53000, 0.9, 10);
}

uuidBenchmarks();

// const repl = require('repl');

// module.exports = { org: src, dst, src64, dst64, makeBox, makeEs6Box };
// let replSvr = repl.start();
// let context = replSvr.context;
// context.src = src;
// context.dst = dst;
// context.src64 = src64;
// context.dst64 = dst64;
// context.loopBenchmarks = loopBenchmarks;
// context.benchmark = benchmark;
// context.allCopyBenchmarks = allCopyBenchmarks;
// context.makeBox = makeBox;
// context.makeEs6Box = makeEs6Box;
// context.pinger = pinger;
// context.startPingers = startPingers;
// context.uuidBenchmarks = uuidBenchmarks;



//   ...replSvr.context,
//   org, dst, org64, dst64, makeBox, makeEs6Box
// };
