export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  duration: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  releaseDate: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}

export interface Image {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
  width: number;
  height: number;
  size: number;
}

export interface Work {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
}

export interface Skill {
  name: string;
  level: number;
  color: string;
}