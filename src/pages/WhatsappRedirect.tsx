
import { useEffect } from 'react';

export default function WhatsappRedirect() {
  useEffect(() => {
    // Basic message without any personal data
    const message = encodeURIComponent("Hola! Quisiera saber más de Ruka.ai 🤖");
    
    // Open WhatsApp in a new tab
    window.open(
      `https://api.whatsapp.com/send/?phone=56932595791&text=${message}&type=phone_number&app_absent=0`, 
      '_blank'
    );
    
    // Redirect back to homepage after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirigiendo a WhatsApp...</p>
    </div>
  );
}
