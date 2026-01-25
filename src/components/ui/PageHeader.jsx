/**
 * PageHeader - 페이지 제목 컴포넌트
 * extra: 오른쪽에 배치할 요소 (버튼 등)
 */
import { Typography, Space } from 'antd'

const { Title } = Typography

export default function PageHeader({ icon, title, extra, level = 4, ...props }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 24 
    }} {...props}>
      <Title level={level} style={{ margin: 0 }}>
        {icon} {title}
      </Title>
      {extra && <Space>{extra}</Space>}
    </div>
  )
}
