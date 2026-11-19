'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Currency,
  Translations,
  TRANSLATIONS,
  formatPriceByCurrency,
  getPriceInUsd,
} from '@lib/i18n-translations';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  toggleLanguage: () => void;
  t: Translations;
  formatPrice: (amountInIdr: number) => string;
  getPriceUsd: (amountInIdr: number) => number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');
  const [currency, setCurrencyState] = useState<Currency>('IDR');

  // Load language preference from localStorage or auto-detect browser language on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('plivin_lang') as Language | null;
      const savedCurr = localStorage.getItem('plivin_curr') as Currency | null;

      if (savedLang === 'id' || savedLang === 'en') {
        setLanguageState(savedLang);
        setCurrencyState(savedCurr || (savedLang === 'en' ? 'USD' : 'IDR'));
      } else {
        // Auto-detect browser locale
        const browserLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'id';
        if (!browserLang.startsWith('id')) {
          setLanguageState('en');
          setCurrencyState('USD');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newCurr: Currency = lang === 'en' ? 'USD' : 'IDR';
    setCurrencyState(newCurr);
    try {
      localStorage.setItem('plivin_lang', lang);
      localStorage.setItem('plivin_curr', newCurr);
    } catch {
      // ignore
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('plivin_curr', curr);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const t = TRANSLATIONS[language];

  const formatPrice = (amountInIdr: number): string => {
    return formatPriceByCurrency(amountInIdr, currency);
  };

  const getPriceUsd = (amountInIdr: number): number => {
    return getPriceInUsd(amountInIdr);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        toggleLanguage,
        t,
        formatPrice,
        getPriceUsd,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback Indonesian translation if used outside LanguageProvider
    return {
      language: 'id' as Language,
      currency: 'IDR' as Currency,
      setLanguage: () => {},
      setCurrency: () => {},
      toggleLanguage: () => {},
      t: TRANSLATIONS.id,
      formatPrice: (amount: number) => formatPriceByCurrency(amount, 'IDR'),
      getPriceUsd: (amount: number) => getPriceInUsd(amount),
    };
  }
  return context;
}
