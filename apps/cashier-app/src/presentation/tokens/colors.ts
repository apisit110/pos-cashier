export const primitives = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    indigo: {
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
    green: {
      400: '#4ade80',
      500: '#22c55e',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
    },
    rose: {
      500: '#f43f5e',
    },
    emerald: {
      500: '#10b981',
    },
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '0.9375rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.025em',
    },
  },
  sizes: {
    sidebar: {
      expanded: '280px',
      collapsed: '80px',
    },
    icon: {
      sm: '18px',
      md: '22px',
      lg: '24px',
      avatar: '40px',
    },
  },
};

export const semantics = {
  colors: {
    bg: {
      main: primitives.colors.slate[950],
      card: 'rgba(30, 41, 59, 0.7)',
    },
    text: {
      primary: primitives.colors.white,
      secondary: primitives.colors.slate[400],
      disabled: primitives.colors.slate[600],
      error: primitives.colors.rose[500],
      success: primitives.colors.emerald[500],
    },
    accent: {
      primary: primitives.colors.indigo[500],
      hover: primitives.colors.indigo[600],
      subtleBg: 'rgba(99, 102, 241, 0.1)',
      subtleBgHover: 'rgba(99, 102, 241, 0.05)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      focus: primitives.colors.indigo[500],
    },
    status: {
      success: {
        text: primitives.colors.green[500],
        softBg: 'rgba(34, 197, 94, 0.1)',
        softBorder: 'rgba(34, 197, 94, 0.2)',
      },
      error: {
        text: primitives.colors.red[500],
        softBg: 'rgba(239, 68, 68, 0.1)',
        softBorder: 'rgba(239, 68, 68, 0.2)',
      },
      info: {
        text: primitives.colors.indigo[400],
        softBg: 'rgba(99, 102, 241, 0.1)',
        softBorder: 'rgba(99, 102, 241, 0.2)',
      },
    },
  },
  effects: {
    glass: 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  }
};

export const components = {
  button: {
    primary: {
      bg: semantics.colors.accent.primary,
      hover: semantics.colors.accent.hover,
      text: semantics.colors.text.primary,
    },
    error: {
      text: semantics.colors.text.error,
    }
  },
  card: {
    bg: semantics.colors.bg.card,
    border: semantics.colors.border.subtle,
  },
  input: {
    border: semantics.colors.border.subtle,
    focus: semantics.colors.border.focus,
  },
  badge: {
    success: semantics.colors.status.success,
    error: semantics.colors.status.error,
    info: semantics.colors.status.info,
  },
  navItem: {
    activeBg: semantics.colors.accent.subtleBg,
    hoverBg: semantics.colors.accent.subtleBgHover,
    activeColor: semantics.colors.accent.primary,
    defaultColor: semantics.colors.text.secondary,
    hoverColor: semantics.colors.accent.primary,
  },
  logoutButton: {
    hoverBorder: primitives.colors.red[500],
    hoverColor: primitives.colors.red[500],
    hoverBg: 'rgba(239, 68, 68, 0.05)',
  },
};
