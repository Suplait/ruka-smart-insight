
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, ArrowRight } from "lucide-react";

interface SubdomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubdomainModal = ({ isOpen, onClose }: SubdomainModalProps) => {
  const [subdomain, setSubdomain] = useState("");

  const handleLogin = () => {
    if (subdomain.trim()) {
      window.location.href = `https://${subdomain.toLowerCase()}.ruka.ai/`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription id="dialog-description" className="text-center pt-2">
            Ingresa el subdominio de tu empresa para acceder a tu cuenta
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-6 py-6">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="tu-empresa"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
              />
              <div className="text-sm text-muted-foreground">.ruka.ai</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-center">
                    <p>¿No conoces tu subdominio?</p>
                    <p>Consúltalo en tu grupo de WhatsApp de soporte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full"
            disabled={!subdomain.trim()}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Iniciar Sesión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubdomainModal;
