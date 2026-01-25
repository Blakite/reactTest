import { useParams } from 'react-router-dom'
import { Card, Typography, Empty, Descriptions, ProfileOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function ProjectDetail() {
  const { id } = useParams()
  
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <ProfileOutlined /> 공사 상세
      </Title>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="공사 ID">{id}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">공사 상세 정보 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default ProjectDetail
