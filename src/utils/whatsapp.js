// utils/whatsapp.js

export const sendToWhatsApp = (formData, cart, totalAmount, whatsappNumber = "234XXXXXXXXXX") => {
  const message = `
New Order 🚀
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Total: ₦${totalAmount}

Items:
${cart.map((item) => `- ${item.name} x${item.qty} = ₦${item.price * item.qty}`).join("\n")}
  `;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank"); // Opens WhatsApp Web or app
};
