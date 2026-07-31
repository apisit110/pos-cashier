import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../i18n/LanguageContext';

const SwitcherButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  background: transparent;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.12);
  }
`;

export const LanguageSwitcher: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <SwitcherButton
      type="button"
      className={className}
      style={style}
      onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
      aria-label="Toggle language"
    >
      {language === 'en' ? '🇹🇭 ไทย' : '🇬🇧 EN'}
    </SwitcherButton>
  );
};
