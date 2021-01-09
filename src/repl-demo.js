'use strict';
const net = require('net');
const repl = require('repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
  useGlobal: true
});

// net.createServer((socket) => {
//   connections += 1;
//   repl.start({
//     prompt: 'Node.js via Unix socket> ',
//     input: socket,
//     output: socket,
//     useGlobal: true
//   }).on('exit', () => {
//     socket.end();
//   });
// }).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
    useGlobal: true
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);