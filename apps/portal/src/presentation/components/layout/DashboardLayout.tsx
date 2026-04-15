'use client'

import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import React from 'react'

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${tokens.layout.dashboard.background};
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.typography.subtitle.font};
`

const MainContent = styled.main`
  padding-top: ${tokens.layout.dashboard.topbarHeight};
  padding-left: ${tokens.layout.dashboard.sidebarWidth};
  min-height: 100vh;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`

const ContentWrapper = styled.div`
  padding: ${tokens.authLayout.padding};
  max-width: 1600px;
  margin: 0 auto;
`

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout ({ children }: DashboardLayoutProps) {
  return (
    <LayoutContainer id='dashboard-layout'>
      <Sidebar />
      <Topbar />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  )
}
