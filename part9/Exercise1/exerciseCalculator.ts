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

interface ValuesAndTarget {
  values: number[];
  target: number;
}

const parseArguments = (args: string[]): ValuesAndTarget => {
  //   let arr = args.map((arg) => Number(arg));
  if (args.length <= 2)
    throw new Error(
      'Not enough arguments. Please enter exercise hour values to proceed.'
    );
  const argValues = args.slice(2);
  const nanArgs = argValues.filter((arg) => isNotNumber(arg));

  if (nanArgs.length > 0)
    throw new Error('Arguments not valid! Only numbers are allowed.');

  //   console.log(arr);
  return {
    values: argValues.slice(1).map((arg) => Number(arg)),
    target: Number(argValues[0]),
  };
};

const calculateExercises = (hours: number[], target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((hour) => hour != 0).length;
  const targetMetDays = hours.filter((hour) => hour >= target).length;
  const success = targetMetDays === periodLength;
  const successRate = targetMetDays / periodLength;
  //   console.log('Success Rate:', successRate);
  //   console.log('TP:', targetMetDays, periodLength);
  const rating = successRate < 0.34 ? 1 : successRate < 0.67 ? 2 : 3;
  const result = {
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
  const { values, target } = parseArguments(process.argv);
  console.log(calculateExercises(values, target));
} catch (error: unknown) {
  let errorMessage = 'Error:  ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
// console.log(values, target);
