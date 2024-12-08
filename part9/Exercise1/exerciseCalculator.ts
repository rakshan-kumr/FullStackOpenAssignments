import { isNotNumber } from './utils';

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: string[]): any => {
  //   let arr = args.map((arg) => Number(arg));
  if (args.length <= 2)
    throw new Error(
      'Not enough arguments. Please enter exercise hour values to proceed.'
    );
  let argValues = args.slice(2);
  let nanArgs = argValues.filter((arg) => isNotNumber(arg));

  if (nanArgs.length > 0)
    throw new Error('Arguments not valid! Only numbers are allowed.');

  //   console.log(arr);
  return {
    values: argValues.slice(1).map((arg) => Number(arg)),
    target: Number(argValues[0]),
  };
};

const calculateExercises = (hours: number[], target: number): Result => {
  let periodLength = hours.length;
  let trainingDays = hours.filter((hour) => hour != 0).length;
  let targetMetDays = hours.filter((hour) => hour >= target).length;
  let success = targetMetDays === periodLength;
  let successRate = targetMetDays / periodLength;
  //   console.log('Success Rate:', successRate);
  //   console.log('TP:', targetMetDays, periodLength);
  let rating = successRate < 0.34 ? 1 : successRate < 0.67 ? 2 : 3;
  let result = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription:
      rating === 3
        ? 'Good work!'
        : rating === 2
        ? 'Not bad!'
        : 'Needs improvement',
    target,
    average: hours.reduce((a, b) => a + b) / hours.length,
  };
  return result;
};

// console.log(process.argv);
try {
  let { values, target } = parseArguments(process.argv);
  console.log(calculateExercises(values, target));
} catch (error: unknown) {
  let errorMessage = 'Error:  ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
// console.log(values, target);
