import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  console.log('Got a request');
  res.send(JSON.stringify('<h3>Hi From Backend API</h3>'));
  return res;
});

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
