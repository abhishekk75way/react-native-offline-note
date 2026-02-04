# NoteKeeper - Offline Note-Taking App

A beautiful, offline-first note-taking application built with React Native and Expo.

## Features

### Screens

1. **Splash Screen**
   - Animated logo and loading indicators
   - Loads user data from local storage
   - Smooth transitions to main app

2. **Profile Setup Screen**
   - Create user profile with name and email
   - Add profile photo (camera or gallery)
   - Form validation
   - Beautiful gradient UI

3. **Main App (Tab Navigation)**
   - **Home Tab**: Create and view notes
   - **Profile Tab**: View and edit user profile

### Note Features

- **Rich Note Creation**
  - Add title and content
  - Attach images (camera or photo library)
  - Capture device location (GPS coordinates)
  - Timestamp for each note

- **Note Management**
  - View all notes in a beautiful card layout
  - Search notes by title or content
  - Notes display with images, location, and timestamps
  - Relative time display (e.g., "2h ago", "3d ago")

### Profile Features

- View and edit profile information
- Update profile photo
- Statistics dashboard (total notes, notes with images)
- Account information (member since date)
- Clear all data option

### Offline Storage

- All data stored locally using AsyncStorage
- No internet connection required
- Persistent data across app restarts

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **AsyncStorage** for offline data persistence
- **Expo Image Picker** for camera and gallery access
- **Expo Location** for GPS coordinates
- **Expo Linear Gradient** for beautiful UI effects

## Design Features

- Dark theme with vibrant purple/green color palette
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Responsive layout
- Modern, premium UI design
- Floating action button (FAB)
- Statistics cards with gradients
- Custom tab bar with animated icons

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on iOS:

   ```bash
   npm run ios
   ```

4. Run on Android:

   ```bash
   npm run android
   ```

## Permissions

The app requires the following permissions:

- **Camera**: To take photos for notes
- **Photo Library**: To select images from gallery
- **Location**: To add GPS coordinates to notes

## Project Structure

```
src/
├── components/          # Reusable components
│   └── NoteCard.tsx    # Note display card
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx
│   └── MainNavigator.tsx
├── screens/           # App screens
│   ├── SplashScreen.tsx
│   ├── ProfileSetupScreen.tsx
│   ├── HomeScreen.tsx
│   └── ProfileScreen.tsx
├── store/            # Redux store
│   ├── index.ts
│   └── slices/
│       ├── userSlice.ts
│       └── notesSlice.ts
├── services/         # Services
│   └── storage.service.ts
├── theme/           # Theme configuration
│   └── theme.ts
└── types/          # TypeScript types
    └── note.types.ts
```
