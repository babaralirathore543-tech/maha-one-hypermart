// src/services/whatsappService.ts

// ✅ WhatsApp Message Templates
export const getOrderWhatsAppMessage = (
  orderId: string,
  customerName: string,
  items: any[],
  total: number,
  deliveryAddress: string,
  estimatedDelivery?: string
) => {
  const itemsList = items.map((item, index) => 
    `${index + 1}. ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');

  return `🛍️ *MAHA ONE HYPERMART - Order Confirmation* 🛍️

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${customerName}!*

Thank you for shopping with us! Your order has been placed successfully. ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *ORDER DETAILS*
🆔 Order #: *${orderId.slice(-8)}*
📅 Date: ${new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
🕐 Time: ${new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛒 *ITEMS ORDERED*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *TOTAL AMOUNT:* Rs. ${total.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 *DELIVERY ADDRESS*
${deliveryAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ESTIMATED DELIVERY*
${estimatedDelivery || '2-3 business days'}

🔔 *ORDER STATUS:* Confirmed ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Track Your Order:*
${window.location.origin}/orders/${orderId}

📞 *Need Help?*
Contact us on WhatsApp: +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Thank you for choosing *MAHA ONE HYPERMART*!
Follow us for updates and exclusive offers! 🎉`;
};

// ✅ Signup Welcome WhatsApp Message
export const getSignupWhatsAppMessage = (
  name: string,
  email: string
) => {
  return `🎉 *Welcome to MAHA ONE HYPERMART!* 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${name}!*

Thank you for joining the MAHA ONE family! We're excited to have you on board. 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *Exclusive Benefits:*
• 🛒 *10% OFF* on your first order (Code: WELCOME10)
• 📦 *Free delivery* on orders above Rs. 2,000
• 🎁 Special birthday offers
• 📱 Easy order tracking
• ⭐ Early access to sales

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛍️ *Start Shopping Now:*
${window.location.origin}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 *Email:* ${email}
📱 *WhatsApp:* +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Welcome aboard!
*MAHA ONE HYPERMART* 🛍️

_Shop smart. Shop premium. Shop MAHA ONE._ ✨`;
};

// ✅ Order Shipped WhatsApp Message
export const getOrderShippedWhatsAppMessage = (
  orderId: string,
  customerName: string,
  trackingNumber?: string
) => {
  return `🚚 *MAHA ONE HYPERMART - Order Shipped!* 🚚

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${customerName}!*

Great news! 🎉 Your order has been shipped and is on its way to you!

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
🆔 Order #: *${orderId.slice(-8)}*
📦 Status: *Shipped* 🚚
${trackingNumber ? `🔢 Tracking #: *${trackingNumber}*` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Track Your Order:*
${window.location.origin}/orders/${orderId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *Estimated Delivery:* 1-3 business days

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us on WhatsApp: +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;
};

// ✅ Order Delivered WhatsApp Message
export const getOrderDeliveredWhatsAppMessage = (
  orderId: string,
  customerName: string
) => {
  return `✅ *MAHA ONE HYPERMART - Order Delivered!* ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${customerName}!*

Your order has been delivered successfully! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
🆔 Order #: *${orderId.slice(-8)}*
📦 Status: *Delivered* ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 *How was your experience?*
Rate your order: ${window.location.origin}/orders/${orderId}/review

🛍️ *Shop Again!*
${window.location.origin}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us on WhatsApp: +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Thank you for choosing *MAHA ONE HYPERMART*!
We hope to serve you again soon! 🛍️`;
};

// ✅ Payment Received WhatsApp Message
export const getPaymentWhatsAppMessage = (
  orderId: string,
  customerName: string,
  amount: number,
  method: string
) => {
  return `💳 *MAHA ONE HYPERMART - Payment Received!* 💳

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${customerName}!*

We have received your payment successfully! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
🆔 Order #: *${orderId.slice(-8)}*
💰 Amount: *Rs. ${amount.toLocaleString()}*
💳 Payment Method: *${method}*
📦 Status: *Processing* 🛍️

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Track Your Order:*
${window.location.origin}/orders/${orderId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us on WhatsApp: +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Thank you for shopping with *MAHA ONE HYPERMART*! 🛍️`;
};

// ✅ Order Cancelled WhatsApp Message
export const getOrderCancelledWhatsAppMessage = (
  orderId: string,
  customerName: string
) => {
  return `❌ *MAHA ONE HYPERMART - Order Cancelled* ❌

━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 *Hello ${customerName}!*

Your order has been cancelled as requested.

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *ORDER DETAILS*
🆔 Order #: *${orderId.slice(-8)}*
📦 Status: *Cancelled* ❌

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *Refund Status:* Processing (3-5 business days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛍️ *Shop Again!*
${window.location.origin}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *Need Help?*
Contact us on WhatsApp: +92-XXX-XXXXXXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Thank you for considering *MAHA ONE HYPERMART*! 🛍️`;
};