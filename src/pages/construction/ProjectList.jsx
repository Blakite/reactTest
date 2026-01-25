import { useTheme } from '../../contexts/ThemeContext'

function ProjectList() {
  const { colors } = useTheme()
  const styles = getStyles(colors)

  return (
    <div>
      <h2 style={styles.title}>공사목록</h2>
      <p style={styles.desc}>등록된 공사 목록입니다.</p>
      <div style={styles.placeholder}>
        📁 공사목록 기능 구현 예정
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

export default ProjectList
