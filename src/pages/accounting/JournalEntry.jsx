import { Card, Typography, Empty, FileTextOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function JournalEntry() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <FileTextOutlined /> 분개장
      </Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">분개 입력 및 조회 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default JournalEntry
