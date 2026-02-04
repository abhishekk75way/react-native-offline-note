import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useAppDispatch, useAppSelector } from '../store';
import { updateUserProfile, clearUserProfile } from '../store/slices/userSlice';
import { setNotes } from '../store/slices/notesSlice';
import { StorageService } from '../services/storage.service';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const notes = useAppSelector((state) => state.notes.notes);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');

  const safeAlert = (title: string, message: string, buttons?: any[]) => {
    setTimeout(() => {
      Alert.alert(title, message, buttons);
    }, 300);
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No profile found</Text>
      </View>
    );
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      safeAlert('Permission Required', 'Please grant camera roll permissions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const updatedProfile = {
        ...profile,
        profileImage: result.assets[0].uri,
      };
      dispatch(updateUserProfile({ profileImage: result.assets[0].uri }));
      await StorageService.saveUserProfile(updatedProfile);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      safeAlert('Error', 'Name cannot be empty');
      return;
    }

    if (!email.trim()) {
      safeAlert('Error', 'Email cannot be empty');
      return;
    }

    const updatedProfile = {
      ...profile,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    dispatch(updateUserProfile({ name: name.trim(), email: email.trim().toLowerCase() }));
    await StorageService.saveUserProfile(updatedProfile);
    setIsEditing(false);
    safeAlert('Success', 'Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setName(profile.name);
    setEmail(profile.email);
    setIsEditing(false);
  };

  const handleClearData = () => {
    safeAlert(
      'Clear All Data',
      'Are you sure you want to delete all notes and reset your profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            dispatch(clearUserProfile());
            dispatch(setNotes([]));
            safeAlert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={theme.colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImagePlaceholderText}>
                      {profile.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.editImageBadge}>
                  <Ionicons name="camera" size={16} color={theme.colors.primary} />
                </View>
              </TouchableOpacity>

              {!isEditing && (
                <>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileEmail}>{profile.email}</Text>
                </>
              )}
            </View>
          </LinearGradient>

          <View style={styles.content}>
            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.saveButtonContainer]}
                    onPress={handleSaveProfile}
                  >
                    <LinearGradient
                      colors={theme.colors.gradient.primary}
                      style={styles.saveButtonGradient}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(108, 92, 231, 0.2)', 'rgba(162, 155, 254, 0.1)']}
                      style={styles.statCardGradient}
                    >
                      <Text style={styles.statNumber}>{notes.length}</Text>
                      <Text style={styles.statLabel}>Total Notes</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(0, 184, 148, 0.2)', 'rgba(85, 239, 196, 0.1)']}
                      style={styles.statCardGradient}
                    >
                      <Text style={styles.statNumber}>
                        {notes.filter(n => n.imageUri).length}
                      </Text>
                      <Text style={styles.statLabel}>With Images</Text>
                    </LinearGradient>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Account Information</Text>
                  
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Member Since</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(profile.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={() => setIsEditing(true)}
                >
                  <LinearGradient
                    colors={theme.colors.gradient.primary}
                    style={styles.editProfileButtonGradient}
                  >
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearDataButton}
                  onPress={handleClearData}
                >
                  <Text style={styles.clearDataButtonText}>Clear All Data</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    color: theme.colors.text,
    fontWeight: '700',
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editImageBadgeText: {
    // Removed fontSize as Ionicons handles it
  },
  profileName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    ...theme.typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  },
  statNumber: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  editForm: {
    marginTop: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  editButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  saveButtonContainer: {
    ...theme.shadows.medium,
  },
  saveButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  editProfileButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  editProfileButtonGradient: {
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
  },
  editProfileButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  clearDataButton: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  clearDataButtonText: {
    ...theme.typography.body,
    color: theme.colors.error,
    fontWeight: '600',
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
