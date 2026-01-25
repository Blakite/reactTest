import { 
  Card, Row, Col, Statistic, Table, Tag, Typography,
  RiseOutlined, FallOutlined, FileTextOutlined, CheckCircleOutlined, DashboardOutlined,
} from '@/lib/antd'

const { Title } = Typography

function Dashboard() {
  const recentVouchers = [
    { key: '1', date: '2026-01-17', desc: '사무용품 구입', amount: 150000, status: '승인' },
    { key: '2', date: '2026-01-16', desc: '외주비 지급', amount: 3500000, status: '대기' },
    { key: '3', date: '2026-01-15', desc: '매출 입금', amount: 12000000, status: '승인' },
  ]

  const columns = [
    { title: '날짜', dataIndex: 'date', key: 'date' },
    { title: '적요', dataIndex: 'desc', key: 'desc' },
    { 
      title: '금액', 
      dataIndex: 'amount', 
      key: 'amount',
      align: 'right',
      render: (val) => `₩ ${val.toLocaleString()}`,
    },
    { 
      title: '상태', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === '승인' ? 'success' : 'warning'}>{status}</Tag>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <DashboardOutlined /> 회계 대시보드
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="이번달 매출"
              value={125000000}
              prefix={<RiseOutlined />}
              suffix="원"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `₩ ${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="이번달 지출"
              value={45000000}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              formatter={(value) => `₩ ${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="미결 전표"
              value={128}
              prefix={<FileTextOutlined />}
              suffix="건"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="승인 완료"
              value={1542}
              prefix={<CheckCircleOutlined />}
              suffix="건"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="최근 전표">
        <Table 
          columns={columns} 
          dataSource={recentVouchers}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default Dashboard
