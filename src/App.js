import { useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';
import MusicPlayer from './components/Player';
import Queue from './components/Queue';

export default function App() {
  useEffect(() => {
    setupPlayer();

    return async () => {
      await TrackPlayer.stop();
    };
  }, []);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer({
      backBuffer: 50,
      maxCacheSize: 500,
    });

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],

      stopWithApp: true,
      forwardJumpInterval: 30,
      backwardJumpInterval: 15,
    });
  };

  return <Queue />;
}
