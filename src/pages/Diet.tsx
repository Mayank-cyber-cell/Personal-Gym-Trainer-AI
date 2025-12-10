import { useFitness } from '@/contexts/FitnessContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Flame,
  Beef,
  Wheat,
  Droplets,
  Coffee,
  Sun,
  Moon,
  Dumbbell,
  Cookie,
  ShoppingCart
} from 'lucide-react';
import { Meal } from '@/types/fitness';
import { cn } from '@/lib/utils';

const MealCard = ({ 
  meal, 
  title, 
  icon: Icon,
  iconColor 
}: { 
  meal: Meal; 
  title: string;
  icon: any;
  iconColor: string;
}) => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="font-semibold text-lg">{meal.name}</h3>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary">{meal.calories}</p>
          <p className="text-xs text-muted-foreground">kcal</p>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-primary">{meal.protein}g</p>
          <p className="text-xs text-muted-foreground">Protein</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold text-accent">{meal.carbs}g</p>
          <p className="text-xs text-muted-foreground">Carbs</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold">{meal.fats}g</p>
          <p className="text-xs text-muted-foreground">Fats</p>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Ingredients:</p>
        <div className="flex flex-wrap gap-1">
          {meal.ingredients.map((ingredient, i) => (
            <span 
              key={i}
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Diet = () => {
  const { dietPlan, bodyCalculations, regenerateDietPlan } = useFitness();

  if (!dietPlan || !bodyCalculations) {
    return null;
  }

  const allIngredients = [
    ...dietPlan.breakfast.ingredients,
    ...dietPlan.lunch.ingredients,
    ...dietPlan.dinner.ingredients,
    ...dietPlan.preWorkout.ingredients,
    ...dietPlan.postWorkout.ingredients,
    ...dietPlan.snacks.flatMap(s => s.ingredients),
  ];
  
  const uniqueIngredients = [...new Set(allIngredients)];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Diet Plan</h1>
            <p className="text-muted-foreground">Your personalized nutrition</p>
          </div>
          <Button variant="outline" onClick={regenerateDietPlan}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>

        {/* Daily Summary */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-semibold mb-4">Daily Nutrition Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
              <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{dietPlan.totalCalories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="text-xs text-primary mt-1">Target: {bodyCalculations.tdee}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
              <Beef className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{dietPlan.totalProtein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
              <p className="text-xs text-primary mt-1">Target: {bodyCalculations.dailyProtein}g</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl">
              <Wheat className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{dietPlan.totalCarbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
              <p className="text-xs text-accent mt-1">Target: {bodyCalculations.dailyCarbs}g</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <Droplets className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold">{dietPlan.totalFats}g</p>
              <p className="text-sm text-muted-foreground">Fats</p>
              <p className="text-xs text-muted-foreground mt-1">Target: {bodyCalculations.dailyFats}g</p>
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <MealCard 
            meal={dietPlan.breakfast} 
            title="Breakfast"
            icon={Coffee}
            iconColor="bg-amber-500/20 text-amber-500"
          />
          <MealCard 
            meal={dietPlan.preWorkout} 
            title="Pre-Workout"
            icon={Dumbbell}
            iconColor="bg-primary/20 text-primary"
          />
          <MealCard 
            meal={dietPlan.lunch} 
            title="Lunch"
            icon={Sun}
            iconColor="bg-orange-500/20 text-orange-500"
          />
          <MealCard 
            meal={dietPlan.postWorkout} 
            title="Post-Workout"
            icon={Dumbbell}
            iconColor="bg-accent/20 text-accent"
          />
          <MealCard 
            meal={dietPlan.dinner} 
            title="Dinner"
            icon={Moon}
            iconColor="bg-indigo-500/20 text-indigo-500"
          />
          <div className="glass-card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-pink-500/20 text-pink-500">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Snacks</p>
                <h3 className="font-semibold text-lg">Healthy Options</h3>
              </div>
            </div>
            <div className="space-y-3">
              {dietPlan.snacks.map((snack, i) => (
                <div key={i} className="flex justify-between items-center bg-muted/50 rounded-lg p-3">
                  <span className="font-medium">{snack.name}</span>
                  <span className="text-sm text-muted-foreground">{snack.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shopping List */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Shopping List</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueIngredients.map((ingredient, i) => (
              <span 
                key={i}
                className="bg-muted px-3 py-1.5 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diet;
