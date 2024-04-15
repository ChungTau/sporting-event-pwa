"use client";

import React from 'react';
import HeaderUI from './ui';
import { LocaleProps } from '@/types/localeProps';
import { useTranslation } from '@/lib/i18n/client';

const Header = ({lng}:LocaleProps) => {
  const { t } = useTranslation(lng, "header");

  return <HeaderUI t={t} />;
};

export default Header
