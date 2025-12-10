import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FavoriteExercise } from '@/hooks/useFavoriteExercises';
import { ExerciseVideo, getThumbnailUrl } from '@/lib/exerciseVideos';
import { cn } from '@/lib/utils';

interface FavoriteExercisesProps {
  favorites: FavoriteExercise[];
  onRemove: (exerciseId: string) => void;
  onWatch: (video: ExerciseVideo) => void;
}

export const FavoriteExercises = ({ favorites, onRemove, onWatch }: FavoriteExercisesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (favorites.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <h3 className="font-semibold">Favorite Demos</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {favorites.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <button
                    onClick={() => onWatch(favorite.video)}
                    className="relative w-full overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="relative aspect-video w-full">
                      <img
                        src={getThumbnailUrl(favorite.video.youtubeId)}
                        alt={favorite.video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Play className="w-3 h-3 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2 text-left">
                      <p className="text-xs font-medium truncate">{favorite.video.exerciseName}</p>
                    </div>
                  </button>
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(favorite.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export const FavoriteButton = ({ isFavorite, onToggle, size = 'sm' }: FavoriteButtonProps) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "rounded-full flex items-center justify-center transition-colors",
        size === 'sm' ? "w-7 h-7" : "w-9 h-9",
        isFavorite 
          ? "bg-red-500/20 text-red-500" 
          : "bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
      )}
    >
      <Heart 
        className={cn(
          size === 'sm' ? "w-4 h-4" : "w-5 h-5",
          isFavorite && "fill-current"
        )} 
      />
    </motion.button>
  );
};
