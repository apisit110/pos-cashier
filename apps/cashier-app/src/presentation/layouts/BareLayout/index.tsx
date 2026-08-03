import React from 'react';
import { LayoutContainer } from '../LayoutContainer';
import { MainContent } from '../MainContent';

interface BareLayoutProps {
  children: React.ReactNode;
}

export const BareLayout: React.FC<BareLayoutProps> = ({ children }) => (
  <LayoutContainer>
    <MainContent>
      {children}
    </MainContent>
  </LayoutContainer>
);
