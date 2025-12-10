import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExerciseVideo, getVideoUrl, getThumbnailUrl } from '@/lib/exerciseVideos';

interface ExerciseVideoModalProps {
  video: ExerciseVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseVideoModal = ({ video, isOpen, onClose }: ExerciseVideoModalProps) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg font-semibold">{video.exerciseName} Demo</DialogTitle>
          <p className="text-sm text-muted-foreground">{video.title} • {video.channel}</p>
        </DialogHeader>
        
        <div className="aspect-video w-full">
          <iframe
            src={`${getVideoUrl(video.youtubeId)}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="p-4 pt-2 flex justify-between items-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            Video by {video.channel}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Watch on YouTube
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface WatchDemoButtonProps {
  video: ExerciseVideo | null;
  onWatch: () => void;
  compact?: boolean;
}

export const WatchDemoButton = ({ video, onWatch, compact = false }: WatchDemoButtonProps) => {
  if (!video) return null;

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onWatch();
        }}
      >
        <Play className="w-3 h-3" />
        Demo
      </Button>
    );
  }

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onWatch();
      }}
      className="relative group overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-video w-full">
        <img
          src={getThumbnailUrl(video.youtubeId)}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-2 text-left">
        <p className="text-xs font-medium truncate">{video.title}</p>
        <p className="text-xs text-muted-foreground truncate">{video.channel}</p>
      </div>
    </motion.button>
  );
};
