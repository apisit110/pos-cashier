'use client'

import React from 'react'
import styled from 'styled-components'
import { DashboardLayout } from '../../presentation/components/layout/DashboardLayout'
import { tokens } from '../../presentation/styles/tokens'
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${tokens.spacing.gap.lg};
  margin-bottom: ${tokens.spacing.section};
`

const StatCard = styled.div`
  background: ${tokens.card.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.card.borderRadius};
  padding: ${tokens.card.padding};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.gap.md};
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${tokens.colors.primary};
  }
`

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const IconWrapper = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`

const StatTitle = styled.span`
  font-size: 0.875rem;
  color: ${tokens.colors.text.muted};
  font-weight: 500;
`

const StatValue = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${tokens.colors.text.primary};
  margin: 0;
  font-family: ${tokens.fonts.heading};
`

const StatTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: ${tokens.card.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.card.borderRadius};
  padding: ${tokens.card.padding};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.gap.lg};
`

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: ${tokens.fonts.heading};
  color: ${tokens.colors.text.primary};
`

const stats = [
  {
    title: 'Total Revenue',
    value: '$124,592.00',
    icon: DollarSign,
    trend: '+12.5%',
    positive: true,
    color: tokens.colors.primary
  },
  {
    title: 'New Customers',
    value: '1,284',
    icon: Users,
    trend: '+18.2%',
    positive: true,
    color: '#8b5cf6'
  },
  {
    title: 'Total Sales',
    value: '3,842',
    icon: ShoppingCart,
    trend: '-3.1%',
    positive: false,
    color: '#f59e0b'
  },
  {
    title: 'Growth Rate',
    value: '22.4%',
    icon: TrendingUp,
    trend: '+4.3%',
    positive: true,
    color: '#10b981'
  }
]

export default function DashboardPage () {
  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.gap.lg }}>
        <div>
          <SectionTitle>Dashboard Overview</SectionTitle>
          <p style={{ color: tokens.colors.text.muted, fontSize: '0.875rem' }}>
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        <Grid>
          {stats.map((stat, i) => (
            <StatCard key={i}>
              <StatHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <StatTitle>{stat.title}</StatTitle>
                  <StatValue>{stat.value}</StatValue>
                </div>
                <IconWrapper $color={stat.color}>
                  <stat.icon />
                </IconWrapper>
              </StatHeader>
              <StatTrend $positive={stat.positive}>
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
                <span style={{ color: tokens.colors.text.muted, fontWeight: 400, marginLeft: '4px' }}>
                  vs last month
                </span>
              </StatTrend>
            </StatCard>
          ))}
        </Grid>

        <ChartPlaceholder>
          <SectionTitle>Revenue Analytics</SectionTitle>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0' }}>
            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 100].map((h, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, 
                  height: `${h}%`, 
                  background: `linear-gradient(to top, ${tokens.colors.primary} 0%, ${tokens.colors.primary}44 100%)`,
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.colors.text.disabled, fontSize: '0.75rem' }}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </ChartPlaceholder>
      </div>
    </DashboardLayout>
  )
}
