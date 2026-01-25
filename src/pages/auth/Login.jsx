import { useNavigate } from 'react-router-dom'
import { 
  Form, Input, Button, Card, Typography, Row, Col, message,
  UserOutlined, LockOutlined, BankOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'

const { Title, Text, Paragraph } = Typography

function Login() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log('Login:', values)
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('loginTime', new Date().toLocaleString('ko-KR'))
    message.success('로그인 성공!')
    navigate('/')
  }

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
              >
                <Form.Item
                  name="email"
                  label="이메일"
                  rules={[
                    { required: true, message: '이메일을 입력해주세요' },
                    { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="example@email.com"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="비밀번호"
                  rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
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

              <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
                * 아무 이메일/비밀번호로 로그인 가능
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Login
