import { Card, Typography, Empty, ProfileOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function AccountList() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <ProfileOutlined /> 계정과목
      </Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">계정과목 관리 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default AccountList
