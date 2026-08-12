import { PaymentMethodType } from '../types';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentServiceInterface {
  name: string;
  initiate(amount: number, method: PaymentMethodType): Promise<PaymentResult>;
  verify(transactionId: string): Promise<boolean>;
  getStatus(transactionId: string): Promise<string>;
}

/**
 * Mock Payment Service - simulates payment processing.
 * Replace with RazorpayPaymentService, StripePaymentService, etc.
 */
export class MockPaymentService implements PaymentServiceInterface {
  name = 'MockPayment';

  async initiate(amount: number, method: PaymentMethodType): Promise<PaymentResult> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      success: true,
      transactionId,
    };
  }

  async verify(transactionId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async getStatus(transactionId: string): Promise<string> {
    return 'completed';
  }
}

// Example: Future Razorpay adapter
// export class RazorpayPaymentService implements PaymentServiceInterface {
//   name = 'Razorpay';
//   async initiate(amount: number, method: PaymentMethodType): Promise<PaymentResult> {
//     // Integrate Razorpay SDK here
//   }
//   async verify(transactionId: string): Promise<boolean> { ... }
//   async getStatus(transactionId: string): Promise<string> { ... }
// }

// Singleton instance - swap this to change payment provider
export const paymentService: PaymentServiceInterface = new MockPaymentService();

export const paymentMethodLabels: Record<PaymentMethodType, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  online: 'Online Payment',
  other: 'Other Payment Method',
};
