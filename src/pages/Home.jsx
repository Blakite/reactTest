import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { 
  Card, Row, Col, Typography, Space, Spin,
  BankOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useMenu } from '@/contexts/MenuContext'

const { Title, Text } = Typography

function Home() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { isLoading, getModulesWithIcons, user } = useMenu()
  const [checked, setChecked] = useState(false)

  // 사용자가 접근 가능한 모듈 (아이콘 포함)
  const modulesWithIcons = getModulesWithIcons()

  // 로그인 체크
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    console.log('[Home] isLoggedIn:', isLoggedIn)
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      setChecked(true)
    }
  }, [navigate])

  // 접근 가능한 모듈이 1개면 바로 이동
  useEffect(() => {
    if (checked && !isLoading && modulesWithIcons.length === 1) {
      navigate(`/${modulesWithIcons[0].id}`)
    }
  }, [checked, isLoading, modulesWithIcons, navigate])

  console.log('[Home] render:', { isLoading, checked, modulesLength: modulesWithIcons.length })

  // 로그인 체크 전
  if (!checked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: colors?.background || '#141414',
      }}>
        <Spin size="large" />
      </div>
    )
  }

  // 메뉴 로딩 중
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: colors?.background || '#141414',
      }}>
        <Spin size="large" tip="메뉴 로딩 중..." />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors?.background || '#141414',
      padding: 24,
    }}>
      <Space direction="vertical" align="center" size="large" style={{ marginBottom: 48 }}>
        <BankOutlined style={{ fontSize: 64, color: colors?.primary || '#667eea' }} />
        <Title level={1} style={{ margin: 0, color: colors?.text }}>ERP System</Title>
        {user && (
          <Text type="secondary" style={{ fontSize: 16 }}>
            {user.name}님, 환영합니다
          </Text>
        )}
        <Text type="secondary">모듈을 선택하세요</Text>
      </Space>

      <Row gutter={24}>
        {modulesWithIcons.map((module) => (
          <Col key={module.id}>
            <Card
              hoverable
              onClick={() => navigate(`/${module.id}`)}
              style={{ 
                width: 280, 
                textAlign: 'center',
                borderRadius: 16,
              }}
            >
              <Space direction="vertical" size="middle">
                <div style={{ fontSize: 48, color: colors?.primary || '#667eea' }}>
                  {module.icon}
                </div>
                <Title level={3} style={{ margin: 0 }}>{module.name}</Title>
                <Text type="secondary">
                  {module.id === 'accounting' && '분개, 계정과목, 전표관리'}
                  {module.id === 'construction' && '공사, 계약, 기성관리'}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {modulesWithIcons.length === 0 && (
        <Text type="secondary">접근 가능한 모듈이 없습니다.</Text>
      )}
    </div>
  )
}

export default Home
