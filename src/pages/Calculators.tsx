import { useState } from 'react';
import { useFitness } from '@/contexts/FitnessContext';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTDEE,
  calculateBodyFat,
  calculateIdealWeight,
  calculateMacros,
  calculateWaterIntake
} from '@/lib/calculators';
import { 
  Calculator, 
  Scale, 
  Flame, 
  Target,
  Droplets,
  Ruler,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CalculatorCard = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  color
}: {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: any;
  color: string;
}) => (
  <div className="glass-card p-5">
    <div className="flex items-start gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">
          {value}
          {unit && <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>}
        </p>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const Calculators = () => {
  const { userProfile, bodyCalculations } = useFitness();
  
  const [customValues, setCustomValues] = useState({
    weight: userProfile?.weight || 70,
    height: userProfile?.height || 170,
    age: userProfile?.age || 25,
    gender: userProfile?.gender || 'male',
    waist: 85,
    neck: 38,
    hip: 95,
    activityLevel: 'moderate',
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'custom'>('overview');

  const customBmi = calculateBMI(customValues.weight, customValues.height);
  const customBmr = calculateBMR(customValues.weight, customValues.height, customValues.age, customValues.gender);
  const customTdee = calculateTDEE(customBmr, customValues.activityLevel);
  const customBodyFat = calculateBodyFat(
    customValues.waist, 
    customValues.neck, 
    customValues.height, 
    customValues.gender,
    customValues.gender === 'female' ? customValues.hip : undefined
  );
  const customIdealWeight = calculateIdealWeight(customValues.height, customValues.gender);
  const customMacros = calculateMacros(customTdee, 'general_fitness', customValues.weight);
  const customWater = calculateWaterIntake(customValues.weight, customValues.activityLevel);

  const updateValue = (key: string, value: any) => {
    setCustomValues({ ...customValues, [key]: value });
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-primary';
    if (bmi < 30) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Body Calculators</h1>
          <p className="text-muted-foreground">Calculate your fitness metrics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            My Stats
          </Button>
          <Button
            variant={activeTab === 'custom' ? 'default' : 'outline'}
            onClick={() => setActiveTab('custom')}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Custom Calculator
          </Button>
        </div>

        {activeTab === 'overview' && bodyCalculations && (
          <div className="space-y-6">
            {/* BMI Section */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Body Mass Index (BMI)
              </h2>
              
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className={cn("text-5xl font-bold", getBMIColor(bodyCalculations.bmi))}>
                    {bodyCalculations.bmi}
                  </p>
                  <p className="text-muted-foreground">{bodyCalculations.bmiCategory}</p>
                </div>
                
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 w-[18.5%]" />
                    <div className="bg-primary w-[25%]" />
                    <div className="bg-amber-500 w-[18.5%]" />
                    <div className="bg-destructive flex-1" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Ideal weight range: {bodyCalculations.idealWeight.min} - {bodyCalculations.idealWeight.max} kg
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <CalculatorCard
                title="Basal Metabolic Rate"
                value={bodyCalculations.bmr}
                unit="kcal/day"
                subtitle="Calories burned at rest"
                icon={Flame}
                color="bg-accent/20 text-accent"
              />
              <CalculatorCard
                title="Total Daily Energy"
                value={bodyCalculations.tdee}
                unit="kcal/day"
                subtitle="Maintain current weight"
                icon={Activity}
                color="bg-primary/20 text-primary"
              />
              <CalculatorCard
                title="Estimated Body Fat"
                value={bodyCalculations.bodyFat}
                unit="%"
                subtitle="Based on BMI estimate"
                icon={Target}
                color="bg-amber-500/20 text-amber-500"
              />
              <CalculatorCard
                title="Daily Water Intake"
                value={bodyCalculations.dailyWater}
                unit="liters"
                subtitle="Stay hydrated!"
                icon={Droplets}
                color="bg-blue-500/20 text-blue-500"
              />
            </div>

            {/* Macros */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Daily Macronutrient Targets</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <p className="text-3xl font-bold text-primary">{bodyCalculations.dailyProtein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xs text-muted-foreground mt-1">2g per kg bodyweight</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <p className="text-3xl font-bold text-accent">{bodyCalculations.dailyCarbs}g</p>
                  <p className="text-sm text-muted-foreground">Carbohydrates</p>
                  <p className="text-xs text-muted-foreground mt-1">For energy</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-3xl font-bold">{bodyCalculations.dailyFats}g</p>
                  <p className="text-sm text-muted-foreground">Fats</p>
                  <p className="text-xs text-muted-foreground mt-1">25% of calories</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            {/* Input Form */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Enter Your Measurements</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={customValues.weight}
                    onChange={(e) => updateValue('weight', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={customValues.height}
                    onChange={(e) => updateValue('height', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={customValues.age}
                    onChange={(e) => updateValue('age', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {['male', 'female'].map((g) => (
                      <Button
                        key={g}
                        variant={customValues.gender === g ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateValue('gender', g)}
                        className="flex-1 capitalize"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Waist (cm) - for body fat</Label>
                  <Input
                    type="number"
                    value={customValues.waist}
                    onChange={(e) => updateValue('waist', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Neck (cm) - for body fat</Label>
                  <Input
                    type="number"
                    value={customValues.neck}
                    onChange={(e) => updateValue('neck', parseFloat(e.target.value))}
                  />
                </div>
                {customValues.gender === 'female' && (
                  <div className="space-y-2">
                    <Label>Hip (cm) - for body fat</Label>
                    <Input
                      type="number"
                      value={customValues.hip}
                      onChange={(e) => updateValue('hip', parseFloat(e.target.value))}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {['sedentary', 'light', 'moderate', 'active'].map((level) => (
                      <Button
                        key={level}
                        variant={customValues.activityLevel === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateValue('activityLevel', level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-4">
              <CalculatorCard
                title="Body Mass Index"
                value={customBmi}
                subtitle={getBMICategory(customBmi)}
                icon={Scale}
                color="bg-primary/20 text-primary"
              />
              <CalculatorCard
                title="Body Fat % (US Navy)"
                value={customBodyFat > 0 ? customBodyFat : 'N/A'}
                unit={customBodyFat > 0 ? '%' : ''}
                icon={Target}
                color="bg-amber-500/20 text-amber-500"
              />
              <CalculatorCard
                title="BMR"
                value={customBmr}
                unit="kcal/day"
                subtitle="Calories at rest"
                icon={Flame}
                color="bg-accent/20 text-accent"
              />
              <CalculatorCard
                title="TDEE"
                value={customTdee}
                unit="kcal/day"
                subtitle="Total daily energy"
                icon={Activity}
                color="bg-primary/20 text-primary"
              />
              <CalculatorCard
                title="Ideal Weight Range"
                value={`${customIdealWeight.min} - ${customIdealWeight.max}`}
                unit="kg"
                icon={Ruler}
                color="bg-blue-500/20 text-blue-500"
              />
              <CalculatorCard
                title="Daily Water"
                value={customWater}
                unit="liters"
                icon={Droplets}
                color="bg-cyan-500/20 text-cyan-500"
              />
            </div>

            {/* Macros */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Calculated Macros</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{customMacros.protein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <p className="text-2xl font-bold text-accent">{customMacros.carbs}g</p>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-2xl font-bold">{customMacros.fats}g</p>
                  <p className="text-sm text-muted-foreground">Fats</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Calculators;
