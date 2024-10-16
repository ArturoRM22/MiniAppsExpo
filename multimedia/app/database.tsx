import * as SQLite from 'expo-sqlite';

const initializeDatabase = async (onInitialized: () => void) => {
  try {
    const db = await SQLite.openDatabaseAsync('songs');

    // Create the songs table if it doesn't exist
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, 
        imageUri TEXT,
        songUri TEXT
      );
    `);

    console.log("Table 'songs' created or already exists.");

    // Clear the songs table to avoid duplicates
    await db.runAsync('DELETE FROM songs;'); 
    console.log("All rows deleted from the 'songs' table.");

    // Array of songs to insert
    const songs = [
      {
        title: "Pixelland",
        imageUri: "https://i.ytimg.com/vi/rQqr10MC_uw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCOOXwU1490QO2U1MGiH-GULMrIvg",
        songUri: "https://github.com/ArturoRM22/songs/raw/refs/heads/main/Pixelland.mp3"
      },
      {
        title: "Who likes to party",
        imageUri: "https://i.ytimg.com/vi/i-Taa4CS_MQ/maxresdefault.jpg",
        songUri: "https://github.com/ArturoRM22/songs/raw/refs/heads/main/Who%20Likes%20to%20Party.mp3"
      },
      {
        title: "Aerosol of my love",
        imageUri: "https://i.scdn.co/image/ab67616d00001e02d152ed982452da1c3f86aa46",
        songUri: "https://github.com/ArturoRM22/songs/raw/refs/heads/main/Aerosol%20of%20my%20Love.mp3"
      },
      {
        title: "Arroz con pollo",
        imageUri: "https://i.scdn.co/image/ab67616d0000b27358b2da77aafd1b61cf480a2c",
        songUri: "https://github.com/ArturoRM22/songs/raw/refs/heads/main/Arroz%20Con%20Pollo.mp3"
      },
      {
        title: "Verano sensual",
        imageUri: "https://i.pinimg.com/originals/1d/df/3f/1ddf3f4231deb10a63228b8fbf861d57.jpg",
        songUri: "https://github.com/ArturoRM22/songs/raw/refs/heads/main/Verano%20Sensual.mp3"
      }
    ];

    // Insert songs one by one
    for (const song of songs) {
      await db.runAsync(
        'INSERT INTO songs (title, imageUri, songUri) VALUES (?, ?, ?)', 
        song.title, 
        song.imageUri, 
        song.songUri
      );
      console.log(`Inserted: ${song.title}`);
    }

    if(onInitialized){
        onInitialized();
    }

  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeDatabase;
