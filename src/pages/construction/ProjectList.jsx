import { Card, Typography, Empty, ProjectOutlined } from '@/lib/antd'

const { Title, Text } = Typography

function ProjectList() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <ProjectOutlined /> 공사목록
      </Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">등록된 공사 목록 기능 구현 예정</Text>
          }
        />
      </Card>
    </div>
  )
}

export default ProjectList
