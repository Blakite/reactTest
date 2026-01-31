import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Form, Input, Button, Card, Typography, Row, Col, message, Select,
  UserOutlined, LockOutlined, BankOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useMenu } from '@/contexts/MenuContext'
import { fetchUsers } from '@/services/api'

const { Title, Text, Paragraph } = Typography

function Login() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { loadUserMenus } = useMenu()
  const [form] = Form.useForm()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // 사용자 목록 로드
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data.users)
    }).catch(err => {
      console.error('Failed to load users:', err)
    })
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      console.log('Login:', values)
      
      // 사용자 정보 저장
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('loginTime', new Date().toLocaleString('ko-KR'))
      localStorage.setItem('userId', values.userId)
      
      // 메뉴 로드
      await loadUserMenus(values.userId)
      
      message.success('로그인 성공!')
      
      // 첫 번째 접근 가능한 모듈로 이동
      navigate('/accounting')
    } catch (err) {
      message.error('로그인 실패: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 사용자 선택 옵션
  const userOptions = users.map(user => ({
    value: user.id,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{user.name}</span>
        <Text type="secondary" style={{ fontSize: 12 }}>{user.role}</Text>
      </div>
    ),
    desc: `${user.email} (${user.role})`,
  }))

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: '20px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          {/* 왼쪽: 이미지 섹션 */}
          <Col xs={0} md={12}>
            <div style={{
              position: 'relative',
              height: '100%',
              minHeight: 500,
            }}>
              <img 
                src="https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80" 
                alt="Winter Mountain"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 40,
              }}>
                <Title level={2} style={{ color: '#fff', marginBottom: 10 }}>
                  Welcome Back
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: 0 }}>
                  <BankOutlined /> ERP System<br/>업무의 시작
                </Paragraph>
              </div>
            </div>
          </Col>

          {/* 오른쪽: 로그인 폼 */}
          <Col xs={24} md={12}>
            <div style={{ padding: '60px 40px' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <BankOutlined style={{ fontSize: 48, color: colors.primary, marginBottom: 16 }} />
                <Title level={2} style={{ marginBottom: 8 }}>로그인</Title>
                <Text type="secondary">ERP 시스템에 로그인하세요</Text>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
                requiredMark={false}
                initialValues={{ userId: 'admin' }}
              >
                <Form.Item
                  name="userId"
                  label="사용자 선택"
                  rules={[{ required: true, message: '사용자를 선택해주세요' }]}
                >
                  <Select
                    placeholder="사용자를 선택하세요"
                    options={userOptions}
                    optionLabelProp="label"
                    optionRender={(option) => (
                      <div>
                        <Text strong>{option.data.label}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{option.data.desc}</Text>
                      </div>
                    )}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="비밀번호"
                  rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
                  initialValue="password"
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="비밀번호 입력"
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: 32 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                    loading={loading}
                    style={{ 
                      height: 48,
                      background: colors.primaryGradient,
                      border: 'none',
                    }}
                  >
                    로그인
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ 
                marginTop: 24, 
                padding: 16, 
                background: colors.card, 
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
              }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  <strong>테스트 계정</strong>
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  • <strong>admin</strong>: 전체 메뉴 접근<br />
                  • <strong>user1</strong>: 회계 메뉴만 접근<br />
                  • <strong>user2</strong>: 공사 메뉴만 접근<br />
                  • <strong>viewer</strong>: 대시보드만 접근
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Login
