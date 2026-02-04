/**
 * 미개발 메뉴용 공통 페이지 - 메뉴명 + "개발진행중" 표시
 */
import { useMenu } from '@/contexts/MenuContext'

function BlankPage({ tabKey }) {
  const { getMenuByKey } = useMenu()
  const menu = tabKey ? getMenuByKey(tabKey) : null
  const menuName = menu?.label ?? '해당 메뉴'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        padding: 24,
        color: 'var(--color-text-secondary, #888)',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--color-text, inherit)' }}>
        {menuName}
      </div>
      <div style={{ fontSize: 14 }}>개발진행중</div>
    </div>
  )
}

export default BlankPage
