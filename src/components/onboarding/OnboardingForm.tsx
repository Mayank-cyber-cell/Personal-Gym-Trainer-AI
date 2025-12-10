import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/fitness';
import { useFitness } from '@/contexts/FitnessContext';
import { 
  User, 
  Ruler, 
  Scale, 
  Target, 
  Dumbbell, 
  Home, 
  Utensils,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'body', title: 'Body Stats', icon: Scale },
  { id: 'goals', title: 'Fitness Goals', icon: Target },
  { id: 'equipment', title: 'Equipment', icon: Dumbbell },
  { id: 'diet', title: 'Diet Preference', icon: Utensils },
];

export const OnboardingForm = () => {
  const { completeOnboarding } = useFitness();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    fitnessGoal: 'general_fitness',
    experienceLevel: 'beginner',
    equipment: 'gym',
    dietPreference: 'non_veg',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(formData as UserProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const SelectCard = ({ 
    selected, 
    onClick, 
    icon: Icon, 
    title, 
    description 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    icon: any; 
    title: string; 
    description?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-4 text-left transition-all duration-300 w-full",
        selected 
          ? "border-primary bg-primary/10" 
          : "hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </button>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="h-12 bg-card border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={14}
                max={100}
                value={formData.age}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                className="h-12 bg-card border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => updateField('gender', gender)}
                    className={cn(
                      "glass-card p-3 text-center capitalize transition-all",
                      formData.gender === gender 
                        ? "border-primary bg-primary/10" 
                        : "hover:border-primary/30"
                    )}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Body Stats
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Height (cm)
              </Label>
              <Input
                type="number"
                min={100}
                max={250}
                value={formData.height}
                onChange={(e) => updateField('height', parseInt(e.target.value))}
                className="h-12 bg-card border-border"
              />
              <p className="text-sm text-muted-foreground">
                That's {((formData.height || 170) / 30.48).toFixed(1)} feet
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Weight (kg)
              </Label>
              <Input
                type="number"
                min={30}
                max={300}
                value={formData.weight}
                onChange={(e) => updateField('weight', parseInt(e.target.value))}
                className="h-12 bg-card border-border"
              />
              <p className="text-sm text-muted-foreground">
                That's {((formData.weight || 70) * 2.205).toFixed(0)} lbs
              </p>
            </div>
          </div>
        );

      case 2: // Fitness Goals
        return (
          <div className="space-y-4">
            <SelectCard
              selected={formData.fitnessGoal === 'fat_loss'}
              onClick={() => updateField('fitnessGoal', 'fat_loss')}
              icon={Target}
              title="Fat Loss"
              description="Burn fat and get lean"
            />
            <SelectCard
              selected={formData.fitnessGoal === 'muscle_gain'}
              onClick={() => updateField('fitnessGoal', 'muscle_gain')}
              icon={Dumbbell}
              title="Muscle Gain"
              description="Build muscle mass"
            />
            <SelectCard
              selected={formData.fitnessGoal === 'strength'}
              onClick={() => updateField('fitnessGoal', 'strength')}
              icon={Target}
              title="Strength"
              description="Get stronger overall"
            />
            <SelectCard
              selected={formData.fitnessGoal === 'general_fitness'}
              onClick={() => updateField('fitnessGoal', 'general_fitness')}
              icon={Sparkles}
              title="General Fitness"
              description="Stay healthy and active"
            />

            <div className="pt-4">
              <Label className="mb-3 block">Experience Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateField('experienceLevel', level)}
                    className={cn(
                      "glass-card p-3 text-center capitalize transition-all text-sm",
                      formData.experienceLevel === level 
                        ? "border-primary bg-primary/10" 
                        : "hover:border-primary/30"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Equipment
        return (
          <div className="space-y-4">
            <SelectCard
              selected={formData.equipment === 'gym'}
              onClick={() => updateField('equipment', 'gym')}
              icon={Dumbbell}
              title="Full Gym Access"
              description="Barbells, machines, cables"
            />
            <SelectCard
              selected={formData.equipment === 'home'}
              onClick={() => updateField('equipment', 'home')}
              icon={Home}
              title="Home Equipment"
              description="Dumbbells, bands, pull-up bar"
            />
            <SelectCard
              selected={formData.equipment === 'none'}
              onClick={() => updateField('equipment', 'none')}
              icon={User}
              title="No Equipment"
              description="Bodyweight exercises only"
            />
          </div>
        );

      case 4: // Diet Preference
        return (
          <div className="space-y-4">
            <SelectCard
              selected={formData.dietPreference === 'non_veg'}
              onClick={() => updateField('dietPreference', 'non_veg')}
              icon={Utensils}
              title="Non-Vegetarian"
              description="Includes meat, fish, eggs"
            />
            <SelectCard
              selected={formData.dietPreference === 'veg'}
              onClick={() => updateField('dietPreference', 'veg')}
              icon={Utensils}
              title="Vegetarian"
              description="No meat, includes dairy & eggs"
            />
            <SelectCard
              selected={formData.dietPreference === 'vegan'}
              onClick={() => updateField('dietPreference', 'vegan')}
              icon={Utensils}
              title="Vegan"
              description="Plant-based only"
            />
            <SelectCard
              selected={formData.dietPreference === 'indian'}
              onClick={() => updateField('dietPreference', 'indian')}
              icon={Utensils}
              title="Indian Cuisine"
              description="Traditional Indian meals"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="pt-8 pb-4 px-6">
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full transition-all",
                  index === currentStep 
                    ? "bg-primary/20 text-primary" 
                    : index < currentStep 
                      ? "text-primary/60" 
                      : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {index === currentStep && (
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-8">
              {currentStep === 0 && "Let's get to know you better"}
              {currentStep === 1 && "Help us calculate your needs"}
              {currentStep === 2 && "What do you want to achieve?"}
              {currentStep === 3 && "What do you have access to?"}
              {currentStep === 4 && "What's your food preference?"}
            </p>
            
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pb-8">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            variant="hero"
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                Generate My Plan
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
