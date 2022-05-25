const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('good');
  res.send('good');
});

app.listen(80, "0.0.0.0", () => {
  console.log('running on port 5555');
});
