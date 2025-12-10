import { useState, useEffect } from 'react';
import { getDailyQuote } from '@/lib/motivationEngine';
import { MotivationalQuote } from '@/types/fitness';
import { RefreshCw, Sparkles, Laugh, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MotivationCard = () => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [quoteType, setQuoteType] = useState<'inspiring' | 'funny' | 'savage'>('inspiring');

  useEffect(() => {
    setQuote(getDailyQuote(quoteType));
  }, [quoteType]);

  const refreshQuote = () => {
    setQuote(getDailyQuote(quoteType));
  };

  const typeIcons = {
    inspiring: Sparkles,
    funny: Laugh,
    savage: Flame,
  };

  const Icon = typeIcons[quoteType];

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={cn(
              "w-5 h-5",
              quoteType === 'inspiring' && "text-primary",
              quoteType === 'funny' && "text-yellow-500",
              quoteType === 'savage' && "text-accent"
            )} />
            <h3 className="font-semibold">Daily Motivation</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={refreshQuote}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {quote && (
          <blockquote className="text-lg font-medium mb-4 leading-relaxed">
            "{quote.quote}"
          </blockquote>
        )}

        <div className="flex gap-2">
          {(['inspiring', 'funny', 'savage'] as const).map((type) => {
            const TypeIcon = typeIcons[type];
            return (
              <Button
                key={type}
                variant={quoteType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuoteType(type)}
                className="capitalize"
              >
                <TypeIcon className="w-4 h-4 mr-1" />
                {type}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
