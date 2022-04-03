import 'expo-dev-client';
import { registerRootComponent } from 'expo';
import App from './src/App';
import TrackPlayer from 'react-native-track-player';

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require('./service'));
