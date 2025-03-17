
/**
 * Type definition for Google Tag Manager dataLayer
 */
interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

/**
 * Push an event to the dataLayer for Google Tag Manager
 * @param eventName - The name of the event to push
 * @param additionalData - Any additional data to include with the event
 * @returns boolean - Whether the push was successful
 */
export const pushToDataLayer = (eventName: string, additionalData = {}): boolean => {
  try {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...additionalData,
        timestamp: new Date().toISOString()
      });
      return true;
    }
    console.warn('dataLayer not initialized');
    return false;
  } catch (error) {
    console.error('Error pushing to dataLayer:', error);
    return false;
  }
};

/**
 * Track form submission events
 * @param formName - The name of the form being submitted
 * @param formData - The data being submitted (sensitive data will be removed)
 * @param success - Whether the submission was successful
 */
export const trackFormSubmission = (formName: string, formData: Record<string, any>, success: boolean): void => {
  // Create a safe copy of formData without any sensitive fields
  const safeFormData = { ...formData };
  
  // Remove sensitive information
  const sensitiveFields = ['password', 'clave', 'clave_sii', 'token'];
  sensitiveFields.forEach(field => {
    if (field in safeFormData) {
      delete safeFormData[field];
    }
  });
  
  pushToDataLayer(success ? 'form_submission_success' : 'form_submission_failure', {
    form_name: formName,
    form_data: safeFormData
  });
};

/**
 * Track registration events specifically
 */
export const trackRegistration = (registrationData: Record<string, any>, success: boolean): void => {
  const eventName = success ? 'registration_success' : 'registration_error';
  
  // Create safe copy without sensitive data
  const safeData = { ...registrationData };
  delete safeData.acceptTerms; // Remove boolean value
  
  pushToDataLayer(eventName, {
    registration_data: safeData
  });
};
