import { UserProfile, DailyDiet, Meal, BodyCalculations } from '@/types/fitness';

interface MealsByType {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

const mealDatabase: Record<string, Record<string, MealsByType>> = {
  indian: {
    veg: {
      breakfast: [
        { name: 'Poha with Peanuts', calories: 350, protein: 12, carbs: 55, fats: 10, ingredients: ['Flattened rice', 'Peanuts', 'Onion', 'Curry leaves', 'Turmeric'] },
        { name: 'Besan Chilla with Curd', calories: 320, protein: 18, carbs: 35, fats: 12, ingredients: ['Gram flour', 'Onion', 'Tomato', 'Green chili', 'Greek yogurt'] },
        { name: 'Idli Sambar', calories: 300, protein: 10, carbs: 50, fats: 5, ingredients: ['Rice', 'Urad dal', 'Sambar', 'Coconut chutney'] },
        { name: 'Oats Upma', calories: 280, protein: 10, carbs: 45, fats: 8, ingredients: ['Oats', 'Vegetables', 'Mustard seeds', 'Curry leaves'] },
      ],
      lunch: [
        { name: 'Dal Rice with Sabzi', calories: 550, protein: 22, carbs: 80, fats: 15, ingredients: ['Brown rice', 'Toor dal', 'Mixed vegetables', 'Ghee', 'Spices'] },
        { name: 'Rajma Chawal', calories: 520, protein: 20, carbs: 75, fats: 12, ingredients: ['Kidney beans', 'Basmati rice', 'Onion', 'Tomato', 'Spices'] },
        { name: 'Chole with Roti', calories: 480, protein: 18, carbs: 65, fats: 14, ingredients: ['Chickpeas', 'Whole wheat roti', 'Onion', 'Spices'] },
        { name: 'Paneer Tikka with Quinoa', calories: 500, protein: 28, carbs: 45, fats: 22, ingredients: ['Paneer', 'Quinoa', 'Bell peppers', 'Yogurt marinade'] },
      ],
      dinner: [
        { name: 'Palak Paneer with Roti', calories: 450, protein: 22, carbs: 40, fats: 20, ingredients: ['Spinach', 'Paneer', 'Whole wheat roti', 'Cream', 'Spices'] },
        { name: 'Mixed Dal Khichdi', calories: 420, protein: 18, carbs: 60, fats: 10, ingredients: ['Rice', 'Mixed lentils', 'Vegetables', 'Ghee'] },
        { name: 'Vegetable Biryani', calories: 480, protein: 14, carbs: 70, fats: 15, ingredients: ['Basmati rice', 'Mixed vegetables', 'Biryani masala', 'Saffron'] },
      ],
    },
    non_veg: {
      breakfast: [
        { name: 'Egg Bhurji with Paratha', calories: 450, protein: 22, carbs: 40, fats: 22, ingredients: ['Eggs', 'Onion', 'Tomato', 'Whole wheat paratha'] },
        { name: 'Chicken Sandwich', calories: 400, protein: 30, carbs: 35, fats: 15, ingredients: ['Whole grain bread', 'Grilled chicken', 'Lettuce', 'Tomato'] },
        { name: 'Masala Omelette with Toast', calories: 380, protein: 24, carbs: 30, fats: 18, ingredients: ['Eggs', 'Onion', 'Green chili', 'Whole wheat toast'] },
      ],
      lunch: [
        { name: 'Chicken Curry with Rice', calories: 600, protein: 40, carbs: 65, fats: 18, ingredients: ['Chicken breast', 'Brown rice', 'Onion', 'Tomato', 'Spices'] },
        { name: 'Fish Fry with Roti', calories: 520, protein: 38, carbs: 45, fats: 20, ingredients: ['Fish fillet', 'Whole wheat roti', 'Spices', 'Lemon'] },
        { name: 'Egg Curry with Jeera Rice', calories: 480, protein: 24, carbs: 55, fats: 18, ingredients: ['Eggs', 'Basmati rice', 'Cumin', 'Gravy'] },
      ],
      dinner: [
        { name: 'Grilled Chicken with Salad', calories: 400, protein: 42, carbs: 15, fats: 18, ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Lemon'] },
        { name: 'Tandoori Fish with Vegetables', calories: 380, protein: 35, carbs: 20, fats: 16, ingredients: ['Fish', 'Yogurt marinade', 'Grilled vegetables'] },
        { name: 'Mutton Keema with Roti', calories: 500, protein: 35, carbs: 40, fats: 22, ingredients: ['Minced mutton', 'Whole wheat roti', 'Peas', 'Spices'] },
      ],
    },
  },
  western: {
    veg: {
      breakfast: [
        { name: 'Greek Yogurt Parfait', calories: 350, protein: 20, carbs: 45, fats: 10, ingredients: ['Greek yogurt', 'Granola', 'Mixed berries', 'Honey'] },
        { name: 'Avocado Toast with Eggs', calories: 400, protein: 18, carbs: 35, fats: 22, ingredients: ['Whole grain bread', 'Avocado', 'Poached eggs'] },
        { name: 'Protein Smoothie Bowl', calories: 380, protein: 25, carbs: 50, fats: 8, ingredients: ['Protein powder', 'Banana', 'Almond milk', 'Toppings'] },
      ],
      lunch: [
        { name: 'Quinoa Buddha Bowl', calories: 520, protein: 22, carbs: 65, fats: 18, ingredients: ['Quinoa', 'Chickpeas', 'Roasted vegetables', 'Tahini'] },
        { name: 'Mediterranean Salad', calories: 450, protein: 15, carbs: 40, fats: 25, ingredients: ['Mixed greens', 'Feta', 'Olives', 'Hummus'] },
        { name: 'Black Bean Burrito Bowl', calories: 550, protein: 20, carbs: 70, fats: 18, ingredients: ['Brown rice', 'Black beans', 'Salsa', 'Guacamole'] },
      ],
      dinner: [
        { name: 'Grilled Tofu Stir-fry', calories: 400, protein: 25, carbs: 35, fats: 18, ingredients: ['Tofu', 'Mixed vegetables', 'Brown rice', 'Soy sauce'] },
        { name: 'Pasta Primavera', calories: 480, protein: 18, carbs: 65, fats: 15, ingredients: ['Whole wheat pasta', 'Vegetables', 'Olive oil', 'Parmesan'] },
        { name: 'Stuffed Bell Peppers', calories: 420, protein: 20, carbs: 45, fats: 16, ingredients: ['Bell peppers', 'Quinoa', 'Black beans', 'Cheese'] },
      ],
    },
    non_veg: {
      breakfast: [
        { name: 'Eggs Benedict', calories: 480, protein: 28, carbs: 30, fats: 28, ingredients: ['English muffin', 'Poached eggs', 'Canadian bacon', 'Hollandaise'] },
        { name: 'Protein Pancakes', calories: 420, protein: 32, carbs: 45, fats: 12, ingredients: ['Protein powder', 'Oats', 'Eggs', 'Banana'] },
        { name: 'Smoked Salmon Bagel', calories: 450, protein: 25, carbs: 40, fats: 20, ingredients: ['Whole grain bagel', 'Smoked salmon', 'Cream cheese', 'Capers'] },
      ],
      lunch: [
        { name: 'Grilled Chicken Salad', calories: 480, protein: 42, carbs: 25, fats: 24, ingredients: ['Chicken breast', 'Mixed greens', 'Avocado', 'Olive oil dressing'] },
        { name: 'Turkey Wrap', calories: 450, protein: 35, carbs: 40, fats: 18, ingredients: ['Whole wheat wrap', 'Turkey breast', 'Vegetables', 'Hummus'] },
        { name: 'Tuna Poke Bowl', calories: 520, protein: 38, carbs: 55, fats: 16, ingredients: ['Sushi rice', 'Ahi tuna', 'Edamame', 'Sesame'] },
      ],
      dinner: [
        { name: 'Grilled Salmon with Asparagus', calories: 450, protein: 40, carbs: 15, fats: 26, ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Olive oil'] },
        { name: 'Lean Beef Stir-fry', calories: 480, protein: 38, carbs: 35, fats: 20, ingredients: ['Beef sirloin', 'Vegetables', 'Brown rice', 'Teriyaki'] },
        { name: 'Herb Roasted Chicken', calories: 420, protein: 45, carbs: 20, fats: 18, ingredients: ['Chicken thigh', 'Herbs', 'Roasted vegetables'] },
      ],
    },
  },
};

const snacks: Record<string, Meal[]> = {
  veg: [
    { name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fats: 16, ingredients: ['Almonds', 'Walnuts', 'Cashews'] },
    { name: 'Protein Shake', calories: 200, protein: 25, carbs: 10, fats: 5, ingredients: ['Whey protein', 'Milk', 'Banana'] },
    { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fats: 5, ingredients: ['Greek yogurt', 'Honey'] },
    { name: 'Fruit & Nut Bar', calories: 200, protein: 8, carbs: 25, fats: 10, ingredients: ['Dates', 'Nuts', 'Oats'] },
  ],
  non_veg: [
    { name: 'Boiled Eggs', calories: 140, protein: 12, carbs: 1, fats: 10, ingredients: ['Eggs'] },
    { name: 'Chicken Jerky', calories: 120, protein: 20, carbs: 5, fats: 2, ingredients: ['Dried chicken', 'Spices'] },
    { name: 'Tuna Salad Cup', calories: 160, protein: 22, carbs: 5, fats: 6, ingredients: ['Tuna', 'Light mayo', 'Celery'] },
  ],
};

const prePostWorkout: Record<string, { pre: Meal[]; post: Meal[] }> = {
  veg: {
    pre: [
      { name: 'Banana with Peanut Butter', calories: 250, protein: 8, carbs: 35, fats: 12, ingredients: ['Banana', 'Peanut butter'] },
      { name: 'Oatmeal with Honey', calories: 280, protein: 8, carbs: 50, fats: 6, ingredients: ['Oats', 'Honey', 'Milk'] },
    ],
    post: [
      { name: 'Protein Shake with Banana', calories: 300, protein: 30, carbs: 35, fats: 5, ingredients: ['Whey protein', 'Banana', 'Milk'] },
      { name: 'Chocolate Milk', calories: 220, protein: 10, carbs: 30, fats: 6, ingredients: ['Chocolate milk'] },
    ],
  },
  non_veg: {
    pre: [
      { name: 'Rice Cakes with Turkey', calories: 200, protein: 15, carbs: 25, fats: 4, ingredients: ['Rice cakes', 'Turkey slices'] },
      { name: 'Banana with Peanut Butter', calories: 250, protein: 8, carbs: 35, fats: 12, ingredients: ['Banana', 'Peanut butter'] },
    ],
    post: [
      { name: 'Chicken & Rice', calories: 400, protein: 35, carbs: 45, fats: 8, ingredients: ['Grilled chicken', 'White rice'] },
      { name: 'Protein Shake with Egg', calories: 320, protein: 35, carbs: 25, fats: 8, ingredients: ['Whey protein', 'Egg', 'Milk'] },
    ],
  },
};

const selectRandomMeal = (meals: Meal[]): Meal => {
  return meals[Math.floor(Math.random() * meals.length)];
};

export const generateDietPlan = (profile: UserProfile, calculations: BodyCalculations): DailyDiet => {
  const region = profile.dietPreference === 'indian' ? 'indian' : 'western';
  const dietType = profile.dietPreference === 'veg' || profile.dietPreference === 'vegan' ? 'veg' : 'non_veg';
  
  const meals = mealDatabase[region]?.[dietType] || mealDatabase.western.veg;
  const snackList = snacks[dietType] || snacks.veg;
  const workoutMeals = prePostWorkout[dietType] || prePostWorkout.veg;

  const breakfast = selectRandomMeal(meals.breakfast);
  const lunch = selectRandomMeal(meals.lunch);
  const dinner = selectRandomMeal(meals.dinner);
  const preWorkout = selectRandomMeal(workoutMeals.pre);
  const postWorkout = selectRandomMeal(workoutMeals.post);
  const selectedSnacks = [selectRandomMeal(snackList), selectRandomMeal(snackList)];

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories + 
    preWorkout.calories + postWorkout.calories + 
    selectedSnacks.reduce((sum, s) => sum + s.calories, 0);
  
  const totalProtein = breakfast.protein + lunch.protein + dinner.protein + 
    preWorkout.protein + postWorkout.protein + 
    selectedSnacks.reduce((sum, s) => sum + s.protein, 0);
  
  const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + 
    preWorkout.carbs + postWorkout.carbs + 
    selectedSnacks.reduce((sum, s) => sum + s.carbs, 0);
  
  const totalFats = breakfast.fats + lunch.fats + dinner.fats + 
    preWorkout.fats + postWorkout.fats + 
    selectedSnacks.reduce((sum, s) => sum + s.fats, 0);

  return {
    breakfast,
    lunch,
    dinner,
    preWorkout,
    postWorkout,
    snacks: selectedSnacks,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
  };
};
