
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RUKA_WORKS_CALENDLY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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
