import { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import songs from '../songs';

export default function Queue() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    refreshQueue();
  }, []);

  const refreshQueue = async () => {
    const _tracks = await TrackPlayer.getQueue();
    setTracks(_tracks);
  };

  const addTracks = async () => {
    await TrackPlayer.add(songs);
    await refreshQueue();
  };

  return (
    <SafeAreaView>
      <Text>Tracks</Text>
      {tracks.map((track) => (
        <Text key={track.id}>
          - {track.title} ({track.artist})
        </Text>
      ))}

      <Button title="Add Tracks" onPress={addTracks} />
      <Button title="Refresh Tracks" onPress={() => refreshQueue()} />
    </SafeAreaView>
  );
}
