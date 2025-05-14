
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsappRedirect() {
  const location = useLocation();
  const userData = location.state || {};
  
  useEffect(() => {
    // Get any user data that might have been passed
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    const email = userData.email || '';
    const whatsapp = userData.whatsapp || '';
    const ciudad = userData.ciudad || '';
    const nombreRestaurante = userData.nombreRestaurante || '';
    
    // Build message with user data if available
    let message = "Hola! Quisiera saber más de Ruka.ai 🤖";
    
    if (firstName || lastName || email || whatsapp || ciudad || nombreRestaurante) {
      message += "\n\nMis datos:\n";
      
      if (firstName || lastName) {
        message += `Nombre: ${firstName}${lastName ? ' ' + lastName : ''}\n`;
      }
      
      if (email) {
        message += `Email: ${email}\n`;
      }
      
      if (ciudad) {
        message += `Ciudad: ${ciudad}\n`;
      }
      
      if (whatsapp) {
        message += `WhatsApp: +56${whatsapp.replace(/^\+56/, '')}\n`;
      }
      
      if (nombreRestaurante) {
        message += `Negocio: ${nombreRestaurante}\n`;
      }
    }
    
    // Encode and log the message for debugging
    console.log("WhatsAppRedirect - message being sent:", message);
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp in a new tab
    window.open(
      `https://api.whatsapp.com/send/?phone=56932595791&text=${encodedMessage}&type=phone_number&app_absent=0`, 
      '_blank'
    );
    
    // Redirect back to homepage after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, [userData]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirigiendo a WhatsApp...</p>
    </div>
  );
}
