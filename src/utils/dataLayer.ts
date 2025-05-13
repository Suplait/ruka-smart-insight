
/**
 * Push an event to the dataLayer for Google Tag Manager
 */
export const pushToDataLayer = (eventName: string, additionalData = {}) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...additionalData,
      timestamp: new Date().toISOString()
    });
    console.log(`DataLayer: ${eventName}`, additionalData);
  } else {
    console.log('DataLayer not found', eventName, additionalData);
  }
};

/**
 * Track form submission events with additional metadata
 */
export const trackFormSubmission = (formName: string, formData = {}, isSuccess = true) => {
  // Sanitize sensitive data before pushing to dataLayer
  const sanitizedData = { ...formData };
  const sensitiveFields = ['password', 'clave', 'clave_sii', 'token'];
  
  for (const field of sensitiveFields) {
    if (field in sanitizedData) {
      delete sanitizedData[field];
    }
  }
  
  pushToDataLayer(`form_submission_${isSuccess ? 'success' : 'failure'}`, {
    form_name: formName,
    form_data: sanitizedData
  });
};

/**
 * Track user registration events
 */
export const trackRegistration = (registrationData = {}, isSuccess = true) => {
  // Sanitize sensitive data before pushing to dataLayer
  const sanitizedData = { ...registrationData };
  const sensitiveFields = ['password', 'clave', 'clave_sii', 'token'];
  
  for (const field of sensitiveFields) {
    if (field in sanitizedData) {
      delete sanitizedData[field];
    }
  }
  
  pushToDataLayer(`registration_${isSuccess ? 'success' : 'error'}`, {
    ...sanitizedData
  });
};

/**
 * Track WhatsApp preference click event
 */
export const trackWhatsAppClick = (source: string, eventName: string = 'whatsapp_preference_click') => {
  pushToDataLayer(eventName, {
    source: source
  });
};

