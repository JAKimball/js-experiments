'use strict';

// const Benchmark = (typeof window !== 'undefined' && window.Benchmark) || require('benchmark');
const Benchmark = require('benchmark');

const {
  fileHash
} = require('./hash-worker');

let testFile = '';

function benchHashFunctions() {
  const suite = new Benchmark.Suite({
    onError(event) {
      console.error(event.target.error);
    },
  });

  suite
    .add('sha1', function() {
      fileHash(testFile, 'sha1')
    })
    .add('sha256', function() {
      fileHash(testFile, 'sha256')
    })
    .add('sha512', function() {
      fileHash(testFile, 'sha512')
    })
    .add('blake2b512', function() {
      fileHash(testFile, 'blake2b512')
    })
    .on('cycle', function(event) {
      console.log(event.target.toString());
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run();
}

testFile = process.argv[2];
benchHashFunctions();