export interface UTMParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
}

const UTM_STORAGE_KEY = 'utm_params';

export const extractUTMParams = (): UTMParams => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || null,
    utm_medium: urlParams.get('utm_medium') || null,
    utm_campaign: urlParams.get('utm_campaign') || null,
    utm_content: urlParams.get('utm_content') || null,
  };
};

export const saveUTMParams = (utmParams: UTMParams): void => {
  // Only save if at least one UTM parameter exists
  const hasUTMParams = Object.values(utmParams).some(value => value !== null && value !== '');
  
  if (hasUTMParams) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
  }
};

export const getStoredUTMParams = (): UTMParams => {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error reading UTM params from localStorage:', error);
  }
  
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
  };
};

export const clearUTMParams = (): void => {
  localStorage.removeItem(UTM_STORAGE_KEY);
};