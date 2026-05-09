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
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
    },
    rose: {
      500: '#f43f5e',
    },
    emerald: {
      500: '#10b981',
    }
  }
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
      error: primitives.colors.rose[500],
      success: primitives.colors.emerald[500],
    },
    accent: {
      primary: primitives.colors.indigo[500],
      hover: primitives.colors.indigo[600],
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      focus: primitives.colors.indigo[500],
    }
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
  }
};
