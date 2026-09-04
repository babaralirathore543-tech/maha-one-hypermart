// src/services/emailService.ts
import emailjs from '@emailjs/browser';

// ✅ EmailJS Config
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ✅ Use different templates for different emails
const ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export interface EmailData {
  to: string;
  name: string;
  subject: string;
  message?: string;
  html?: string;
}

// ✅ Generic send email function
export const sendEmail = async (data: EmailData, templateId: string) => {
  try {
    const templateParams = {
      to_email: data.to,
      to_name: data.name,
      subject: data.subject,
      message: data.message || '',
      html_content: data.html || data.message || ''
    };

    console.log('📧 Sending email using template:', templateId);
    console.log('📧 To:', data.to);

    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams,
      PUBLIC_KEY
    );

    console.log('✅ Email sent successfully:', response.status);
    return { success: true, status: response.status };
    
  } catch (error: any) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

// ✅ Send Order Confirmation Email
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
  const subject = `Order Confirmation #${orderData.orderId} - Maha One Hypermart`;
  
  const itemsList = orderData.items
    .map(item => `- ${item.name} x ${item.quantity} = PKR ${(item.price).toLocaleString()}`)
    .join('\n');

  const message = `
    Dear ${orderData.name},

    🎉 Thank you for your order #${orderData.orderId}!
    
    📦 Order Summary:
    --------------------------
    ${itemsList}
    --------------------------
    Subtotal: PKR ${orderData.subtotal.toLocaleString()}
    Shipping: PKR ${orderData.shipping.toLocaleString()}
    Total: PKR ${orderData.total.toLocaleString()}
    Payment: ${orderData.paymentMethod}
    Delivery: ${orderData.address}, ${orderData.city}, ${orderData.province}
    
    📱 We will notify you once your order is shipped.
    
    Need help? Contact us at support@mahaone.com
    
    Thanks,
    Maha One Hypermart Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #0F766E; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0;">MAHA ONE</h1>
        <p style="color: white; margin: 0; opacity: 0.8;">HYPERMARKET</p>
      </div>
      
      <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F766E;">🎉 Order Confirmation #${orderData.orderId}</h2>
        <p>Dear <strong>${orderData.name}</strong>,</p>
        <p>Thank you for your order at <strong>Maha One Hypermart</strong>!</p>
        
        ${orderData.orderDate ? `<p><strong>Order Date:</strong> ${orderData.orderDate}</p>` : ''}
        
        <h3 style="color: #0F766E;">📦 Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f8fafc;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">Price</th>
          </tr>
          ${orderData.items.map(item => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.name}</td>
              <td style="padding: 8px; text-align: center; border: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">PKR ${item.price.toLocaleString()}</td>
            </tr>
          `).join('')}
          <tr style="background: #f8fafc;">
            <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;"><strong>Subtotal</strong></td>
            <td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">PKR ${orderData.subtotal.toLocaleString()}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;"><strong>Shipping</strong></td>
            <td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">PKR ${orderData.shipping.toLocaleString()}</td>
          </tr>
          <tr style="background: #0F766E; color: white; font-weight: bold;">
            <td colspan="2" style="padding: 8px; text-align: right; border: 1px solid #0F766E;">Total</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #0F766E;">PKR ${orderData.total.toLocaleString()}</td>
          </tr>
        </table>
        
        <p><strong>Payment:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Delivery:</strong> ${orderData.address}, ${orderData.city}, ${orderData.province}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px;">📱 We will notify you once your order is shipped.</p>
        <p style="color: #6b7280; font-size: 12px;">Need help? Contact us at <a href="mailto:support@mahaone.com" style="color: #0F766E;">support@mahaone.com</a></p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          &copy; 2024 Maha One Hypermart. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: orderData.email,
    name: orderData.name,
    subject,
    message,
    html
  }, ORDER_TEMPLATE_ID);
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (data: {
  email: string;
  name: string;
}) => {
  const subject = 'Welcome to Maha One Hypermart! 🎉';
  const message = `
    Dear ${data.name},

    Welcome to Maha One Hypermart! 🎉

    Thank you for creating an account with us. We're excited to have you on board!

    🛒 Start shopping now and enjoy:
    - Premium quality products
    - Fast delivery across Pakistan
    - Secure payment options

    👉 Start Shopping: ${window.location.origin}/shop

    Have questions? Contact us at mahaonehypermarket@gmail.com

    Thanks,
    Maha One Hypermart Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #0F766E; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0;">MAHA ONE</h1>
        <p style="color: white; margin: 0; opacity: 0.8;">HYPERMARKET</p>
      </div>
      <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F766E;">🎉 Welcome to Maha One Hypermart!</h2>
        <p>Dear <strong>${data.name}</strong>,</p>
        <p>Thank you for creating an account with us. We're excited to have you on board!</p>
        
        <h3 style="color: #0F766E;">🛒 Start Shopping</h3>
        <p>Enjoy premium quality products with fast delivery across Pakistan.</p>
        
        <a href="${window.location.origin}/shop" style="display: inline-block; background: #0F766E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px 0;">
          Start Shopping Now
        </a>
        
        <p>Have questions? Contact us at <a href="mailto:mahaonehypermarket@gmail.com">mahaonehypermarket@gmail.com</a></p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          &copy; 2024 Maha One Hypermart. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    name: data.name,
    subject,
    message,
    html
  }, WELCOME_TEMPLATE_ID);
};

// ✅ Send Password Reset Email
export const sendPasswordResetEmail = async (data: {
  email: string;
  name: string;
  resetLink: string;
}) => {
  const subject = 'Reset Your Password - Maha One Hypermart';
  const message = `
    Dear ${data.name},

    We received a request to reset your password for your Maha One Hypermart account.

    🔑 Click the link below to reset your password:
    ${data.resetLink}

    If you didn't request this, please ignore this email.

    Thanks,
    Maha One Hypermart Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #0F766E; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0;">MAHA ONE</h1>
        <p style="color: white; margin: 0; opacity: 0.8;">HYPERMARKET</p>
      </div>
      <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F766E;">🔑 Reset Your Password</h2>
        <p>Dear <strong>${data.name}</strong>,</p>
        <p>We received a request to reset your password for your Maha One Hypermart account.</p>
        
        <a href="${data.resetLink}" style="display: inline-block; background: #0F766E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px 0;">
          Reset Password
        </a>
        
        <p>If you didn't request this, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          &copy; 2024 Maha One Hypermart. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.email,
    name: data.name,
    subject,
    message,
    html
  }, import.meta.env.VITE_EMAILJS_TEMPLATE_RESET || WELCOME_TEMPLATE_ID);
};

// ✅ Send Order Status Update Email
export const sendOrderStatusEmail = async (data: {
  email: string;
  name: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
}) => {
  const subject = `Order #${data.orderId} Status Updated - Maha One Hypermart`;
  const message = `
    Dear ${data.name},

    Your order #${data.orderId} status has been updated to: ${data.status}

    ${data.trackingNumber ? `📦 Tracking Number: ${data.trackingNumber}` : ''}

    Track your order: ${window.location.origin}/dashboard?tab=orders

    Thanks,
    Maha One Hypermart Team
  `;

  return sendEmail({
    to: data.email,
    name: data.name,
    subject,
    message
  }, ORDER_TEMPLATE_ID);
};

export default {
  sendEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderStatusEmail
};