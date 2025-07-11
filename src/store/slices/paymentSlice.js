import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { paymentAPI } from '../../services/api';

// Async thunk for creating order
export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createOrder({
        plan_id: planData.id,
        amount: planData.price * 100, // Convert to paise
        currency: planData.currency,
        plan_name: planData.name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for verifying payment
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.verifyPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
