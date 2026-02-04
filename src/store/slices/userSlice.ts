import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/note.types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
}

const initialState: UserState = {
  profile: {
    name: 'Demo User',
    email: 'demo@example.com',
    profileImage: '',
    id: '1',
    createdAt: Date.now()
  },
  isOnboarded: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isOnboarded = true;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.isOnboarded = false;
    },
  },
});

export const { setUserProfile, updateUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
