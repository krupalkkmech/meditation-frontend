const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
const setAuthToken = token => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Signup user
  signup: async userData => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Don't set token for signup - user should login separately
    // if (response.success && response.data?.token) {
    //   setAuthToken(response.data.token);
    // }

    return response;
  },

  // Login user
  login: async credentials => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  // Get current user profile
  getProfile: async () => {
    return await apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async profileData => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async passwordData => {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Generate secure password
  generatePassword: async () => {
    return await apiRequest('/auth/generate-password', {
      method: 'POST',
    });
  },

  // Logout (clear token)
  logout: () => {
    removeAuthToken();
  },
};

// Payment API functions
export const paymentAPI = {
  // Create order
  createOrder: async orderData => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Verify payment
  verifyPayment: async paymentData => {
    return await apiRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Export utility functions
export { getAuthToken, removeAuthToken, setAuthToken };
