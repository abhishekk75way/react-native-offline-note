import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { addNote } from '../store/slices/notesSlice';
import { StorageService } from '../services/storage.service';
import { Note, Location as NoteLocation } from '../types/note.types';
import { NoteCard } from '../components/NoteCard';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector((state) => state.notes.notes);
  
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [location, setLocation] = useState<NoteLocation | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const safeAlert = (title: string, message: string, buttons?: any[]) => {
    setTimeout(() => {
      Alert.alert(title, message, buttons);
    }, 300);
  };

  const requestLocationPermission = async (): Promise<NoteLocation | undefined> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        safeAlert('Permission Denied', 'Location permission is required to add location to notes.');
        return undefined;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting location:', error);
      safeAlert('Error', 'Failed to get current location');
      return undefined;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      safeAlert('Permission Required', 'Please grant camera roll permissions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      safeAlert('Permission Required', 'Please grant camera permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddImage = () => {
    safeAlert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAddLocation = async () => {
    const loc = await requestLocationPermission();
    if (loc) {
      setLocation(loc);
      safeAlert('Success', 'Location added to note');
    }
  };

  const handleCreateNote = async () => {
    if (!title.trim() && !content.trim()) {
      safeAlert('Error', 'Please add a title or content to your note');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      imageUri,
      location,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatch(addNote(newNote));
    
    // Save to storage
    const updatedNotes = [newNote, ...notes];
    await StorageService.saveNotes(updatedNotes);

    // Reset form
    setTitle('');
    setContent('');
    setImageUri(undefined);
    setLocation(undefined);
    setIsCreating(false);

    safeAlert('Success', 'Note created successfully!');
  };

  const handleCancelCreate = () => {
    setTitle('');
    setContent('');
    setImageUri(undefined);
    setLocation(undefined);
    setIsCreating(false);
  };

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color={theme.colors.textMuted} style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateTitle}>No Notes Yet</Text>
      <Text style={styles.emptyStateText}>
        Tap the + button to create your first note
      </Text>
    </View>
  );

  if (isCreating) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancelCreate} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Note</Text>
            <TouchableOpacity onPress={handleCreateNote} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.createForm}
            contentContainerStyle={styles.createFormContent}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Note Title"
              placeholderTextColor={theme.colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <TextInput
              style={styles.contentInput}
              placeholder="Start writing..."
              placeholderTextColor={theme.colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            {imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(undefined)}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {location && (
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={16} color={theme.colors.primary} style={styles.locationIcon} />
                <Text style={styles.locationText}>
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
                <TouchableOpacity onPress={() => setLocation(undefined)}>
                  <Text style={styles.removeLocationText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleAddImage}>
                <Ionicons name="image" size={20} color={theme.colors.textSecondary} style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Add Image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleAddLocation}>
                <Ionicons name="location" size={20} color={theme.colors.textSecondary} style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Notes</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => {
                // Could navigate to detail view
                safeAlert('Note', item.title || 'Untitled');
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsCreating(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradient.primary}
            style={styles.fabGradient}
          >
            <Text style={styles.fabIcon}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  saveButton: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm + 4,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    ...theme.shadows.large,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.text,
    fontWeight: '300',
  },
  createForm: {
    flex: 1,
  },
  createFormContent: {
    padding: theme.spacing.lg,
  },
  titleInput: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    padding: 0,
  },
  contentInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: 200,
    padding: 0,
  },
  imagePreviewContainer: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  locationIcon: {
    marginRight: theme.spacing.sm,
  },
  locationText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  removeLocationText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonIcon: {
    marginRight: theme.spacing.sm,
  },
  actionButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
