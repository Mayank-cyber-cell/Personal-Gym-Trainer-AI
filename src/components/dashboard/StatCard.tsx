import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'accent';
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
}: StatCardProps) => {
  return (
    <div className="glass-card-hover p-5 relative overflow-hidden group">
      {/* Background Glow */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        variant === 'primary' && "bg-primary",
        variant === 'accent' && "bg-accent",
        variant === 'default' && "bg-foreground"
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            variant === 'primary' && "bg-primary/20 text-primary",
            variant === 'accent' && "bg-accent/20 text-accent",
            variant === 'default' && "bg-muted text-muted-foreground"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          {trend && trendValue && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend === 'up' && "bg-primary/20 text-primary",
              trend === 'down' && "bg-destructive/20 text-destructive",
              trend === 'neutral' && "bg-muted text-muted-foreground"
            )}>
              {trend === 'up' && '↑'}{trend === 'down' && '↓'} {trendValue}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className={cn(
          "text-2xl font-bold",
          variant === 'primary' && "gradient-text",
          variant === 'accent' && "gradient-text-accent"
        )}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
