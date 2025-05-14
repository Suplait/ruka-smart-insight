
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/utils/dataLayer";

interface WhatsAppButtonProps {
  text?: string;
  phone?: string;
  source: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
  formData?: Record<string, any>;
  isSuccessPage?: boolean;
}

const WhatsappButton = ({
  text = "Hola! Quisiera saber más de Ruka.ai 🤖",
  phone = "56932595791",
  source,
  className = "",
  variant = "outline",
  children,
  formData,
  isSuccessPage = false
}: WhatsAppButtonProps) => {
  
  const getWhatsAppUrl = () => {
    let message = text;
    
    // Si se proporcionan datos de formulario, agregarlos al mensaje
    if (formData && Object.keys(formData).length > 0) {
      message += "\n\nMis datos:\n";
      
      // Nombre y apellido (si están disponibles)
      if (formData.firstName || formData.lastName) {
        const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');
        if (fullName) {
          message += `Nombre: ${fullName}\n`;
        }
      }
      
      // Correo electrónico
      if (formData.email) {
        message += `Email: ${formData.email}\n`;
      }
      
      // Nombre del restaurante o negocio
      if (formData.nombreRestaurante) {
        message += `Negocio: ${formData.nombreRestaurante}\n`;
      }
      
      // Ciudad
      if (formData.ciudad) {
        message += `Ciudad: ${formData.ciudad}\n`;
      }
      
      // WhatsApp
      if (formData.whatsapp) {
        message += `WhatsApp: ${formData.whatsapp.startsWith('+56') ? formData.whatsapp : `+56${formData.whatsapp}`}\n`;
      }
      
      // SOLO agregamos la siguiente información si estamos en el proceso de onboarding 
      // y estos campos ya han sido explícitamente definidos por el usuario
      
      // Subdominio - solo si el usuario ya lo ha definido explícitamente
      if (isSuccessPage && formData.subdominio) {
        message += `Subdominio: ${formData.subdominio}\n`;
      }
      
      // Sistema de facturación - solo si el usuario ya lo ha definido explícitamente
      if (isSuccessPage && formData.sistema && formData.sistema !== "") {
        message += `Sistema: ${formData.sistema}`;
        if (formData.sistemaCustom && formData.sistemaCustom !== "" && formData.sistema !== "sii") {
          message += ` (${formData.sistemaCustom})`;
        }
        message += '\n';
      }
      
      // Meses de datos - solo si el usuario ya lo ha definido explícitamente
      if (isSuccessPage && formData.meses && formData.meses > 0) {
        message += `Meses de datos: ${formData.meses}\n`;
      }
      
      // Estado de conexión SII - solo si el usuario ya ha completado este paso
      if (isSuccessPage && (formData.siiConnected === true || (formData.rut && formData.clave))) {
        message += `SII conectado: Sí\n`;
      }
    }
    
    // Codificar el mensaje para URL
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
