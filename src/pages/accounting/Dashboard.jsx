import { useTheme } from '../../contexts/ThemeContext'

function Dashboard() {
  const { colors } = useTheme()
  const styles = getStyles(colors)

  return (
    <div>
      <h2 style={styles.title}>회계 대시보드</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📊</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>₩ 125,000,000</span>
            <span style={styles.statLabel}>이번달 매출</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📉</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>₩ 45,000,000</span>
            <span style={styles.statLabel}>이번달 지출</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🧾</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>128건</span>
            <span style={styles.statLabel}>미결 전표</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>✅</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>1,542건</span>
            <span style={styles.statLabel}>승인 완료</span>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>최근 전표</h3>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>날짜</span>
            <span>적요</span>
            <span>금액</span>
            <span>상태</span>
          </div>
          {[
            { date: '2026-01-17', desc: '사무용품 구입', amount: '150,000', status: '승인' },
            { date: '2026-01-16', desc: '외주비 지급', amount: '3,500,000', status: '대기' },
            { date: '2026-01-15', desc: '매출 입금', amount: '12,000,000', status: '승인' },
          ].map((item, i) => (
            <div key={i} style={styles.tableRow}>
              <span>{item.date}</span>
              <span>{item.desc}</span>
              <span>₩ {item.amount}</span>
              <span style={{
                color: item.status === '승인' ? colors.success : colors.warning
              }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const getStyles = (colors) => ({
  title: {
    color: colors.text,
    fontSize: '1.5rem',
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: colors.card,
    padding: '25px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: `1px solid ${colors.border}`,
  },
  statIcon: {
    fontSize: '2rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    color: colors.text,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: '0.85rem',
  },
  section: {
    backgroundColor: colors.card,
    padding: '25px',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: '1.1rem',
    marginBottom: '20px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    padding: '10px 15px',
    color: colors.textSecondary,
    fontSize: '0.85rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    padding: '12px 15px',
    color: colors.text,
    fontSize: '0.9rem',
    backgroundColor: colors.background,
    borderRadius: '8px',
  },
})

export default Dashboard
