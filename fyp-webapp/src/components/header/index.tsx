// Header.tsx
import React from 'react';
import HeaderUI from './ui';
import { LocaleProps } from '@/types/localeProps';
import { useTranslation } from '@/lib/i18n';

const Header = async({lng}:LocaleProps) => {
  const { t } = await useTranslation(lng, "header");
  return <HeaderUI t={t} />;
};

export default Header
