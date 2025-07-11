import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authAPI, getAuthToken } from '../../services/api';

// Async thunk for user signup (without auto-login)
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      // Don't set token for signup - user should login separately
      return { success: true, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user signup with auto-login (if needed in future)
export const signupUserAndLogin = createAsyncThunk(
  'auth/signupAndLogin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      if (response.success && response.data?.token) {
        // Auto-login after signup
        return response.data;
      }
      return rejectWithValue('Signup successful but login failed');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for changing password
export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for generating secure password
export const generateSecurePassword = createAsyncThunk(
  'auth/generatePassword',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.generatePassword();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: getAuthToken(),
  loading: false,
  error: null,
  message: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      authAPI.logout();
    },
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    // Signup cases
    builder
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message ||
          'Account created successfully! Please login.';
        state.error = null;
        // Don't set user or token - user should login separately
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });

    // Signup with auto-login cases (for future use)
    builder
      .addCase(signupUserAndLogin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUserAndLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUserAndLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login cases
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Check auth status cases
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        authAPI.logout();
      });

    // Update profile cases
    builder
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change password cases
    builder
      .addCase(changeUserPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Generate password cases
    builder
      .addCase(generateSecurePassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSecurePassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(generateSecurePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearError, clearMessage, setUser } =
  authSlice.actions;

export default authSlice.reducer;
