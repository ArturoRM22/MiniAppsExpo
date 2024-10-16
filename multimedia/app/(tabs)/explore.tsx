import { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '../types'; // Import your types

type ExploreScreenRouteProp = RouteProp<RootTabParamList, 'explore'>;

export default function ExploreScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const route = useRoute<ExploreScreenRouteProp>();
  const { songs, currentIndex: routeIndex } = route.params;

  // Use the song from the current index
  const song = songs[currentIndex];

  useEffect(() => {
    setCurrentIndex(routeIndex); // Set the initial index from the route params
  }, [routeIndex]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    loadSound();
    setIsPlaying(false);
  }, [song.title]);

  async function loadSound() {
    console.log('Loading Sound');
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.songUri });
    setSound(newSound);
  }

  async function playPauseSound() {
    if (sound) {
      if (isPlaying) {
        console.log('Pausing Sound');
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log('Playing Sound');
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  }

  // Handle Next and Previous
  const handleNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song.title}</Text> 
      <Image source={{ uri: song.imageUri }} style={styles.image} />
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={playPauseSound} />

      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={handlePrevious} disabled={currentIndex === 0} />
        <Button title="Next" onPress={handleNext} disabled={currentIndex === songs.length - 1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  image: {
    width: '100%',  // Cover the entire screen width
    height: 300, 
    borderRadius: 10, 
  },
  title: {
    fontSize: 24,  // Make the title larger
    marginTop: 10,  // Add space between the image and the title
    textAlign: 'center',  // Center the text
    fontWeight: 'bold',  // Make the title bold
  }
});
