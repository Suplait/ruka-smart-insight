
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
  }
};
