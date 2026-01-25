import { Card, Typography, Empty, ContainerOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function ContractList() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <ContainerOutlined /> 계약관리
      </Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">계약 목록 및 관리 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default ContractList
