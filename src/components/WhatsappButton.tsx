
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/utils/dataLayer";

interface WhatsAppButtonProps {
  text: string;
  phone: string;
  source: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
  formData?: Record<string, any>;
}

const WhatsappButton = ({
  text = "Hola! Quisiera saber más de Ruka.ai 🤖",
  phone = "56932595791",
  source,
  className = "",
  variant = "outline",
  children,
  formData
}: WhatsAppButtonProps) => {
  
  const getWhatsAppUrl = () => {
    let message = text;
    
    // If formData is provided, add it to the message
    if (formData && Object.keys(formData).length > 0) {
      message += "\n\nMis datos:\n";
      
      if (formData.firstName && formData.lastName) {
        message += `Nombre: ${formData.firstName} ${formData.lastName}\n`;
      }
      
      if (formData.email) {
        message += `Email: ${formData.email}\n`;
      }
      
      if (formData.nombreRestaurante) {
        message += `Negocio: ${formData.nombreRestaurante}\n`;
      }
      
      if (formData.ciudad) {
        message += `Ciudad: ${formData.ciudad}\n`;
      }
      
      if (formData.whatsapp) {
        message += `WhatsApp: +56${formData.whatsapp}\n`;
      }
      
      if (formData.subdominio) {
        message += `Subdominio: ${formData.subdominio}\n`;
      }
      
      if (formData.sistema && formData.sistema !== "sii") {
        message += `Sistema: ${formData.sistema}`;
        if (formData.sistemaCustom) {
          message += ` (${formData.sistemaCustom})`;
        }
        message += '\n';
      }
      
      if (formData.meses) {
        message += `Meses de datos: ${formData.meses}\n`;
      }
    }
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
  };
  
  const handleClick = () => {
    trackWhatsAppClick(source, 'whatsapp_onboarding');
  };

  return (
    <Button
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleClick}
      asChild
    >
      <Link to={getWhatsAppUrl()}>
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/950f4b99-40ab-40a3-a017-7375458df29d.png" alt="WhatsApp" className="w-4 h-4" />
          {children || "Consultar por WhatsApp"}
        </div>
      </Link>
    </Button>
  );
};

export default WhatsappButton;
