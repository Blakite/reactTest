import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  dark: {
    name: 'dark',
    colors: {
      background: '#1a1a2e',
      sidebar: '#16213e',
      card: '#16213e',
      cardHover: '#1e2a47',
      border: '#2d3a4f',
      text: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#666666',
      primary: '#667eea',
      primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      input: '#1a1a2e',
      inputBorder: '#444444',
      success: '#4ade80',
      warning: '#fbbf24',
      danger: '#f87171',
    }
  },
  light: {
    name: 'light',
    colors: {
      background: '#f5f7fa',
      sidebar: '#ffffff',
      card: '#ffffff',
      cardHover: '#f8f9fa',
      border: '#e2e8f0',
      text: '#1a202c',
      textSecondary: '#4a5568',
      textMuted: '#a0aec0',
      primary: '#667eea',
      primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      input: '#ffffff',
      inputBorder: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
    }
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    colors: themes[theme].colors,
    isDark: theme === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
