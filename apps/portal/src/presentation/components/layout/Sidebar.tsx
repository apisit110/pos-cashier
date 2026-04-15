'use client'

import styled from 'styled-components'
import { tokens } from '../../styles/tokens'
import { Home, Settings, Users, CreditCard, PieChart, Package, ShoppingBag } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarContainer = styled.aside`
  width: ${tokens.layout.dashboard.sidebarWidth};
  height: calc(100vh - ${tokens.layout.dashboard.topbarHeight});
  position: fixed;
  left: 0;
  top: ${tokens.layout.dashboard.topbarHeight};
  background-color: ${tokens.sidebar.background};
  border-right: 1px solid ${tokens.sidebar.border};
  display: flex;
  flex-direction: column;
  z-index: ${tokens.layout.dashboard.zIndex.sidebar};
`

const NavContainer = styled.nav`
  flex: 1;
  padding: ${tokens.sidebar.padding};
  display: flex;
  flex-direction: column;
  gap: ${tokens.sidebar.gap};
`

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.sidebar.item.gap};
  padding: ${tokens.sidebar.item.padding};
  border-radius: ${tokens.sidebar.item.borderRadius};
  color: ${props => props.$active ? tokens.sidebar.item.activeText : tokens.sidebar.item.text};
  background-color: ${props => props.$active ? tokens.sidebar.item.hover : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: ${tokens.sidebar.item.hover};
    color: ${tokens.sidebar.item.activeText};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const NavLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`

const navItems = [
  { icon: Home, label: 'Dashboard', id: 'dashboard', href: '/dashboard' },
  { icon: PieChart, label: 'Analytics', id: 'analytics', href: '/dashboard/analytics' },
  { icon: Package, label: 'Products', id: 'products', href: '/dashboard/products' },
  { icon: ShoppingBag, label: 'Orders', id: 'orders', href: '/dashboard/orders' },
  { icon: CreditCard, label: 'Transactions', id: 'transactions', href: '/dashboard/transactions' }
]

export function Sidebar () {
  const pathname = usePathname()

  return (
    <SidebarContainer id='sidebar'>
      <NavContainer>
        {navItems.map((item) => (
          <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
            <NavItem $active={pathname === item.href || (item.id === 'dashboard' && pathname === '/dashboard')}>
              <item.icon />
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          </Link>
        ))}
      </NavContainer>
    </SidebarContainer>
  )
}

