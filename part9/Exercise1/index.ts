import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (isNaN(weight) || isNaN(height)) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
  }
  res.send({
    weight,
    height,
    bmi: calculateBmi(Number(height), Number(weight)),
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
