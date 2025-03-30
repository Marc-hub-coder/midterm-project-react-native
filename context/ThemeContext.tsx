import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  error: string;
  tagBackground: string;
  statusBackground: string;
  statusText: string;
  inputBackground: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#F3F4F6',
  cardBackground: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#666',
  border: '#E5E7EB',
  primary: '#8B5CF6',
  secondary: '#10B981',
  success: '#10B981',
  error: '#EF4444',
  tagBackground: '#F3F4F6',
  statusBackground: '#ECFDF5',
  statusText: '#10B981',
  inputBackground: '#FFFFFF',
};

const darkColors: ThemeColors = {
  background: '#1F2937',
  cardBackground: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#4B5563',
  primary: '#A78BFA',
  secondary: '#34D399',
  success: '#34D399',
  error: '#F87171',
  tagBackground: '#4B5563',
  statusBackground: '#065F46',
  statusText: '#34D399',
  inputBackground: '#4B5563',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
