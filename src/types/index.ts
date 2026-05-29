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

export interface ExifData {
  camera?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
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
  format?: string;
  colorSpace?: string;
  exif?: ExifData;
}