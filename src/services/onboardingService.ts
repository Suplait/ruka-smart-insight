import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/supabase";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import { pushToDataLayer } from "@/utils/dataLayer";

export const saveFormData = async (
  leadId: number | string | undefined,
  currentStep: number,
  formData: {
    facturas: number;
    sistema: string;
    sistemaCustom: string;
    subdominio: string;
    rut: string;
    clave: string;
  },
  restaurantName: string
): Promise<boolean> => {
  try {
    if (!leadId) {
      return false;
    }

    let updateData: Record<string, any> = {};
    let stepName = '';
    let eventName = '';

    if (currentStep === 0) {
      // Billing system step
      updateData = {
        sistema_facturacion: formData.sistema,
        sistema_custom: formData.sistemaCustom
      };
      stepName = 'billing-system-selected';
      eventName = 'onboarding_step_1_billing';
    } else if (currentStep === 2) {
      // Subdomain step (step 1 is now invoices, handled separately)
      updateData = {
        subdominio: formData.subdominio
      };
      stepName = 'subdomain-selected';
      eventName = 'onboarding_step_3_subdomain';
    } else if (currentStep === 3) {
      // SII credentials step
      updateData = {
        rut: formData.rut,
        clave_sii: formData.clave,
        sii_connected: true
      };
      stepName = 'sii-credentials';
      eventName = 'onboarding_step_4_sii';
    }

    try {
      const numericLeadId = Number(leadId);
      const response = await supabase.functions.invoke('update-lead', {
        body: {
          leadId: numericLeadId,
          updateData
        }
      });

      if (response.error || !response.data?.success) {
        return false;
      }

      if (stepName) {
        const leadDataForSlack: Partial<Lead> = {
          sistema_facturacion: formData.sistema,
          sistema_custom: formData.sistemaCustom,
          subdominio: formData.subdominio,
          rut: formData.rut,
          facturas_compra_mes: formData.facturas,
          sii_connected: formData.sistema === 'sii' ? true : undefined
        };
        
        notifySlackOnboardingStep(numericLeadId, stepName, leadDataForSlack);

        pushToDataLayer(eventName, {
          leadId: numericLeadId,
          step: currentStep + 1,
          stepName: stepName,
          ...leadDataForSlack
        });
      }

      return true;
    } catch (edgeFunctionError) {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const validateSiiCredentials = async (rut: string, password: string) => {
  try {
    console.log(`Validating SII credentials for RUT: ${rut}`);
    
    // Use the Supabase Edge Function for validation
    const response = await supabase.functions.invoke('validate-sii', {
      body: {
        rut: rut,
        password: password
      }
    });
    
    console.log('SII validation response:', response);
    
    if (response.error) {
      console.error('SII validation error:', response.error);
      return {
        success: false,
        error: response.error.message
      };
    }
    
    // Make sure we correctly interpret the response
    const isSuccess = response.data?.success === true;
    console.log(`SII validation result: ${isSuccess ? 'success' : 'failed'}`);
    
    return {
      success: isSuccess,
      error: response.data?.error || response.data?.message
    };
  } catch (error) {
    console.error('SII validation exception:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const generateSubdomain = (name: string) => {
  if (!name) return '';
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .trim();
};
