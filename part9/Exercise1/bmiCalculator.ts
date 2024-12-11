export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);
  return bmi < 16
    ? 'Underweight (Severe thinness)'
    : bmi < 17
    ? 'Underweight (Moderate thinness)'
    : bmi < 18.5
    ? 'Underweight (Mild thinness)'
    : bmi < 25
    ? 'Normal range'
    : bmi < 30
    ? 'Overweight (Pre-obese)'
    : bmi < 35
    ? 'Obese (Class I)'
    : bmi < 40
    ? 'Obese (Class II)'
    : 'Obese (Class III)';
};

// console.log(require.main);

// if (require.main === module) {
console.log(calculateBmi(Number(process.argv[2]), Number(process.argv[3])));
// }
