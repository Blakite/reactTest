import { useTheme } from '../../contexts/ThemeContext'

function Dashboard() {
  const { colors } = useTheme()
  const styles = getStyles(colors)

  return (
    <div>
      <h2 style={styles.title}>공사 대시보드</h2>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🏗️</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>12건</span>
            <span style={styles.statLabel}>진행중 공사</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📄</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>5건</span>
            <span style={styles.statLabel}>신규 계약</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📈</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>₩ 2.5억</span>
            <span style={styles.statLabel}>이번달 기성</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <span style={styles.statIcon}>✅</span>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>3건</span>
            <span style={styles.statLabel}>완료 공사</span>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>진행중인 공사</h3>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>공사명</span>
            <span>계약금액</span>
            <span>진행률</span>
            <span>상태</span>
          </div>
          {[
            { name: '강남 오피스텔 신축', amount: '45억', progress: '65%', status: '정상' },
            { name: '판교 물류센터', amount: '120억', progress: '30%', status: '정상' },
            { name: '수원 아파트 리모델링', amount: '8억', progress: '90%', status: '지연' },
          ].map((item, i) => (
            <div key={i} style={styles.tableRow}>
              <span>{item.name}</span>
              <span>{item.amount}</span>
              <span>{item.progress}</span>
              <span style={{
                color: item.status === '정상' ? colors.success : colors.danger
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
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '10px 15px',
    color: colors.textSecondary,
    fontSize: '0.85rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '12px 15px',
    color: colors.text,
    fontSize: '0.9rem',
    backgroundColor: colors.background,
    borderRadius: '8px',
  },
})

export default Dashboard
