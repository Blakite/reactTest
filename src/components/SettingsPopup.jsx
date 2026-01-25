import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function SettingsPopup({ isOpen, onClose }) {
  const { colors, theme, toggleTheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('settings')
  
  // 로그인 시간 (실제로는 서버에서 가져옴)
  const loginTime = localStorage.getItem('loginTime') || new Date().toLocaleString('ko-KR')
  
  if (!isOpen) return null

  const styles = getStyles(colors)

  return (
    <>
      {/* 배경 오버레이 */}
      <div style={styles.overlay} onClick={onClose} />
      
      {/* 팝업 */}
      <div style={styles.popup}>
        <div style={styles.header}>
          <h3 style={styles.title}>⚙️ 설정</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* 탭 */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'settings' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('settings')}
          >
            설정
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'password' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('password')}
          >
            비밀번호 변경
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'info' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'settings' && (
            <SettingsTab colors={colors} isDark={isDark} toggleTheme={toggleTheme} />
          )}
          {activeTab === 'password' && (
            <PasswordTab colors={colors} />
          )}
          {activeTab === 'info' && (
            <InfoTab colors={colors} loginTime={loginTime} />
          )}
        </div>
      </div>
    </>
  )
}

function SettingsTab({ colors, isDark, toggleTheme }) {
  const styles = getStyles(colors)
  
  return (
    <div>
      <div style={styles.settingItem}>
        <div style={styles.settingInfo}>
          <span style={styles.settingLabel}>테마 모드</span>
          <span style={styles.settingDesc}>
            {isDark ? '🌙 다크 모드' : '☀️ 라이트 모드'}
          </span>
        </div>
        <button 
          onClick={toggleTheme}
          style={{
            ...styles.toggleBtn,
            backgroundColor: isDark ? colors.primary : '#e2e8f0',
          }}
        >
          <div style={{
            ...styles.toggleCircle,
            transform: isDark ? 'translateX(24px)' : 'translateX(0)',
          }} />
        </button>
      </div>
      
      <div style={styles.themePreview}>
        <div 
          style={{
            ...styles.themeCard,
            border: !isDark ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
          }}
          onClick={() => !isDark || toggleTheme()}
        >
          <div style={styles.themeCardLight}>
            <div style={styles.themeCardHeader} />
            <div style={styles.themeCardContent}>
              <div style={styles.themeCardLine} />
              <div style={styles.themeCardLine} />
            </div>
          </div>
          <span style={styles.themeLabel}>☀️ 라이트</span>
        </div>
        
        <div 
          style={{
            ...styles.themeCard,
            border: isDark ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
          }}
          onClick={() => isDark || toggleTheme()}
        >
          <div style={styles.themeCardDark}>
            <div style={{...styles.themeCardHeader, backgroundColor: '#16213e'}} />
            <div style={{...styles.themeCardContent, backgroundColor: '#1a1a2e'}}>
              <div style={{...styles.themeCardLine, backgroundColor: '#2d3a4f'}} />
              <div style={{...styles.themeCardLine, backgroundColor: '#2d3a4f'}} />
            </div>
          </div>
          <span style={styles.themeLabel}>🌙 다크</span>
        </div>
      </div>
    </div>
  )
}

function PasswordTab({ colors }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  
  const styles = getStyles(colors)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newPw !== confirmPw) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    alert('비밀번호가 변경되었습니다. (데모)')
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>현재 비밀번호</label>
        <input
          type="password"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>새 비밀번호</label>
        <input
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>새 비밀번호 확인</label>
        <input
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <button type="submit" style={styles.submitBtn}>
        비밀번호 변경
      </button>
    </form>
  )
}

function InfoTab({ colors, loginTime }) {
  const styles = getStyles(colors)
  
  return (
    <div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>👤 사용자</span>
        <span style={styles.infoValue}>관리자</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>📧 이메일</span>
        <span style={styles.infoValue}>admin@company.com</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>🕐 로그인 시간</span>
        <span style={styles.infoValue}>{loginTime}</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>🏢 소속</span>
        <span style={styles.infoValue}>IT개발팀</span>
      </div>
      <div style={styles.infoItem}>
        <span style={styles.infoLabel}>📱 버전</span>
        <span style={styles.infoValue}>ERP v1.0.0</span>
      </div>
    </div>
  )
}

const getStyles = (colors) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: colors.card,
    borderRadius: '16px',
    width: '450px',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 1001,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: `1px solid ${colors.border}`,
  },
  title: {
    color: colors.text,
    fontSize: '1.2rem',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '5px',
  },
  tabs: {
    display: 'flex',
    borderBottom: `1px solid ${colors.border}`,
  },
  tab: {
    flex: 1,
    padding: '15px',
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: colors.primary,
    borderBottom: `2px solid ${colors.primary}`,
    marginBottom: '-1px',
  },
  content: {
    padding: '25px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  settingLabel: {
    color: colors.text,
    fontSize: '1rem',
  },
  settingDesc: {
    color: colors.textSecondary,
    fontSize: '0.85rem',
  },
  toggleBtn: {
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s',
  },
  toggleCircle: {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.3s',
  },
  themePreview: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  themeCard: {
    flex: 1,
    padding: '10px',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  themeCardLight: {
    backgroundColor: '#f5f7fa',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  themeCardDark: {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  themeCardHeader: {
    height: '20px',
    backgroundColor: '#e2e8f0',
  },
  themeCardContent: {
    padding: '10px',
    backgroundColor: '#ffffff',
  },
  themeCardLine: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  themeLabel: {
    color: colors.textSecondary,
    fontSize: '0.85rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: colors.textSecondary,
    fontSize: '0.9rem',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: `1px solid ${colors.inputBorder}`,
    backgroundColor: colors.input,
    color: colors.text,
    fontSize: '1rem',
    outline: 'none',
  },
  submitBtn: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: colors.primaryGradient,
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: `1px solid ${colors.border}`,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: '0.9rem',
  },
  infoValue: {
    color: colors.text,
    fontSize: '0.9rem',
    fontWeight: '500',
  },
})

export default SettingsPopup
