import { createContext, useContext, useState, useEffect } from 'react'
import { ConfigProvider, theme as antTheme } from 'antd'
import koKR from 'antd/locale/ko_KR'

const ThemeContext = createContext()

export const themes = {
  dark: {
    name: 'dark',
    colors: {
      background: '#141414',
      sidebar: '#1f1f1f',
      card: '#1f1f1f',
      cardHover: '#2a2a2a',
      border: '#303030',
      text: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#666666',
      primary: '#667eea',
      primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      input: '#1f1f1f',
      inputBorder: '#434343',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
    }
  },
  light: {
    name: 'light',
    colors: {
      background: '#f0f2f5',
      sidebar: '#ffffff',
      card: '#ffffff',
      cardHover: '#fafafa',
      border: '#d9d9d9',
      text: '#000000',
      textSecondary: '#595959',
      textMuted: '#8c8c8c',
      primary: '#667eea',
      primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      input: '#ffffff',
      inputBorder: '#d9d9d9',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
    }
  }
}

// Ant Design 테마 설정
const getAntTheme = (isDark) => ({
  algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#667eea',
    borderRadius: 8,
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      siderBg: isDark ? '#1f1f1f' : '#ffffff',
      headerBg: isDark ? '#1f1f1f' : '#ffffff',
      bodyBg: isDark ? '#141414' : '#f0f2f5',
    },
    Menu: {
      darkItemBg: '#1f1f1f',
      darkSubMenuItemBg: '#141414',
    },
    Table: {
      headerBg: isDark ? '#1f1f1f' : '#fafafa',
    },
  },
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    // body 배경색 변경
    document.body.style.backgroundColor = themes[theme].colors.background
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark'

  const value = {
    theme,
    setTheme,
    toggleTheme,
    colors: themes[theme].colors,
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        locale={koKR}
        theme={getAntTheme(isDark)}
      >
        {children}
      </ConfigProvider>
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
