
import { useEffect } from 'react';

export default function WhatsappRedirect() {
  useEffect(() => {
    const message = encodeURIComponent("Hola! Quisiera saber más de Ruka.ai 🤖");
    window.location.href = `https://api.whatsapp.com/send/?phone=56932595791&text=${message}&type=phone_number&app_absent=0`;
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirigiendo a WhatsApp...</p>
    </div>
  );
}
