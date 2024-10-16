import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import { Song } from '../song';
import { RootTabParamList } from '../types'; // Import your types
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import initializeDatabase from '../database';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'index'>;

export default function HomeScreen() {
  const db = SQLite.useSQLiteContext();
  const [songs, setSongs] = useState<Song[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Set navigation type

  // Fetch data from SQLite
  useEffect(() => {
    async function fetchSongs() {
      try {
        const result = await db.getAllAsync<Song>('SELECT * FROM songs');
        setSongs(result);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    }

    async function setup() {
      await initializeDatabase(fetchSongs); // Pass fetchSongs as callback so fetchSongs will be called after the db initialization is completed
    }

    setup();
  }, []);

  // Handle song press and navigate to Explore tab
  const handleSongPress = (song: Song, index: number) => {
    navigation.navigate('explore', { songs, currentIndex: index }); // Pass the entire song list and current index
  };

  return (
    <ScrollView style={styles.contentContainer}>
      {songs.map((song, index) => (
        <TouchableOpacity key={index} onPress={() => handleSongPress(song, index)}>
          <View style={styles.songItemContainer}>
            <Image source={{ uri: song.imageUri }} style={styles.image} />
            <Text style={styles.title}>{song.title}</Text> 
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  songItemContainer: {
    marginBottom: 20,  // Add spacing between song items
    alignItems: 'center',
  },
  image: {
    width: '100%',  // Cover the entire screen width
    height: 300,  // Adjust height to make the image larger
    borderRadius: 10,  // Optional: add a border radius for aesthetics
  },
  title: {
    fontSize: 24,  // Make the title larger
    marginTop: 10,  // Add space between the image and the title
    textAlign: 'center',  // Center the text
    fontWeight: 'bold',  // Make the title bold
  },
});
