import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { saveToken, removeToken } from '../../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: true,
  user: { name: 'User', email: 'demo@example.com' },
  token: 'mock-token',
  isLoading: false,
};

// Mock Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockToken = 'mock-secure-token-123';
      await saveToken('userToken', mockToken);
      return { user: { name: 'User', email: credentials.email }, token: mockToken };
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await removeToken('userToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreToken: (state, action: PayloadAction<{ token: string; user: { name: string; email: string } }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { restoreToken } = authSlice.actions;
export default authSlice.reducer;
