
import { useEffect } from 'react';

export default function WhatsappRedirect() {
  useEffect(() => {
    window.location.href = "https://api.whatsapp.com/send/?phone=56932595791&text=Hola%21%20Quisiera%20saber%20m%C3%A1s%20de%20Ruka.ai%20%F0%9F%A4%96&type=phone_number&app_absent=0";
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting to WhatsApp...</p>
    </div>
  );
}
