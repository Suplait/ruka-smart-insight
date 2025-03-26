
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLanguage);
    // Store the language preference in localStorage
    localStorage.setItem('i18nextLng', nextLanguage);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="hidden md:inline">{t('language')}</span>
    </Button>
  );
};

export default LanguageSwitcher;
