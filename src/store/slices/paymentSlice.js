import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for creating order
export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (planData, { rejectWithValue }) => {
    try {
      // Simulate API call to create order
      // In real implementation, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderData = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: planData.price * 100, // Convert to paise
        currency: planData.currency,
        plan_id: planData.id,
        plan_name: planData.name,
      };

      return orderData;
    } catch {
      return rejectWithValue('Failed to create order');
    }
  }
);

// Async thunk for verifying payment
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      // Simulate API call to verify payment
      // In real implementation, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      const verificationData = {
        success: true,
        payment_id: paymentData.razorpay_payment_id,
        order_id: paymentData.razorpay_order_id,
        plan_id: paymentData.plan_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
      };

      return verificationData;
    } catch {
      return rejectWithValue('Payment verification failed');
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  currentOrder: null,
  paymentStatus: null,
  subscription: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: state => {
      state.error = null;
    },
    clearPaymentStatus: state => {
      state.paymentStatus = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
  extraReducers: builder => {
    // Create order cases
    builder
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify payment cases
    builder
      .addCase(verifyPayment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        state.subscription = {
          plan_id: action.payload.plan_id,
          payment_id: action.payload.payment_id,
          order_id: action.payload.order_id,
          amount: action.payload.amount,
          currency: action.payload.currency,
          activated_at: new Date().toISOString(),
        };
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  clearPaymentError,
  clearPaymentStatus,
  setCurrentOrder,
  clearCurrentOrder,
} = paymentSlice.actions;

export default paymentSlice.reducer;
