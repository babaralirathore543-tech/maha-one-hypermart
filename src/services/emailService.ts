// src/services/emailService.ts
import emailjs from '@emailjs/browser';

// ✅ EmailJS Config — With Fallback
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_zwll8wh';
const ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER || 'template_4i8ppe6';
const WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME || 'template_w5dmzad';

// ✅ FALLBACK: Agar .env se na aaye toh hardcode
let PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
if (!PUBLIC_KEY) {
  console.warn('⚠️ PUBLIC_KEY not found in .env, using fallback');
  PUBLIC_KEY = 'user_IfuhzLqqlVD9OUYra';
}

console.log('📧 EmailJS Config:');
console.log('✅ SERVICE_ID:', SERVICE_ID);
console.log('✅ PUBLIC_KEY:', PUBLIC_KEY ? 'Set ✅' : 'Missing ❌');
console.log('✅ ORDER_TEMPLATE_ID:', ORDER_TEMPLATE_ID);
console.log('✅ WELCOME_TEMPLATE_ID:', WELCOME_TEMPLATE_ID);

export const sendOrderConfirmationEmail = async (orderData: any) => {
  try {
    console.log('📧 Sending order confirmation email to:', orderData.email);

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
      items: orderData.items.map((item: any) => ({
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

export const sendWelcomeEmail = async (data: any) => {
  try {
    console.log('📧 Sending welcome email to:', data.email);

    const templateParams = {
      to_name: data.name,
      shop_url: window.location.origin + '/shop'
    };

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