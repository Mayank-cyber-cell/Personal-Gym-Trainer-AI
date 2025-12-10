import { PostureFeedback } from '@/lib/postureAnalysis';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPanelProps {
  feedback: PostureFeedback[];
}

export const FeedbackPanel = ({ feedback }: FeedbackPanelProps) => {
  const getIcon = (severity: PostureFeedback['severity']) => {
    switch (severity) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStyles = (severity: PostureFeedback['severity']) => {
    switch (severity) {
      case 'good':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
      case 'warning':
        return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
    }
  };

  // Sort feedback: errors first, then warnings, then good
  const sortedFeedback = [...feedback].sort((a, b) => {
    const order = { error: 0, warning: 1, good: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Real-time Feedback</h3>
      
      <AnimatePresence mode="popLayout">
        {sortedFeedback.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-center py-8"
          >
            Start the camera to receive feedback
          </motion.div>
        ) : (
          sortedFeedback.map((item, index) => (
            <motion.div
              key={`${item.bodyPart}-${item.severity}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                getStyles(item.severity)
              )}
            >
              <span className="flex-shrink-0 mt-0.5">
                {getIcon(item.severity)}
              </span>
              <div>
                <p className="font-medium capitalize">{item.bodyPart}</p>
                <p className="text-sm opacity-90">{item.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Summary */}
      {feedback.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Form Score</span>
            <span className="font-bold text-primary">
              {Math.round(
                (feedback.filter(f => f.severity === 'good').length / feedback.length) * 100
              )}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(feedback.filter(f => f.severity === 'good').length / feedback.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
