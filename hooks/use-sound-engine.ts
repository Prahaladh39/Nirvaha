import { useCallback, useState } from 'react';

export function useSoundEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.75);

  const play = useCallback((trackTitle: string) => {
    setCurrentTrack(trackTitle);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, nextVolume)));
  }, []);

  return {
    play,
    stop,
    isPlaying,
    currentTrack,
    volume,
    setVolume,
  };
}
