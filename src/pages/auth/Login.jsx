import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { colors } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', { email, password })
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('loginTime', new Date().toLocaleString('ko-KR'))
    navigate('/')
  }

  const styles = getStyles(colors)

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* 왼쪽: 겨울산 이미지 */}
        <div style={styles.imageSection}>
          <img 
            src="https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80" 
            alt="Winter Mountain"
            style={styles.image}
          />
          <div style={styles.imageOverlay}>
            <h2 style={styles.imageTitle}>Welcome Back</h2>
            <p style={styles.imageText}>🏢 ERP System<br/>업무의 시작</p>
          </div>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div style={styles.formSection}>
          <h1 style={styles.title}>Login</h1>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                style={styles.input}
                required
              />
            </div>
            
            <button type="submit" style={styles.submitButton}>
              로그인
            </button>
          </form>
          
          <p style={styles.hint}>
            * 아무 이메일/비밀번호로 로그인 가능
          </p>
        </div>
      </div>
    </div>
  )
}

const getStyles = (colors) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: colors.background,
    padding: '20px',
  },
  wrapper: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    height: '550px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  imageSection: {
    flex: 1,
    position: 'relative',
    display: 'flex',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '40px',
  },
  imageTitle: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  imageText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  formSection: {
    flex: 1,
    backgroundColor: colors.card,
    padding: '50px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    padding: '14px 16px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: `1px solid ${colors.inputBorder}`,
    backgroundColor: colors.input,
    color: colors.text,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    padding: '14px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    background: colors.primaryGradient,
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  hint: {
    marginTop: '20px',
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: '0.85rem',
  },
})

export default Login
