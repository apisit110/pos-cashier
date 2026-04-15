'use client'

import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { Bell, Search } from 'lucide-react'
import React from 'react'

const TopbarContainer = styled.header`
  height: ${tokens.layout.dashboard.topbarHeight};
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  background-color: ${tokens.topbar.background};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${tokens.topbar.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  z-index: ${tokens.layout.dashboard.zIndex.topbar};
`

const LogoContainer = styled.div`
  width: ${tokens.topbar.logoContainerWidth};
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${tokens.topbar.padding};
`

const LogoText = styled.span`
  font-family: ${tokens.typography.title.font};
  font-size: 1.25rem;
  font-weight: 800;
  color: ${tokens.typography.title.accent};
  letter-spacing: -0.02em;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.input.gap};
  background-color: ${tokens.topbar.search.background};
  padding: ${tokens.topbar.search.padding};
  border-radius: ${tokens.topbar.search.borderRadius};
  border: 1px solid ${tokens.topbar.search.border};
  width: 320px;

  svg {
    width: 18px;
    height: 18px;
    color: ${tokens.topbar.search.placeholderColor};
  }

  input {
    background: transparent;
    border: none;
    color: ${tokens.topbar.search.textColor};
    font-size: 0.875rem;
    outline: none;
    width: 100%;

    &::placeholder {
      color: ${tokens.topbar.search.placeholderColor};
    }
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.topbar.actions.gap};
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${tokens.topbar.actions.iconColor};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${tokens.topbar.actions.iconHoverColor};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: ${tokens.topbar.badge.color};
  border-radius: 50%;
  border: 2px solid ${tokens.topbar.badge.borderColor};
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.topbar.userArea.gap};
  cursor: pointer;
`

const Avatar = styled.div`
  width: ${tokens.topbar.avatarSize};
  height: ${tokens.topbar.avatarSize};
  border-radius: ${tokens.borderRadius.full};
  background: linear-gradient(135deg, ${tokens.topbar.userArea.avatarGradient.from} 0%, ${tokens.topbar.userArea.avatarGradient.to} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.875rem;
  border: 2px solid ${tokens.topbar.border};
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    display: none;
  }
`

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.topbar.userArea.nameColor};
`

const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${tokens.topbar.userArea.roleColor};
`

export function Topbar () {
  return (
    <TopbarContainer id='topbar'>
      <LogoContainer>
        <LogoText>LIGHTNING</LogoText>
      </LogoContainer>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `0 ${tokens.topbar.padding}` }}>
        <SearchBar>
          <Search />
          <input type='text' placeholder='Quick search...' />
        </SearchBar>
        
        <Actions>
          <IconButton>
            <Bell />
            <Badge />
          </IconButton>
          
          <UserSection>
            <UserInfo>
              <UserName>Johny Sins</UserName>
              <UserRole>Administrator</UserRole>
            </UserInfo>
            <Avatar>JS</Avatar>
          </UserSection>
        </Actions>
      </div>
    </TopbarContainer>
  )
}

