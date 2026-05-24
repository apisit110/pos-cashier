import React, { useState } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';
import { ThemeContext } from './ThemeContext';
import type { ThemeMode } from './ThemeContext';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
  const [mode, setMode] = useState<ThemeMode>('dark');

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
