import React, { useState } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';
import { ThemeContext } from './ThemeContext';
import type { ThemeMode } from './ThemeContext';

const promptFaces = (weight: 400 | 500 | 600 | 700) => `
  @font-face {
    font-family: 'Prompt';
    font-style: normal;
    font-weight: ${weight};
    font-display: swap;
    src: url('/fonts/prompt/prompt-thai-${weight}.woff2') format('woff2');
    unicode-range: U+02D7, U+0303, U+0331, U+0E01-0E5B, U+200C-200D, U+25CC;
  }

  @font-face {
    font-family: 'Prompt';
    font-style: normal;
    font-weight: ${weight};
    font-display: swap;
    src: url('/fonts/prompt/prompt-latin-${weight}.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${promptFaces(400)}
  ${promptFaces(500)}
  ${promptFaces(600)}
  ${promptFaces(700)}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.semantics.colors.bg.main};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  input, button {
    font-family: inherit;
  }

  #root {
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;
  }

  .initializing {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }
`;

export const StyledThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  const activeTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={activeTheme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
