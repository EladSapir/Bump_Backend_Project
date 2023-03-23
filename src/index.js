import express from 'express';

const PORT = process.env.PORT || 5000;
const app = express();
app.get('/', (req, res) => {
  console.log('Got a request');
  res.send('<h1>tomertomertomer</h1>');
  return res;
});

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
