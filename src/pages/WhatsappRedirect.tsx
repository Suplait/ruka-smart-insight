
import { useEffect } from 'react';

export default function WhatsappRedirect() {
  useEffect(() => {
    // Mensaje fijo sin datos de usuario
    const message = "Hola! me gustaría saber más de ruka 🤖";
    const encodedMessage = encodeURIComponent(message);
    
    console.log("WhatsAppRedirect - redirecting to WhatsApp with message:", message);
    
    // Redirigir directamente a WhatsApp usando window.location.href
    window.location.href = `https://api.whatsapp.com/send/?phone=56932595791&text=${encodedMessage}&type=phone_number&app_absent=0`;
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirigiendo a WhatsApp...</p>
    </div>
  );
}
