
import React from 'react';
import { Check } from 'lucide-react';

const SuccessContent = () => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold">¡Todo listo! 🎉</h2>
      
      <div className="space-y-4 text-gray-600">
        <p>
          Ahora levantaremos tu plataforma y cargaremos los datos iniciales para que Ruka los agrupe y clasifique. En breve:
        </p>
        
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Crearemos un grupo de WhatsApp para asistirte siempre que lo necesites</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Te enviaremos las credenciales de acceso cuando la plataforma esté lista</p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm">Agendaremos una reunión de capacitación para que saques el máximo provecho</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessContent;
