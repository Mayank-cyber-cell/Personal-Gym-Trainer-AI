import { useFitness } from '@/contexts/FitnessContext';
import { Navigation } from '@/components/layout/Navigation';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TodayWorkout } from '@/components/dashboard/TodayWorkout';
import { MotivationCard } from '@/components/dashboard/MotivationCard';
import { 
  Scale, 
  Flame, 
  Droplets, 
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile, bodyCalculations, progressHistory } = useFitness();

  if (!userProfile || !bodyCalculations) {
    return null;
  }

  const todayProgress = progressHistory[progressHistory.length - 1];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      
      <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hey, <span className="gradient-text">{userProfile.name || 'Champion'}</span>!
          </h1>
          <p className="text-muted-foreground">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Weight"
            value={`${userProfile.weight} kg`}
            icon={Scale}
            variant="default"
            trend="down"
            trendValue="1.2 kg"
          />
          <StatCard
            title="Daily Calories"
            value={bodyCalculations.tdee}
            subtitle="TDEE target"
            icon={Flame}
            variant="accent"
          />
          <StatCard
            title="Water Goal"
            value={`${bodyCalculations.dailyWater}L`}
            subtitle="Stay hydrated"
            icon={Droplets}
            variant="primary"
          />
          <StatCard
            title="Body Fat"
            value={`${bodyCalculations.bodyFat}%`}
            icon={Target}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Workout - Takes 2 columns */}
          <div className="lg:col-span-2">
            <TodayWorkout />
          </div>

          {/* Motivation Card */}
          <div>
            <MotivationCard />
          </div>
        </div>

        {/* Macro Targets */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Daily Macro Targets</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-xl">
              <p className="text-2xl font-bold text-primary">{bodyCalculations.dailyProtein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-xl">
              <p className="text-2xl font-bold text-accent">{bodyCalculations.dailyCarbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold">{bodyCalculations.dailyFats}g</p>
              <p className="text-sm text-muted-foreground">Fats</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </main>
    </div>
  );
};

export default Dashboard;
