'use strict';

// const Benchmark = (typeof window !== 'undefined' && window.Benchmark) || require('benchmark');
const Benchmark = require('benchmark');

const { fileHash } = require('./hash-worker');