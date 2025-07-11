import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login
      const userData = {
        id: 1,
        name: 'User',
        email: loginData.email,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (signupData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful signup
      const userData = {
        id: 1,
        name: signupData.name,
        email: signupData.email,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch {
      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Remove from localStorage
      localStorage.removeItem('user');
      return null;
    } catch {
      return rejectWithValue('Logout failed.');
    }
  }
);

// Async thunk for checking existing session
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        return userData;
      }
      return null;
    } catch {
      localStorage.removeItem('user');
      return rejectWithValue('Session check failed.');
    }
  }
);

const initialState = {
  user: null,
  loading: true,
  error: null,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = '';
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
  extraReducers: builder => {
    // Login cases
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.message = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = '';
      });

    // Signup cases
    builder
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.message = 'Account created successfully!';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = '';
      });

    // Logout cases
    builder
      .addCase(logoutUser.pending, state => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.message = 'Logged out successfully!';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Check auth status cases
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, setMessage } = authSlice.actions;
export default authSlice.reducer;
