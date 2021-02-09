// @ts-check
'use strict';

import {
  Worker,
  isMainThread
} from 'worker_threads';
import crypto from 'crypto';
import fs from 'fs';

// if (isMainThread) {
//   // This re-loads the current file inside a Worker instance.
//   new Worker(__filename);
// } else {
//   console.log('Inside Worker!');
//   console.log(isMainThread); // Prints 'false'.
// }

/**
 * Calculate hash of file synchronously. 
 * 
 * @param {fs.PathLike} filename
 * @param {any} algorithm
 */
export const fileHash = (filename, algorithm) => {
  const hash = crypto.createHash(algorithm || 'sha512');
  const input = fs.createReadStream(filename);
  let digest = {};  // TODO: Resume here! fix this so it can work!
  input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read();
    if (data)
      hash.update(data);
    else {
      digest = hash.digest();
      input.close();
      // console.log(buf.toString('hex'));
      // console.log(`${buf.toString('hex', 0, 1)}/${encodeURIComponent(buf.toString('base64', 1))}`);
    }
  });

}

// module.exports = { fileHash };



