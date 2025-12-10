import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Dumbbell, 
  Utensils, 
  Calculator, 
  TrendingUp,
  Play,
  ChevronRight
} from 'lucide-react';

const actions = [
  {
    title: "Start Workout",
    description: "Begin today's training",
    icon: Play,
    path: "/workout",
    variant: "primary" as const,
  },
  {
    title: "View Diet Plan",
    description: "Check your meals",
    icon: Utensils,
    path: "/diet",
    variant: "accent" as const,
  },
  {
    title: "Track Progress",
    description: "Log your stats",
    icon: TrendingUp,
    path: "/progress",
    variant: "default" as const,
  },
  {
    title: "Body Calculators",
    description: "BMI, BMR & more",
    icon: Calculator,
    path: "/calculators",
    variant: "default" as const,
  },
];

export const QuickActions = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.path} to={action.path}>
              <div className="glass-card-hover p-4 flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  action.variant === 'primary' 
                    ? 'bg-primary text-primary-foreground' 
                    : action.variant === 'accent'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
