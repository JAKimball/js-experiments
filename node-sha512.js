#!/usr/bin/env node
// @ts-check

// Source: https://nodejs.org/dist/latest-v14.x/docs/api/crypto.html

'use strict'

const filename = process.argv[2];
import { createHash } from 'crypto';
import { createReadStream } from 'fs';


/**
 * Calculate hash of file synchronously. 
 * 
 * @param {import('fs').PathLike} filename
 */
const fileHash = (filename) => {

  // const hash = crypto.createHash('sha256');
  // const hash = crypto.createHash('sha512');
  const hash = createHash('blake2b512');
  // const hash = crypto.createHash('sha1');

  const input = createReadStream(filename, { highWaterMark: 512 * 1024 });
  let maxLen = 0;
  input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read();
    if (data) {
      // console.time('hash');
      if (data.length > maxLen) { maxLen = data.length };
      hash.update(data);
      // console.timeEnd('hash');
    } else {
      const buf = hash.digest();
      console.log(`read buffer size: ${maxLen}`)
      console.log(buf.toString('hex'));
      console.log(`${buf.toString('hex', 0, 1)}/${encodeURIComponent(buf.toString('base64', 1))}`);
    }
  });

}

fileHash(filename);
console.log('reading...');
