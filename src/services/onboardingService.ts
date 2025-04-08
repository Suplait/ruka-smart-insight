
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/supabase";
import { notifySlackOnboardingStep } from "@/utils/slackNotifier";
import { pushToDataLayer } from "@/utils/dataLayer";

export const saveFormData = async (
  leadId: number | string | undefined,
  currentStep: number,
  formData: {
    meses: number;
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
      updateData = {
        meses_datos: formData.meses
      };
      stepName = 'data-months-selected';
      eventName = 'onboarding_step_1_months';
    } else if (currentStep === 1) {
      updateData = {
        sistema_facturacion: formData.sistema,
        sistema_custom: formData.sistemaCustom
      };
      stepName = 'billing-system-selected';
      eventName = 'onboarding_step_2_billing';
    } else if (currentStep === 2) {
      updateData = {
        subdominio: formData.subdominio
      };
      stepName = 'subdomain-selected';
      eventName = 'onboarding_step_3_subdomain';
    } else if (currentStep === 3) {
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
          meses_datos: formData.meses,
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
    const headers = {
      "Content-Type": "application/json"
    };
    const params = {
      rut: rut,
      password: password
    };
    const response = await fetch("https://scraper.ruka.ai/api/validate_sii_credentials", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params)
    });
    const responseData = await response.json();
    return {
      success: responseData.success === true,
      error: responseData.error
    };
  } catch (error) {
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
