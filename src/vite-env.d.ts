
/// <reference types="vite/client" />

interface Window {
  dataLayer?: any[];
  Calendly?: {
    initInlineWidget: (options: {
      url: string;
      parentElement: HTMLElement;
      prefill?: {
        name?: string;
        email?: string;
        textReminderNumber?: string;
        customAnswers?: {
          [key: string]: string;
        };
      };
    }) => void;
  };
}
