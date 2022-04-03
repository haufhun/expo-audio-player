import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  useProgress,
  useTrackPlayerEvents,
  Event,
  State,
} from 'react-native-track-player';

import songs from '../songs';

const { width, height } = Dimensions.get('window');

const prettifyTime = (time) => {
  time = Math.round(time);

  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
};

const MusicPlayer = () => {
  const progress = useProgress();

  const [playerState, setPlayerState] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [songIndex, setSongIndex] = useState(0);

  const songSlider = useRef(null);

  const addTracks = async () => {
    await TrackPlayer.add(songs);
  };

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setSongIndex(index);
    });

    addTracks();

    return async () => {
      scrollX.removeAllListeners();
    };
  }, []);

  useTrackPlayerEvents([Event.PlaybackState], (event) => {
    console.log(event);

    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
    }
  });

  const isLoading = !playerState || playerState === State.Connecting || playerState === 'loading';
  const isPlaying = playerState === State.Playing;

  useEffect(() => {
    TrackPlayer.skip(songIndex);
  }, [songIndex]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipForward = async () => {
    await TrackPlayer.seekTo(progress.position + 30);
  };

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();

    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();

    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.artworkWrapper}>
          <Image source={item.artwork} style={styles.artworkImage} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={{ width: width }}>
          <Animated.FlatList
            ref={songSlider}
            data={songs}
            renderItem={renderSongs}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          />
        </View>

        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>

        <View>
          {/* <Slider
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={() => {}}
          /> */}

          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelText}>{prettifyTime(progress.position)}</Text>
            <Text style={styles.progressLabelText}>{prettifyTime(progress.buffered)}</Text>
            <Text style={styles.progressLabelText}>{prettifyTime(progress.duration)}</Text>
          </View>

          <View style={styles.musicControls}>
            <TouchableOpacity disabled={isLoading} onPress={skipToPrevious}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#FFD369"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
            <TouchableOpacity disabled={isLoading} onPress={togglePlayback}>
              <Ionicons
                name={isPlaying ? 'ios-pause-circle' : 'ios-play-circle'}
                size={75}
                color="#FFD369"
              />
            </TouchableOpacity>
            <TouchableOpacity disabled={isLoading} onPress={skipForward}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                color="#FFD369"
                style={{ marginTop: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#777777" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,

    // ios
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    // android
    elevation: 5,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#EEEEEE',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#fff',
  },
  musicControls: {
    marginLeft: '15%',
    marginRight: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
