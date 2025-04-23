
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
  pushToDataLayer(`form_${isSuccess ? 'success' : 'error'}`, {
    form_name: formName,
    form_data: formData
  });
};

/**
 * Track user registration events
 */
export const trackRegistration = (registrationData = {}, isSuccess = true) => {
  pushToDataLayer(`registration_${isSuccess ? 'success' : 'error'}`, {
    ...registrationData
  });
};
