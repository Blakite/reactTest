import { 
  Modal, Tabs, Form, Input, Button, Switch, Card, Descriptions, Space, Typography, message, Row, Col,
  SettingOutlined, LockOutlined, InfoCircleOutlined, UserOutlined, 
  MailOutlined, ClockCircleOutlined, BankOutlined, MobileOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'

const { Text, Title } = Typography

function SettingsPopup({ isOpen, onClose }) {
  const { colors, toggleTheme, isDark } = useTheme()
  
  const loginTime = localStorage.getItem('loginTime') || new Date().toLocaleString('ko-KR')

  const tabItems = [
    {
      key: 'settings',
      label: (
        <span><SettingOutlined /> 설정</span>
      ),
      children: <SettingsTab isDark={isDark} toggleTheme={toggleTheme} colors={colors} />,
    },
    {
      key: 'password',
      label: (
        <span><LockOutlined /> 비밀번호 변경</span>
      ),
      children: <PasswordTab />,
    },
    {
      key: 'info',
      label: (
        <span><InfoCircleOutlined /> 정보</span>
      ),
      children: <InfoTab loginTime={loginTime} />,
    },
  ]

  return (
    <Modal
      title={<><SettingOutlined /> 설정</>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <Tabs items={tabItems} />
    </Modal>
  )
}

function SettingsTab({ isDark, toggleTheme, colors }) {
  return (
    <div>
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>테마 모드</Text>
            <br />
            <Text type="secondary">
              {isDark ? '🌙 다크 모드' : '☀️ 라이트 모드'}
            </Text>
          </div>
          <Switch 
            checked={isDark} 
            onChange={toggleTheme}
            checkedChildren="다크"
            unCheckedChildren="라이트"
          />
        </div>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => isDark && toggleTheme()}
            style={{ 
              textAlign: 'center',
              border: !isDark ? `2px solid ${colors.primary}` : undefined,
            }}
          >
            <div style={{
              backgroundColor: '#f5f7fa',
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
            }}>
              <div style={{ height: 20, backgroundColor: '#e2e8f0', marginBottom: 8, borderRadius: 4 }} />
              <div style={{ height: 12, backgroundColor: '#e2e8f0', width: '80%', borderRadius: 4 }} />
            </div>
            <Text>☀️ 라이트</Text>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => !isDark && toggleTheme()}
            style={{ 
              textAlign: 'center',
              border: isDark ? `2px solid ${colors.primary}` : undefined,
            }}
          >
            <div style={{
              backgroundColor: '#1f1f1f',
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
            }}>
              <div style={{ height: 20, backgroundColor: '#303030', marginBottom: 8, borderRadius: 4 }} />
              <div style={{ height: 12, backgroundColor: '#303030', width: '80%', borderRadius: 4 }} />
            </div>
            <Text>🌙 다크</Text>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

function PasswordTab() {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('새 비밀번호가 일치하지 않습니다.')
      return
    }
    message.success('비밀번호가 변경되었습니다. (데모)')
    form.resetFields()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="currentPassword"
        label="현재 비밀번호"
        rules={[{ required: true, message: '현재 비밀번호를 입력해주세요' }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="새 비밀번호"
        rules={[
          { required: true, message: '새 비밀번호를 입력해주세요' },
          { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="새 비밀번호 확인"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '새 비밀번호를 다시 입력해주세요' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          비밀번호 변경
        </Button>
      </Form.Item>
    </Form>
  )
}

function InfoTab({ loginTime }) {
  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label={<><UserOutlined /> 사용자</>}>
        관리자
      </Descriptions.Item>
      <Descriptions.Item label={<><MailOutlined /> 이메일</>}>
        admin@company.com
      </Descriptions.Item>
      <Descriptions.Item label={<><ClockCircleOutlined /> 로그인 시간</>}>
        {loginTime}
      </Descriptions.Item>
      <Descriptions.Item label={<><BankOutlined /> 소속</>}>
        IT개발팀
      </Descriptions.Item>
      <Descriptions.Item label={<><MobileOutlined /> 버전</>}>
        ERP v1.0.0
      </Descriptions.Item>
    </Descriptions>
  )
}

export default SettingsPopup
