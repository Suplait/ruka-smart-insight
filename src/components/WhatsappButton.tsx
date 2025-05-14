
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
      
      // SIEMPRE incluir estos datos básicos del lead si existen
      
      // Nombre y apellido (si están disponibles)
      // Verificar individual y explícitamente cada campo
      if (formData.firstName) {
        message += `Nombre: ${formData.firstName}`;
        if (formData.lastName) {
          message += ` ${formData.lastName}`;
        }
        message += '\n';
      } else if (formData.lastName) {
        message += `Apellido: ${formData.lastName}\n`;
      }
      
      // Correo electrónico - siempre incluir si existe
      if (formData.email) {
        message += `Email: ${formData.email}\n`;
      }
      
      // Ciudad - siempre incluir si existe
      if (formData.ciudad) {
        message += `Ciudad: ${formData.ciudad}\n`;
      }
      
      // WhatsApp - siempre incluir si existe
      if (formData.whatsapp) {
        message += `WhatsApp: +56${formData.whatsapp.replace(/^\+56/, '')}\n`;
      }
      
      // Nombre del restaurante o negocio - siempre incluir si existe
      if (formData.nombreRestaurante) {
        message += `Negocio: ${formData.nombreRestaurante}\n`;
      }
      
      // A PARTIR DE AQUÍ SOLO INCLUIR SI YA SE HAN COMPLETADO LOS PASOS CORRESPONDIENTES
      
      // Subdominio (solo si ya ha sido establecido por el usuario - paso 2 completado)
      if (formData.subdominio && formData.currentStep >= 2) {
        message += `Subdominio: ${formData.subdominio}\n`;
      }
      
      // Sistema de facturación (solo si ya ha sido seleccionado por el usuario - paso 1 completado)
      if (formData.sistema && formData.currentStep >= 1) {
        message += `Sistema: ${formData.sistema}`;
        if (formData.sistemaCustom && formData.sistema !== "sii") {
          message += ` (${formData.sistemaCustom})`;
        }
        message += '\n';
      }
      
      // Meses de datos (solo si ya ha sido seleccionado por el usuario - paso 0 completado)
      if (formData.meses && formData.currentStep >= 0) {
        // No mostrar meses en el paso inicial, solo después de haberlo seleccionado
        if (formData.currentStep > 0) {
          message += `Meses de datos: ${formData.meses}\n`;
        }
      }
      
      // Estado de conexión SII (sin incluir credenciales)
      // Solo mostramos "Sí" si estamos en la página de éxito o si el usuario ha completado ese paso
      if (isSuccessPage) {
        message += `SII conectado: Sí\n`;
      } else if (formData.siiConnected) {
        message += `SII conectado: ${formData.siiConnected}\n`;
      } else if (formData.rut && formData.clave && formData.currentStep >= 3) {
        message += `SII conectado: Sí\n`;
      }

      // Agregar console.log para debuggear los datos que están llegando
      console.log("WhatsApp form data:", JSON.stringify(formData, null, 2));
      console.log("WhatsApp message:", message);
    }
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
  };
  
  const handleClick = () => {
    trackWhatsAppClick(source, 'whatsapp_onboarding');
    // Debug info
    console.log("WhatsApp button clicked with source:", source);
  };

  return (
    <Button
      variant={variant}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleClick}
      asChild
    >
      <Link to={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/950f4b99-40ab-40a3-a017-7375458df29d.png" alt="WhatsApp" className="w-4 h-4" />
          {children || "Consultar por WhatsApp"}
        </div>
      </Link>
    </Button>
  );
};

export default WhatsappButton;
