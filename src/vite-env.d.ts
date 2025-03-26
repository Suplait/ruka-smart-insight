
/// <reference types="vite/client" />

// Extend Window interface to include dataLayer property
interface Window {
  dataLayer?: any[];
}
