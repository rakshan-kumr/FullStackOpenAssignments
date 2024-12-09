import express from 'express';

const app = express();

app.get('/hello', (_res, req) => {
  req.send('Hello Full Stack!');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
