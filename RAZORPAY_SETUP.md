# Razorpay Integration Setup

This project includes Razorpay payment integration for subscription plans. Follow these steps to set up Razorpay in your application.

## Prerequisites

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Complete the account verification process
3. Get your API keys from the Razorpay Dashboard

## Setup Instructions

### 1. Get Your Razorpay API Keys

1. Log in to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate a new key pair (or use existing ones)
4. Copy your **Key ID** and **Key Secret**

### 2. Update the Razorpay Key

In `src/components/Pricing.jsx`, replace the placeholder key:

```javascript
// Replace this line in the initiatePurchase function
key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay test key

// With your actual key
key: 'rzp_test_YOUR_ACTUAL_KEY_ID', // For test environment
// OR
key: 'rzp_live_YOUR_ACTUAL_KEY_ID', // For production environment
```

### 3. Backend Integration (Required for Production)

The current implementation uses simulated API calls. For production, you need to implement these endpoints in your backend:

#### Create Order Endpoint

```javascript
// POST /api/orders
{
  "plan_id": "basic",
  "amount": 99900, // Amount in paise
  "currency": "INR"
}

// Response
{
  "id": "order_ABC123",
  "amount": 99900,
  "currency": "INR",
  "plan_id": "basic"
}
```

#### Verify Payment Endpoint

```javascript
// POST /api/payments/verify
{
  "razorpay_payment_id": "pay_ABC123",
  "razorpay_order_id": "order_ABC123",
  "razorpay_signature": "signature_hash",
  "plan_id": "basic"
}

// Response
{
  "success": true,
  "payment_id": "pay_ABC123",
  "order_id": "order_ABC123",
  "plan_id": "basic"
}
```

### 4. Update API Calls

Replace the simulated API calls in `src/store/slices/paymentSlice.js`:

```javascript
// Replace the createOrder thunk
export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`, // Add your auth token
        },
        body: JSON.stringify({
          plan_id: planData.id,
          amount: planData.price * 100,
          currency: planData.currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Replace the verifyPayment thunk
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`, // Add your auth token
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Environment Variables

Create a `.env` file in your project root:

```env
# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
REACT_APP_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Backend API URL
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

Then update the Pricing component to use environment variables:

```javascript
key: process.env.REACT_APP_RAZORPAY_KEY_ID,
```

## Testing

### Test Cards for Development

Use these test card details in Razorpay test mode:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### Test UPI IDs

- **UPI ID**: success@razorpay
- **UPI ID**: failure@razorpay

## Security Considerations

1. **Never expose your Key Secret** in frontend code
2. Always verify payments on your backend server
3. Use HTTPS in production
4. Implement proper error handling
5. Add rate limiting to prevent abuse
6. Log all payment attempts for debugging

## Common Issues

### 1. "Invalid Key" Error

- Ensure you're using the correct key (test vs live)
- Check if the key is properly copied without extra spaces

### 2. "Order not found" Error

- Verify that the order was created successfully
- Check if the order ID is being passed correctly

### 3. "Payment verification failed" Error

- Ensure your backend is properly verifying the payment signature
- Check if all required parameters are being sent

## Support

For Razorpay-specific issues:

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

For application-specific issues, check the console logs and network requests for detailed error information.
