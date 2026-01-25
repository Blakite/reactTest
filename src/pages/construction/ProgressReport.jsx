import { Card, Typography, Empty, BarChartOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function ProgressReport() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <BarChartOutlined /> 기성관리
      </Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">공사 기성 청구 및 관리 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default ProgressReport
