import { useTheme } from '../../contexts/ThemeContext'

function ProgressReport() {
  const { colors } = useTheme()
  const styles = getStyles(colors)

  return (
    <div>
      <h2 style={styles.title}>기성관리</h2>
      <p style={styles.desc}>공사 기성 청구 및 관리 화면입니다.</p>
      <div style={styles.placeholder}>
        📈 기성관리 기능 구현 예정
      </div>
    </div>
  )
}

const getStyles = (colors) => ({
  title: { color: colors.text, fontSize: '1.5rem', marginBottom: '10px' },
  desc: { color: colors.textSecondary, marginBottom: '30px' },
  placeholder: {
    backgroundColor: colors.card,
    padding: '60px',
    borderRadius: '12px',
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: '1.2rem',
    border: `1px solid ${colors.border}`,
  },
})

export default ProgressReport
