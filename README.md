# Hackathod Frontend

A modern React application with authentication, routing, and payment integration using Razorpay.

## Features

- 🔐 **Authentication System**: Signup, login, and profile management
- 🛡️ **Protected Routes**: Secure navigation with authentication checks
- 💳 **Payment Integration**: Razorpay payment gateway for subscriptions
- 🎨 **Modern UI**: Responsive design with SCSS styling
- 📱 **Mobile First**: Optimized for all screen sizes
- 🔄 **State Management**: Redux Toolkit for global state
- 🚀 **TypeScript Ready**: Configured with TypeScript support

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Styling**: SCSS with modern CSS features
- **Payment**: Razorpay integration
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier

## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Backend API server running (see backend setup)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hackathod-fe
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Configure Environment Variables**

   ```env
   # API Configuration
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   REACT_APP_API_TIMEOUT=10000

   # Razorpay Configuration
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   REACT_APP_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

   # App Configuration
   REACT_APP_APP_NAME=Hackathod
   REACT_APP_APP_VERSION=1.0.0

   # Development Configuration
   REACT_APP_ENVIRONMENT=development
   REACT_APP_DEBUG_MODE=true
   ```

## Development

1. **Start the development server**

   ```bash
   pnpm dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Start your backend server**
   Make sure your backend API is running on the configured port

## API Integration

The application is configured to work with the following API endpoints:

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/generate-password` - Generate secure password

### Payment Endpoints

- `POST /api/orders` - Create payment order
- `POST /api/payments/verify` - Verify payment

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthLayout.jsx   # Authentication layout
│   ├── Header.jsx       # Navigation header
│   ├── Home.jsx         # Home page
│   ├── Login.jsx        # Login form
│   ├── Pricing.jsx      # Pricing page
│   └── Signup.jsx       # Signup form
├── hooks/               # Custom hooks
│   └── redux.js         # Redux hooks
├── services/            # API services
│   └── api.js           # API client
├── store/               # Redux store
│   ├── index.js         # Store configuration
│   └── slices/          # Redux slices
│       ├── authSlice.js # Authentication state
│       └── paymentSlice.js # Payment state
├── styles/              # Styling
│   └── main.scss        # Main stylesheet
└── App.jsx              # Main app component
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier

## Authentication Flow

1. **Signup**: User creates account with name, email, and password
2. **Login**: User authenticates with email and password
3. **Token Storage**: JWT token stored in localStorage
4. **Protected Routes**: Routes check authentication status
5. **Auto-login**: App checks for existing token on load

## Payment Flow

1. **Plan Selection**: User selects subscription plan
2. **Order Creation**: Backend creates Razorpay order
3. **Payment Gateway**: Razorpay modal opens for payment
4. **Payment Verification**: Backend verifies payment signature
5. **Subscription Activation**: User subscription is activated

## Environment Variables

| Variable                        | Description         | Default                     |
| ------------------------------- | ------------------- | --------------------------- |
| `REACT_APP_API_BASE_URL`        | Backend API URL     | `http://localhost:3001/api` |
| `REACT_APP_RAZORPAY_KEY_ID`     | Razorpay public key | Required                    |
| `REACT_APP_RAZORPAY_KEY_SECRET` | Razorpay secret key | Required                    |
| `REACT_APP_APP_NAME`            | Application name    | `Hackathod`                 |
| `REACT_APP_ENVIRONMENT`         | Environment         | `development`               |

## Backend Requirements

Your backend should implement the following endpoints:

### Authentication

```typescript
// POST /api/auth/signup
interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// Response format
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
```

### Payment

```typescript
// POST /api/orders
interface OrderRequest {
  plan_id: string;
  amount: number; // in paise
  currency: string;
}

// POST /api/payments/verify
interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  plan_id: string;
}
```

## Deployment

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Set production environment variables**

   ```env
   REACT_APP_API_BASE_URL=https://your-api-domain.com/api
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   REACT_APP_ENVIRONMENT=production
   ```

3. **Deploy the `dist` folder** to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Check the [Razorpay Setup Guide](./RAZORPAY_SETUP.md)
- Review the API documentation
- Check the console for error messages
