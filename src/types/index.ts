export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  bpm: number;
  genre: string;
  imageUrl: string;
}

export interface Playlist {
  songs: Song[];
  totalDuration: string;
  averageBpm: number;
}