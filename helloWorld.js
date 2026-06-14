// const http = require('http');

// http.createServer((req, res) => {
//   res.end('Hello World');
// }).listen(3000);

// console.log('Open http://localhost:3000');  

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});