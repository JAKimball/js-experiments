// From https://rfrn.org/~shu/2013/03/20/two-reasons-functional-style-is-slow-in-spidermonkey.html
'use strict'

import { parse, stringify, validate } from 'uuid'

function benchmark2D(n: number, iters: number, f: <T extends number[][]>(twoD: T) => void) {
  const outer = []
  // var outer = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    const inner = []
    for (let j = 0; j < n; j++)
      inner.push(Math.random() * 100)
    // inner[j] = Math.random() * 100;
    outer.push(inner)
    // console.log(outer[outer.length-1].length)
  }
  // var start = Date.now();
  console.time(f.name)
  for (let i = 0; i < iters; i++)
    f(outer)
  // return Date.now() - start;
  console.timeEnd(f.name)
}

function forLoop(outer: number[][]) {
  let max = -Infinity
  for (let i = 0; i < outer.length; i++) {
    const inner = outer[i]
    for (let j = 0; j < inner.length; j++) {
      const v = inner[j]
      if (v > max)
        max = v
    }
  }
}

function forLenLoop(outer: number[][]) {
  let max = -Infinity
  for (let i = 0, oLen = outer.length; i < oLen; i++) {
    const inner = outer[i]
    for (let j = 0, iLen = inner.length; j < iLen; j++) {
      const v = inner[j]
      if (v > max)
        max = v
    }
  }
}

function forLetLoop(outer: number[][]) {
  let max = -Infinity
  for (let i = 0; i < outer.length; i++) {
    const inner = outer[i]
    for (let j = 0; j < inner.length; j++) {
      const v = inner[j]
      if (v > max)
        max = v
    }
  }
}

function forLetLenLoop(outer: number[][]) {
  let max = -Infinity
  for (let i = 0, len = outer.length; i < len; i++) {
    const inner = outer[i]
    for (let j = 0, len = inner.length; j < len; j++) {
      const v = inner[j]
      if (v > max)
        max = v
    }
  }
}

function arrayForEach(outer: number[][]) {
  let max = -Infinity
  outer.forEach(function (inner: number[]) {
    inner.forEach(function (v: number) {
      if (v > max)
        max = v
    })
  })
}

function loopBenchmarks() {
  benchmark2D(50, 500000, arrayForEach)
  benchmark2D(50, 500000, forLoop)
  benchmark2D(50, 500000, forLenLoop)
  benchmark2D(50, 500000, forLetLoop)
  benchmark2D(50, 500000, forLetLenLoop)
}

// loopBenchmarks()

/****************************************************************************** */

function makeBox() {
  const catState = 'Awake'
  // var dogState = 'Sleeping';

  function _eval(str: string) {
    return eval(str)
  }

  // function getDogState() {
  //   return dogState;
  // }

  return {
    eval: _eval,
    // getDogState,
  }
}

const makeEs6Box = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
  let catState = 'Awake'
  // eslint-disable-next-line prefer-const
  let dogState = 'Sleeping'

  const _eval = (str: string) => eval(str)

  const getDogState = () => dogState

  return {
    eval: _eval,
    getDogState,
  }
}

/*************************************************************
 * Quokka Scratchpad...
 *
 * With the Quokka.js Visual Studio Code Extension installed,
 * press Ctrl/Cmd + Shift + P to display the editor’s command
 * palette, and then type "Quokka" to see the list of the
 * available commands.
 * Select and run the "Start on Current File" command.
 */

const boxes = Array.from({ length: 10 }, () => {
  const box = makeEs6Box()
  return {
    ...box,
    setCatState: box.eval('state => catState = state') as (state: unknown) => void,
    addCatState: box.eval('state => catState += state') as (state: unknown) => void,
  }
})

boxes

console.log(boxes[0].eval('catState'))
console.log(boxes[1].eval('catState'))

boxes[0].setCatState('Warm')
boxes[1].setCatState('Fuzzy')
boxes[1].addCatState('-Wuzzy')
boxes[2].setCatState(2)
boxes[2].addCatState(4)

console.log(boxes[0].eval('catState'))
console.log(boxes[1].eval('catState'))
console.log(boxes[2].eval('catState'))

console.log(boxes.map(box => box.eval('catState')))

console.log(boxes[1].getDogState())
console.log(boxes[0].setCatState)

let a = 1
let b = 2

a; b;
[a, b] = [b, a]
a; b

/***************************************************** */

function benchmark(iters: number, f: <T extends unknown[], R = unknown>(...args: T) => R, ...rest: unknown[]) {
  const benchName = `${f.name}`
  console.time(benchName)

  for (let i = 0; i < iters; i++) {
    f(...rest)
  }

  console.timeEnd(benchName)
}

const src = new Uint8Array(1024 * 1024)
const dst = new Uint8Array(1024 * 1024)

const src64 = new Float64Array(src.buffer)
const dst64 = new Float64Array(dst.buffer)

for (let i = 0, len = src.length; i < len; i++) {
  src[i] = (Math.random() * 0x100) & 0xff
}

function copy(src: Uint8Array | Float64Array, dst: Uint8Array | Float64Array) {
  const len = src.length < dst.length ? src.length : dst.length
  for (let i = 0; i < len; i++) {
    dst[i] = src[i]
  }
}

function copyWhile(src: Uint8Array | Float64Array, dst: Uint8Array | Float64Array) {
  const len = src.length < dst.length ? src.length : dst.length
  let i = 0
  while (i < len) {
    dst[i] = src[i]
    i++
  }
}

function copyUint8() {
  copy(src, dst)
}

function copyFloat64() {
  copy(src64, dst64)
}

function fastCopy(src: Uint8Array | Float64Array, dst: Uint8Array | Float64Array) {
  dst.set(src)
}

function benchmarkX2(iters: number, f: any, ...rest: (any)[]) {
  benchmark(iters, f, ...rest)
  benchmark(iters, f, ...rest)
}

export function allCopyBenchmarks() {
  benchmarkX2(1e3, copyUint8)
  benchmarkX2(1e3, copyWhile, src, dst)
  benchmarkX2(1e3, copyUint8)
  benchmarkX2(1e3, copyFloat64)
  benchmarkX2(1e3, copyUint8)
  benchmarkX2(1e3, fastCopy, src, dst)
  benchmarkX2(1e3, copyUint8)
  benchmarkX2(1e3, fastCopy, src64, dst64)
  benchmarkX2(1e3, copyUint8)
}

// benchmarkX2(1e3, fastCopy, src, dst);
// benchmarkX2(1e3, copyUint8);

/***************************************************** */

const nodeParseRegEx = /-/g

function nodeParse(uuidStr: string) {
  if (!validate(uuidStr)) {
    throw TypeError('Invalid UUID')
  }

  // const buf = Buffer.from(uuidStr.replace(nodeParseRegEx, ''), 'hex');
  const buf = Buffer.from(`${uuidStr.slice(0, 8)}${uuidStr.slice(9, 13)}${uuidStr.slice(14, 18)}${uuidStr.slice(19, 23)}${uuidStr.slice(24, 36)}`, 'hex')
  // const buf = Buffer.from("" + uuidStr.slice(0, 8) + uuidStr.slice(9, 13) + uuidStr.slice(14, 18) + uuidStr.slice(19, 23) + uuidStr.slice(24, 36), 'hex');

  const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.length)

  return arr
}

function browserParse(uuidStr: string) {
  if (!validate(uuidStr)) {
    throw TypeError('Invalid UUID')
  }

  const arr = new Uint8Array(16)
  const view = new DataView(arr.buffer)

  // Parse ########-....-....-....-............
  view.setUint32(0, parseInt(uuidStr.slice(0, 8), 16))

  // Parse ........-####-####-....-............
  view.setUint32(4, (parseInt(uuidStr.slice(9, 13), 16) << 16) | parseInt(uuidStr.slice(14, 18), 16))
  // view.setUint32(4, +`0x${uuidStr.slice(9, 13)}${uuidStr.slice(14, 18)}`);

  // Parse ........-....-....-####-####........
  const n = parseInt(uuidStr.slice(24, 36), 16)
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  view.setUint32(8, (parseInt(uuidStr.slice(19, 23), 16) << 16) | (n / 0x100000000 & 0xffff))
  // view.setUint32(8, +`0x${uuidStr.slice(19, 23)}${uuidStr.slice(24, 28)}`);

  // Parse ........-....-....-....-....########
  view.setUint32(12, n & 0xffffffff)

  return arr
}

const littleEndian = (function () {
  const int32Array = new Int32Array(1)
  int32Array[0] = 1
  return new Int8Array(int32Array.buffer)[0] === 1
})()

littleEndian

function browserParse2(uuidStr: string) {
  if (!validate(uuidStr)) {
    throw TypeError('Invalid UUID')
  }

  const arr = new Uint8Array(16)
  const arr32 = new Uint32Array(arr.buffer)

  let offset = 0
  let stepBy = 1
  if (littleEndian) {
    offset = 3
    stepBy = -1
  }

  // Parse ########-....-....-....-............
  arr32[offset] = parseInt(uuidStr.slice(0, 8), 16)

  // Parse ........-####-####-....-............
  arr32[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16)

  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16)
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  arr32[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff)

  // Parse ........-....-....-....-....nnnnnnnn
  arr32[offset + (stepBy * 3)] = n & 0xffffffff

  if (littleEndian) arr.reverse()

  return arr
}

const _arr = new Uint8Array(16)
const _arr32 = new Uint32Array(_arr.buffer)

function browserParse3(uuidStr: string) {
  if (!validate(uuidStr)) {
    throw TypeError('Invalid UUID')
  }

  let offset = 0
  let stepBy = 1
  if (littleEndian) {
    offset = 3
    stepBy = -1
  }

  // Parse ########-....-....-....-............
  _arr32[offset] = parseInt(uuidStr.slice(0, 8), 16)

  // Parse ........-####-####-....-............
  _arr32[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16)

  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16)
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  _arr32[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff)

  // Parse ........-....-....-....-....nnnnnnnn
  _arr32[offset + (stepBy * 3)] = n & 0xffffffff

  // Copy from pre-allocated array
  const arr = new Uint8Array(_arr)

  if (littleEndian) arr.reverse()

  return arr
}

// const _uuidPoolLength = 1;
const _uuidPoolLength = 8192 / 16
let _PoolIndex = _uuidPoolLength
const _uuid8Size = 16
const _uuid32Size = 4
let _arr32Pool = new Uint32Array(_uuid32Size * _uuidPoolLength)

function browserParse4(uuidStr: string) {
  if (!validate(uuidStr)) {
    throw TypeError('Invalid UUID')
  }

  // Try sub-allocating a larger buffer
  _PoolIndex++
  if (_PoolIndex >= _uuidPoolLength) {
    _arr32Pool = new Uint32Array(_uuid32Size * _uuidPoolLength)
    _PoolIndex = 0
  }

  let offset = 0
  let stepBy = 1
  if (littleEndian) {
    offset = 3
    stepBy = -1
  }

  offset += (_PoolIndex * _uuid32Size)

  // Parse ########-....-....-....-............
  _arr32Pool[offset] = parseInt(uuidStr.slice(0, 8), 16)

  // Parse ........-####-####-....-............
  _arr32Pool[offset + stepBy] = parseInt(uuidStr.slice(9, 13), 16) << 16 | parseInt(uuidStr.slice(14, 18), 16)

  // Parse ........-....-....-####-nnnn........
  const n = parseInt(uuidStr.slice(24, 36), 16)
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
  _arr32Pool[offset + (stepBy * 2)] = parseInt(uuidStr.slice(19, 23), 16) << 16 | (n / 0x100000000 & 0xffff)

  // Parse ........-....-....-....-....nnnnnnnn
  _arr32Pool[offset + (stepBy * 3)] = n & 0xffffffff

  // Reference pooled array
  const arr = new Uint8Array(_arr32Pool.buffer, _PoolIndex * _uuid8Size, _uuid8Size)

  if (littleEndian) arr.reverse()

  return arr
}

function uuidBenchmarks() {
  let testUuid = '50d21d57-12d7-4319-8558-ef29f69e4d51'
  let testParse = stringify(nodeParse(testUuid))
  console.log(testParse)
  testParse = stringify(browserParse(testUuid))
  console.log(testParse)
  testParse = stringify(browserParse2(testUuid))
  console.log(testParse)
  testParse = stringify(browserParse3(testUuid))
  console.log(testParse)
  testParse = stringify(browserParse4(testUuid))

  testUuid = '82f83510-3cd4-11eb-9426-2fb3003bc7e9'
  const testParse2 = stringify(browserParse4(testUuid))
  const testParse3 = stringify(browserParse4(testUuid))
  const testParse4 = stringify(browserParse4(testUuid))
  console.log(testParse2)
  console.log(testParse3)
  console.log(testParse4)

  benchmarkX2(1e6, browserParse4, testUuid)
  benchmarkX2(1e6, parse, testUuid)
  benchmarkX2(1e6, nodeParse, testUuid)
  benchmarkX2(1e6, browserParse, testUuid)
  benchmarkX2(1e6, browserParse2, testUuid)
  benchmarkX2(1e6, browserParse3, testUuid)
}

/***************************************************** */


/**
 *
 *
 * @param {() => void} cb
 * @param {number} startInterval
 * @param {number} factor
 * @param {number} limit
 */
async function pinger(cb: () => void, startInterval: number, factor: number, limit: number) {
  let delay = startInterval

  while (delay > limit) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), delay))
    cb()
    delay *= factor
  }
}

/**
 *
 *
 * @param {string} label
 * @param {() => void} cb
 * @param {number} startInterval
 * @param {number} factor
 * @param {number} limit
 */
async function timePinger(label: string, cb: () => void, startInterval: number, factor: number, limit: number) {
  console.time(label)
  await pinger(cb, startInterval, factor, limit)
  console.timeEnd(label)
}

function startPingers() {
  timePinger('ping', () => console.log('ping'), 50000, 0.9, 10)
  timePinger('pong', () => console.log('     pong'), 51000, 0.9, 10)
  timePinger('zip', () => console.log('          zip'), 52000, 0.9, 10)
  timePinger('zoom!', () => console.log('              zoom!'), 53000, 0.9, 10)
}

// uuidBenchmarks();
// allCopyBenchmarks();

// const repl = require('repl');
// startPingers();
// export default module.exports = { org: src, dst, src64, dst64, makeBox, makeEs6Box };
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
console.log(process.versions)

const daysDelta = (date1: Date, date2: Date) => {
  const timeDelta = Math.abs(date2.getTime() - date1.getTime())
  const daysDelta = Math.ceil(timeDelta / (1000 * 60 * 60 * 24))
  return daysDelta
}

// Test daysDelta
const date1 = new Date('2020-12-01')
const date2 = new Date('2020-12-31')
const date3 = new Date('2020-12-31')
const date4 = new Date('2021-01-01')
const date5 = new Date('2021-01-02')
const date6 = new Date('2021-01-03')
const date7 = new Date('2021-01-04')
const date8 = new Date('2021-01-05')

console.log(daysDelta(date1, date2))
console.log(daysDelta(date2, date3))
console.log(daysDelta(date3, date4))
console.log(daysDelta(date4, date5))
console.log(daysDelta(date5, date6))
console.log(daysDelta(date6, date7))
console.log(daysDelta(date7, date8))
console.log(daysDelta(date8, date1))

