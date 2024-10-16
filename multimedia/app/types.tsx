import { Song } from './song'; // Import the Song type

export type RootTabParamList = {
  index: undefined; // Your other routes
  explore: { songs: Song[]; currentIndex: number }; // Include songs and currentIndex in explore
};

