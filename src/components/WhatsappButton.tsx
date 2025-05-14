
import React, { useEffect } from 'react';
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
  
  // Add useEffect for debugging
  useEffect(() => {
    if (formData) {
      console.log(`WhatsAppButton - ${source} - received form data:`, formData);
    }
  }, [formData, source]);
  
  const getWhatsAppUrl = () => {
    let message = text;
    
    // Si se proporcionan datos de formulario, agregarlos al mensaje
    if (formData && Object.keys(formData).length > 0) {
      message += "\n\nMis datos:\n";
      
      // DEBUGGING - Log all incoming data
      console.log("WhatsApp full form data received:", formData);
      
      // SIEMPRE incluir estos datos básicos del lead si existen
      // Nombre y apellido (si están disponibles)
      if (formData.firstName || formData.lastName) {
        message += "Nombre: ";
        if (formData.firstName) {
          message += formData.firstName;
          if (formData.lastName) {
            message += ` ${formData.lastName}`;
          }
        } else if (formData.lastName) {
          message += formData.lastName;
        }
        message += '\n';
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
      // O si estamos en la página de éxito
      
      // Subdominio (solo si ya ha sido establecido por el usuario - paso 2 completado o página de éxito)
      if (formData.subdominio && (formData.currentStep >= 2 || isSuccessPage)) {
        message += `Subdominio: ${formData.subdominio}\n`;
      }
      
      // Sistema de facturación (solo si ya ha sido seleccionado por el usuario - paso 1 completado o página de éxito)
      if (formData.sistema && (formData.currentStep >= 1 || isSuccessPage)) {
        message += `Sistema: ${formData.sistema}`;
        if (formData.sistemaCustom && formData.sistema !== "sii") {
          message += ` (${formData.sistemaCustom})`;
        }
        message += '\n';
      }
      
      // Meses de datos (solo si ya ha sido seleccionado por el usuario - paso 0 completado o página de éxito)
      if ((formData.meses || formData.meses === 0) && (formData.currentStep > 0 || isSuccessPage)) {
        message += `Meses de datos: ${formData.meses}\n`;
      }
      
      // Estado de conexión SII (sin incluir credenciales)
      // Solo mostramos "Sí" si estamos en la página de éxito o si el usuario ha completado ese paso
      if (isSuccessPage || formData.siiConnected) {
        message += `SII conectado: Sí\n`;
      } else if (formData.rut && formData.clave && formData.currentStep >= 3) {
        message += `SII conectado: Sí\n`;
      }

      // Agregar console.log para debuggear el mensaje final
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
    console.log("WhatsApp button form data:", formData);
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
