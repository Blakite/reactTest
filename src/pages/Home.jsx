import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { 
  Card, Row, Col, Typography, Space,
  BankOutlined, ToolOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'

const { Title, Text } = Typography

function Home() {
  const navigate = useNavigate()
  const { colors } = useTheme()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [navigate])

  const modules = [
    {
      key: 'accounting',
      title: '회계관리',
      desc: '분개, 계정과목, 전표관리',
      icon: <BankOutlined style={{ fontSize: 48, color: colors.primary }} />,
      path: '/accounting',
    },
    {
      key: 'construction',
      title: '공사관리',
      desc: '공사, 계약, 기성관리',
      icon: <ToolOutlined style={{ fontSize: 48, color: colors.primary }} />,
      path: '/construction',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: 24,
    }}>
      <Space direction="vertical" align="center" size="large" style={{ marginBottom: 48 }}>
        <BankOutlined style={{ fontSize: 64, color: colors.primary }} />
        <Title level={1} style={{ margin: 0 }}>ERP System</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>모듈을 선택하세요</Text>
      </Space>

      <Row gutter={24}>
        {modules.map((module) => (
          <Col key={module.key}>
            <Card
              hoverable
              onClick={() => navigate(module.path)}
              style={{ 
                width: 280, 
                textAlign: 'center',
                borderRadius: 16,
              }}
            >
              <Space direction="vertical" size="middle">
                {module.icon}
                <Title level={3} style={{ margin: 0 }}>{module.title}</Title>
                <Text type="secondary">{module.desc}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
