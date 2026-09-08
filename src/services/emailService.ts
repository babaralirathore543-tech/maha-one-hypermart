// src/services/emailService.ts
import emailjs from '@emailjs/browser';

// ✅ EmailJS Config
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER;
const WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME;

// ✅ Send Order Confirmation Email — DIRECT TEMPLATE PARAMS
export const sendOrderConfirmationEmail = async (orderData: {
  email: string;
  name: string;
  orderId: string;
  orderDate?: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customerName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}) => {
  try {
    console.log('📧 Sending order confirmation email to:', orderData.email);

    // ✅ DIRECT TEMPLATE PARAMS — SAME AS EMAILJS TEMPLATE
    const templateParams = {
      to_name: orderData.name,
      order_id: orderData.orderId,
      order_date: orderData.orderDate || new Date().toLocaleDateString('en-PK'),
      payment_method: orderData.paymentMethod,
      subtotal: orderData.subtotal.toLocaleString(),
      shipping: orderData.shipping.toLocaleString(),
      discount: orderData.discount > 0 ? orderData.discount.toLocaleString() : '0',
      total: orderData.total.toLocaleString(),
      customer_name: orderData.customerName,
      address: orderData.address,
      city: orderData.city,
      province: orderData.province,
      postal_code: orderData.postalCode,
      phone: orderData.phone,
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toLocaleString()
      }))
    };

    console.log('📧 Template Params:', JSON.stringify(templateParams, null, 2));

    const response = await emailjs.send(
      SERVICE_ID,
      ORDER_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Order confirmation email sent:', response.status);
    return { success: true, status: response.status };

  } catch (error: any) {
    console.error('❌ Order confirmation email error:', error);
    console.error('❌ Error text:', error.text);
    return { success: false, error: error.text || error.message };
  }
};

// ✅ Send Welcome Email — DIRECT TEMPLATE PARAMS
export const sendWelcomeEmail = async (data: {
  email: string;
  name: string;
}) => {
  try {
    console.log('📧 Sending welcome email to:', data.email);

    const templateParams = {
      to_name: data.name,
      shop_url: window.location.origin + '/shop'
    };

    console.log('📧 Template Params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      WELCOME_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Welcome email sent:', response.status);
    return { success: true, status: response.status };

  } catch (error: any) {
    console.error('❌ Welcome email error:', error);
    return { success: false, error: error.text || error.message };
  }
};

export default {
  sendOrderConfirmationEmail,
  sendWelcomeEmail
};