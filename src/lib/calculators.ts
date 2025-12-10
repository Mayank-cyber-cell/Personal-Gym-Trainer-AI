import { UserProfile, BodyCalculations } from '@/types/fitness';

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: string
): number => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

export const calculateBodyFat = (
  waist: number,
  neck: number,
  height: number,
  gender: string,
  hip?: number
): number => {
  // US Navy Method
  if (gender === 'male') {
    return Number(
      (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1)
    );
  }
  if (hip) {
    return Number(
      (495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450).toFixed(1)
    );
  }
  return 0;
};

export const calculateIdealWeight = (height: number, gender: string): { min: number; max: number } => {
  const heightInMeters = height / 100;
  const minBMI = 18.5;
  const maxBMI = 24.9;
  
  return {
    min: Math.round(minBMI * heightInMeters * heightInMeters),
    max: Math.round(maxBMI * heightInMeters * heightInMeters),
  };
};

export const calculateMacros = (
  tdee: number,
  goal: string,
  weight: number
): { protein: number; carbs: number; fats: number } => {
  let calories = tdee;
  
  switch (goal) {
    case 'fat_loss':
      calories = tdee - 500;
      break;
    case 'muscle_gain':
      calories = tdee + 300;
      break;
    case 'strength':
      calories = tdee + 200;
      break;
    default:
      calories = tdee;
  }

  // Protein: 2g per kg body weight
  const protein = Math.round(weight * 2);
  const proteinCalories = protein * 4;

  // Fats: 25% of calories
  const fatCalories = calories * 0.25;
  const fats = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return { protein, carbs, fats };
};

export const calculateWaterIntake = (weight: number, activityLevel: string = 'moderate'): number => {
  // Base: 35ml per kg
  let baseWater = weight * 35;
  
  // Add for activity
  const activityBonus: Record<string, number> = {
    sedentary: 0,
    light: 300,
    moderate: 500,
    active: 700,
    very_active: 1000,
  };
  
  return Math.round((baseWater + (activityBonus[activityLevel] || 500)) / 1000 * 10) / 10; // in liters
};

export const calculateBodyMetrics = (profile: UserProfile): BodyCalculations => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  
  const activityMap: Record<string, string> = {
    beginner: 'light',
    intermediate: 'moderate',
    advanced: 'active',
  };
  
  const tdee = calculateTDEE(bmr, activityMap[profile.experienceLevel] || 'moderate');
  const macros = calculateMacros(tdee, profile.fitnessGoal, profile.weight);
  
  // Estimated body fat based on BMI (rough estimate)
  const bodyFat = profile.gender === 'male'
    ? Math.round((1.20 * bmi) + (0.23 * profile.age) - 16.2)
    : Math.round((1.20 * bmi) + (0.23 * profile.age) - 5.4);

  return {
    bmi,
    bmiCategory: getBMICategory(bmi),
    bmr,
    tdee,
    bodyFat: Math.max(5, Math.min(50, bodyFat)),
    idealWeight: calculateIdealWeight(profile.height, profile.gender),
    dailyProtein: macros.protein,
    dailyCarbs: macros.carbs,
    dailyFats: macros.fats,
    dailyWater: calculateWaterIntake(profile.weight),
  };
};
