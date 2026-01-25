import { 
  Card, Row, Col, Statistic, Table, Tag, Progress, Typography,
  ToolOutlined, FileTextOutlined, RiseOutlined, CheckCircleOutlined, DashboardOutlined,
} from '@/lib/antd'

const { Title } = Typography

function Dashboard() {
  const projects = [
    { key: '1', name: '강남 오피스텔 신축', amount: '45억', progress: 65, status: '정상' },
    { key: '2', name: '판교 물류센터', amount: '120억', progress: 30, status: '정상' },
    { key: '3', name: '수원 아파트 리모델링', amount: '8억', progress: 90, status: '지연' },
  ]

  const columns = [
    { title: '공사명', dataIndex: 'name', key: 'name' },
    { title: '계약금액', dataIndex: 'amount', key: 'amount', align: 'right' },
    { 
      title: '진행률', 
      dataIndex: 'progress', 
      key: 'progress',
      render: (val) => <Progress percent={val} size="small" />,
    },
    { 
      title: '상태', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === '정상' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <DashboardOutlined /> 공사 대시보드
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="진행중 공사"
              value={12}
              prefix={<ToolOutlined />}
              suffix="건"
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="신규 계약"
              value={5}
              prefix={<FileTextOutlined />}
              suffix="건"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="이번달 기성"
              value={2.5}
              prefix={<RiseOutlined />}
              suffix="억원"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="완료 공사"
              value={3}
              prefix={<CheckCircleOutlined />}
              suffix="건"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="진행중인 공사">
        <Table 
          columns={columns} 
          dataSource={projects}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default Dashboard
