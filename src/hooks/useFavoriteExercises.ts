import { useState, useEffect, useCallback } from 'react';
import { ExerciseVideo } from '@/lib/exerciseVideos';

const STORAGE_KEY = 'fitforge-favorite-exercises';

export interface FavoriteExercise {
  id: string;
  video: ExerciseVideo;
  addedAt: Date;
}

export const useFavoriteExercises = () => {
  const [favorites, setFavorites] = useState<FavoriteExercise[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed.map((f: any) => ({
          ...f,
          addedAt: new Date(f.addedAt)
        })));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((video: ExerciseVideo) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === video.exerciseId)) {
        return prev;
      }
      return [...prev, {
        id: video.exerciseId,
        video,
        addedAt: new Date()
      }];
    });
  }, []);

  const removeFavorite = useCallback((exerciseId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== exerciseId));
  }, []);

  const toggleFavorite = useCallback((video: ExerciseVideo) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === video.exerciseId);
      if (exists) {
        return prev.filter(f => f.id !== video.exerciseId);
      }
      return [...prev, {
        id: video.exerciseId,
        video,
        addedAt: new Date()
      }];
    });
  }, []);

  const isFavorite = useCallback((exerciseId: string) => {
    return favorites.some(f => f.id === exerciseId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};
