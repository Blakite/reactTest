import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import SettingsPopup from '../components/SettingsPopup'

const menuConfig = {
  accounting: {
    title: '회계관리',
    icon: '💰',
    items: [
      { path: '/accounting', label: '대시보드', icon: '📊' },
      { path: '/accounting/journal', label: '분개장', icon: '📝' },
      { path: '/accounting/accounts', label: '계정과목', icon: '📋' },
      { path: '/accounting/vouchers', label: '전표관리', icon: '🧾' },
    ],
  },
  construction: {
    title: '공사관리',
    icon: '🏗️',
    items: [
      { path: '/construction', label: '대시보드', icon: '📊' },
      { path: '/construction/projects', label: '공사목록', icon: '📁' },
      { path: '/construction/contracts', label: '계약관리', icon: '📄' },
      { path: '/construction/progress', label: '기성관리', icon: '📈' },
    ],
  },
}

function MainLayout({ module }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { colors, isDark } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  
  const currentMenu = menuConfig[module]

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
    navigate('/login')
  }

  const styles = getStyles(colors)

  return (
    <div style={styles.container}>
      {/* 사이드바 */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏢</span>
          <span style={styles.logoText}>ERP System</span>
        </div>

        {/* 모듈 선택 */}
        <div style={styles.moduleSelector}>
          <Link 
            to="/accounting" 
            style={{
              ...styles.moduleBtn,
              ...(module === 'accounting' ? styles.moduleBtnActive : {})
            }}
          >
            💰 회계
          </Link>
          <Link 
            to="/construction" 
            style={{
              ...styles.moduleBtn,
              ...(module === 'construction' ? styles.moduleBtnActive : {})
            }}
          >
            🏗️ 공사
          </Link>
        </div>

        {/* 현재 모듈 메뉴 */}
        <div style={styles.menuSection}>
          <h3 style={styles.menuTitle}>
            {currentMenu.icon} {currentMenu.title}
          </h3>
          <nav style={styles.nav}>
            {currentMenu.items.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.menuItem,
                    ...(isActive ? styles.menuItemActive : {})
                  }}
                >
                  <span style={styles.menuIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 하단 */}
        <div style={styles.sidebarFooter}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div style={styles.main}>
        {/* 헤더 */}
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {currentMenu.title}
          </h1>
          <div 
            style={styles.userInfo}
            onClick={() => setShowSettings(true)}
          >
            <div style={styles.userAvatar}>👤</div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>관리자</span>
              <span style={styles.userRole}>Administrator</span>
            </div>
            <span style={styles.settingsIcon}>⚙️</span>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>

      {/* 설정 팝업 */}
      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

const getStyles = (colors) => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  sidebar: {
    width: '250px',
    backgroundColor: colors.sidebar,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${colors.border}`,
  },
  logo: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: `1px solid ${colors.border}`,
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    color: colors.text,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  moduleSelector: {
    display: 'flex',
    padding: '15px',
    gap: '10px',
  },
  moduleBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: colors.background,
    color: colors.textSecondary,
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  moduleBtnActive: {
    backgroundColor: colors.primary,
    color: '#fff',
  },
  menuSection: {
    flex: 1,
    padding: '10px 15px',
  },
  menuTitle: {
    color: colors.textSecondary,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    marginBottom: '15px',
    paddingLeft: '10px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    borderRadius: '8px',
    color: colors.textSecondary,
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  },
  menuItemActive: {
    backgroundColor: colors.primary,
    color: '#fff',
  },
  menuIcon: {
    fontSize: '1.1rem',
  },
  sidebarFooter: {
    padding: '15px',
    borderTop: `1px solid ${colors.border}`,
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: colors.background,
    color: colors.textSecondary,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: colors.sidebar,
    borderBottom: `1px solid ${colors.border}`,
  },
  pageTitle: {
    color: colors.text,
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    color: colors.text,
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  userRole: {
    color: colors.textSecondary,
    fontSize: '0.75rem',
  },
  settingsIcon: {
    fontSize: '1.2rem',
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
  },
})

export default MainLayout
