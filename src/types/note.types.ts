export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  imageUri?: string;
  location?: Location;
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: number;
}
