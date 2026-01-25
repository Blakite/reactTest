import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Home() {
  const navigate = useNavigate()
  const { colors } = useTheme()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [navigate])

  const styles = getStyles(colors)

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏢 ERP System</h1>
      <p style={styles.subtitle}>모듈을 선택하세요</p>
      
      <div style={styles.cards}>
        <div 
          style={styles.card} 
          onClick={() => navigate('/accounting')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={styles.cardIcon}>💰</span>
          <h2 style={styles.cardTitle}>회계관리</h2>
          <p style={styles.cardDesc}>분개, 계정과목, 전표관리</p>
        </div>
        
        <div 
          style={styles.card} 
          onClick={() => navigate('/construction')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={styles.cardIcon}>🏗️</span>
          <h2 style={styles.cardTitle}>공사관리</h2>
          <p style={styles.cardDesc}>공사, 계약, 기성관리</p>
        </div>
      </div>
    </div>
  )
}

const getStyles = (colors) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: '20px',
  },
  title: {
    color: colors.text,
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: '1.1rem',
    marginBottom: '40px',
  },
  cards: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    padding: '40px',
    borderRadius: '16px',
    width: '250px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: `1px solid ${colors.border}`,
  },
  cardIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '15px',
  },
  cardTitle: {
    color: colors.text,
    fontSize: '1.3rem',
    marginBottom: '10px',
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: '0.9rem',
  },
})

export default Home
