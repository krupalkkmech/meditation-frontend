/* global process */
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  clearPaymentError,
  clearPaymentStatus,
  createOrder,
  verifyPayment,
} from '../store/slices/paymentSlice';

const Pricing = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { loading, error, paymentStatus } = useAppSelector(
    state => state.payment
  );
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Clear payment status after 5 seconds
  useEffect(() => {
    if (paymentStatus) {
      const timer = setTimeout(() => {
        dispatch(clearPaymentStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, dispatch]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearPaymentError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 999,
      currency: 'INR',
      period: 'month',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Email support',
        'Standard templates',
        '1GB storage',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 1999,
      currency: 'INR',
      period: 'month',
      features: [
        'Up to 20 projects',
        'Advanced analytics',
        'Priority support',
        'Custom templates',
        '10GB storage',
        'Team collaboration',
        'API access',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 4999,
      currency: 'INR',
      period: 'month',
      features: [
        'Unlimited projects',
        'Full analytics suite',
        '24/7 support',
        'Custom integrations',
        'Unlimited storage',
        'Advanced security',
        'Dedicated account manager',
      ],
      popular: false,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePurchase = async plan => {
    setSelectedPlan(plan.id);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order using Redux
      const orderResult = await dispatch(createOrder(plan));
      if (orderResult.error) {
        throw new Error(orderResult.error);
      }

      const orderResponse = orderResult.payload;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // Use environment variable
        amount: plan.price * 100, // Amount in paise
        currency: plan.currency,
        name: 'Hackathod',
        description: `${plan.name} Subscription`,
        order_id: orderResponse.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '', // Add phone if available
        },
        notes: {
          plan_id: plan.id,
          user_id: user?.id,
        },
        theme: {
          color: '#646cff',
        },
        handler: function (response) {
          handlePaymentSuccess(response, plan);
        },
        modal: {
          ondismiss: function () {
            setSelectedPlan(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
      setSelectedPlan(null);
    }
  };

  const handlePaymentSuccess = async (response, plan) => {
    try {
      // Verify payment using Redux
      const paymentData = {
        ...response,
        plan_id: plan.id,
        amount: plan.price * 100,
        currency: plan.currency,
      };

      const verificationResult = await dispatch(verifyPayment(paymentData));

      if (verificationResult.error) {
        throw new Error(verificationResult.error);
      }

      alert(`Payment successful! Welcome to ${plan.name}!`);
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setSelectedPlan(null);
    }
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your needs</p>
      </div>

      {/* Success/Error Messages */}
      {paymentStatus === 'success' && (
        <div
          className="form-success"
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          Payment successful! Your subscription has been activated.
        </div>
      )}

      {error && (
        <div
          className="form-error"
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          {error}
        </div>
      )}

      <div className="pricing-grid">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}

            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`pricing-btn ${loading && selectedPlan === plan.id ? 'loading' : ''}`}
              onClick={() => initiatePurchase(plan)}
              disabled={loading}
            >
              {loading && selectedPlan === plan.id ? (
                <>
                  <span className="loading"></span>
                  Processing...
                </>
              ) : (
                'Get Started'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-footer">
        <p>All plans include a 14-day money-back guarantee</p>
        <p>
          Need help?{' '}
          <a href="#" className="support-link">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
