// @ts-check
'use strict';

const {
  Worker,
  isMainThread
} = require('worker_threads');
const crypto = require('crypto');
const fs = require('fs');

if (isMainThread) {
  // This re-loads the current file inside a Worker instance.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread); // Prints 'false'.
}

/**
 * Calculate hash of file synchronously. 
 * 
 * @param {fs.PathLike} filename
 * @param {any} algorithm
 */
const fileHash = (filename, algorithm) => {
  const hash = crypto.createHash(algorithm || 'sha512');
  const input = fs.createReadStream(filename);
  let buf = {};  // TODO: Resume here! fix this so it can work!
  input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read();
    if (data)
      hash.update(data);
    else {
      buf = hash.digest();
      // console.log(buf.toString('hex'));
      // console.log(`${buf.toString('hex', 0, 1)}/${encodeURIComponent(buf.toString('base64', 1))}`);
    }
  });

}


