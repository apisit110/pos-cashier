// Tier 1: Primitives (Internal)
const primitives = {
  colors: {
    slate: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#64748b',
      '600': '#475569',
      '700': '#334155',
      '800': '#1e293b',
      '900': '#0f172a',
      '950': '#020617'
    },
    blue: {
      '50': '#eff6ff',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb'
    },
    purple: {
      '500': '#8b5cf6'
    },
    red: {
      '400': '#f87171',
      '500': '#ef4444'
    }
  },
  spacing: {
    '0': '0rem',
    'px': '1px',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '72px': '4.5rem',
    '280px': '17.5rem'
  },
  borderRadius: {
    'none': '0',
    'sm': '0.375rem',
    'md': '0.5rem',
    'lg': '0.75rem',
    'xl': '1rem',
    '2xl': '1.5rem',
    'full': '9999px'
  },
  fonts: {
    sans: 'var(--font-inter)',
    heading: 'var(--font-outfit)'
  }
}

// Tier 2: Semantics (Internal)
const semantics = {
  colors: {
    background: primitives.colors.slate['950'],
    foreground: primitives.colors.slate['50'],
    primary: primitives.colors.blue['500'],
    secondary: primitives.colors.slate['900'],
    accent: primitives.colors.purple['500'],
    error: primitives.colors.red['500'],
    errorSurface: 'rgba(239, 68, 68, 0.1)',
    errorBorder: 'rgba(239, 68, 68, 0.2)',
    border: 'rgba(255, 255, 255, 0.1)',
    glass: {
      background: 'rgba(255, 255, 255, 0.01)',
      border: 'rgba(255, 255, 255, 0.05)',
      hover: 'rgba(255, 255, 255, 0.03)',
      topbar: 'rgba(15, 23, 42, 0.8)'
    },
    text: {
      primary: primitives.colors.slate['50'],
      muted: 'rgba(248, 250, 252, 0.6)',
      disabled: 'rgba(248, 250, 252, 0.3)'
    }
  },
  typography: {
    fontBody: primitives.fonts.sans,
    fontHeading: primitives.fonts.heading
  },
  spacing: {
    container: primitives.spacing['8'],
    content: primitives.spacing['10'],
    section: primitives.spacing['12'],
    sidebarWidth: primitives.spacing['280px'],
    topbarHeight: primitives.spacing['72px'],
    gap: {
      xs: primitives.spacing['1'],
      sm: primitives.spacing['2'],
      md: primitives.spacing['4'],
      lg: primitives.spacing['6']
    },
    control: {
      padding: primitives.spacing['4'],
      paddingSm: primitives.spacing['3']
    }
  },
  borderRadius: {
    none: primitives.borderRadius.none,
    sm: primitives.borderRadius.sm,
    md: primitives.borderRadius.md,
    lg: primitives.borderRadius.lg,
    xl: primitives.borderRadius.xl,
    full: primitives.borderRadius.full,
    control: primitives.borderRadius.lg,
    container: primitives.borderRadius['2xl']
  },
  shadows: {
    accent: `0 10px 20px -10px ${primitives.colors.blue['500']}`,
    focus: '0 0 0 4px rgba(59, 130, 246, 0.1)'
  }
}

// Tier 3: Components (Exported)
const components = {
  colors: {
    text: {
      primary: semantics.colors.text.primary,
      muted: semantics.colors.text.muted,
      disabled: semantics.colors.text.disabled
    },
    background: semantics.colors.background,
    primary: semantics.colors.primary,
    accent: semantics.colors.accent,
    error: semantics.colors.error,
    glass: {
      background: semantics.colors.glass.background,
      border: semantics.colors.glass.border,
      hover: semantics.colors.glass.hover,
      topbar: semantics.colors.glass.topbar
    }
  },
  spacing: {
    gap: semantics.spacing.gap,
    container: semantics.spacing.container,
    section: semantics.spacing.section,
    content: semantics.spacing.content
  },
  fonts: {
    heading: semantics.typography.fontHeading,
    body: semantics.typography.fontBody
  },
  borderRadius: {
    full: semantics.borderRadius.full,
    control: semantics.borderRadius.control,
    container: semantics.borderRadius.container
  },
  shadows: {
    accent: semantics.shadows.accent,
    focus: semantics.shadows.focus
  },
  typography: {
    title: {
      font: semantics.typography.fontHeading,
      color: semantics.colors.text.primary,
      accent: semantics.colors.primary
    },
    subtitle: {
      color: semantics.colors.text.muted,
      font: semantics.typography.fontBody
    },
    error: {
      color: semantics.colors.error,
      background: semantics.colors.errorSurface,
      border: semantics.colors.errorBorder,
      borderRadius: semantics.borderRadius.control,
      padding: semantics.spacing.gap.md
    }
  },
  layout: {
    dashboard: {
      background: semantics.colors.background,
      sidebarWidth: semantics.spacing.sidebarWidth,
      topbarHeight: semantics.spacing.topbarHeight,
      zIndex: {
        sidebar: 50,
        topbar: 40
      }
    }
  },
  button: {
    background: semantics.colors.primary,
    color: semantics.colors.foreground,
    borderRadius: semantics.borderRadius.control,
    padding: semantics.spacing.control.padding,
    gap: semantics.spacing.gap.sm,
    shadow: semantics.shadows.accent,
    secondary: {
      border: semantics.colors.border,
      hoverBackground: semantics.colors.glass.hover
    }
  },
  input: {
    background: semantics.colors.glass.hover,
    border: semantics.colors.border,
    color: semantics.colors.text.primary,
    placeholder: semantics.colors.text.disabled,
    borderRadius: semantics.borderRadius.control,
    padding: semantics.spacing.control.paddingSm,
    gap: semantics.spacing.gap.sm,
    focus: {
      border: semantics.colors.primary,
      background: semantics.colors.glass.hover,
      shadow: semantics.shadows.focus
    }
  },
  card: {
    background: semantics.colors.glass.background,
    borderRadius: semantics.borderRadius.container,
    border: semantics.colors.glass.border,
    padding: semantics.spacing.section,
    gap: semantics.spacing.content
  },
  authLayout: {
    background: semantics.colors.background,
    foreground: semantics.colors.foreground,
    brandSurface: semantics.colors.secondary,
    brandAccent: semantics.colors.primary,
    fontBody: semantics.typography.fontBody,
    fontHeading: semantics.typography.fontHeading,
    padding: semantics.spacing.container
  },
  sidebar: {
    background: semantics.colors.secondary,
    border: semantics.colors.glass.border,
    padding: semantics.spacing.gap.md,
    gap: semantics.spacing.gap.sm,
    item: {
      padding: `${semantics.spacing.gap.sm} ${semantics.spacing.gap.md}`,
      borderRadius: semantics.borderRadius.md,
      gap: semantics.spacing.gap.sm,
      hover: semantics.colors.glass.hover,
      active: semantics.colors.primary,
      text: semantics.colors.text.muted,
      activeText: semantics.colors.text.primary
    }
  },
  topbar: {
    background: semantics.colors.glass.topbar,
    border: semantics.colors.glass.border,
    padding: semantics.spacing.gap.lg,
    avatarSize: '40px',
    logoContainerWidth: semantics.spacing.sidebarWidth,
    search: {
      background: semantics.colors.glass.hover,
      padding: `${semantics.spacing.gap.sm} ${semantics.spacing.gap.md}`,
      borderRadius: semantics.borderRadius.full,
      border: semantics.colors.glass.border,
      placeholderColor: semantics.colors.text.disabled,
      textColor: semantics.colors.text.primary
    },
    actions: {
      gap: semantics.spacing.gap.lg,
      iconColor: semantics.colors.text.muted,
      iconHoverColor: semantics.colors.text.primary
    },
    userArea: {
      gap: semantics.spacing.gap.md,
      nameColor: semantics.colors.text.primary,
      roleColor: semantics.colors.text.muted,
      avatarGradient: {
        from: semantics.colors.primary,
        to: semantics.colors.accent
      }
    },
    badge: {
      color: semantics.colors.primary,
      borderColor: semantics.colors.background
    }
  }
}

/**
 * Combined Tokens Export - Only Components (Tier 3) are exported to components
 */
export const tokens = components

