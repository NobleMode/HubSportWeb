import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * Order Success Page
 * Displayed after successful checkout
 */
const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for your order. We have received your request and will process it shortly.
          <br />
          We will contact you via phone/email to confirm the details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
          <Button onClick={() => navigate('/')} variant="outline">Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
