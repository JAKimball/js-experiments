'use strict';

// const Benchmark = (typeof window !== 'undefined' && window.Benchmark) || require('benchmark');
const Benchmark = require('benchmark');

const { fileHash } = require('./hash-worker');

let testFile = '';

function benchHashFunctions() {
  const suite = new Benchmark.Suite({
    onError(event) {
      console.error(event.target.error);
    },
  });

  suite
    .add('sha512', function () {
    fileHash()
  })
}



