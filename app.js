const express = require('express');
const connectDB = require('./src/config/db.js');
const app = express();
const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('H!')
});

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});