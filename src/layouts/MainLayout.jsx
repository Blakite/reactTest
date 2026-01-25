import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Button, Avatar, Dropdown, Typography, Space, Segmented,
  DashboardOutlined, FileTextOutlined, ProfileOutlined, AuditOutlined,
  ProjectOutlined, ContainerOutlined, BarChartOutlined, SettingOutlined,
  LogoutOutlined, UserOutlined, BankOutlined, ToolOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import SettingsPopup from '@/components/SettingsPopup'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const menuConfig = {
  accounting: {
    title: '회계관리',
    icon: <BankOutlined />,
    items: [
      { key: '/accounting', label: '대시보드', icon: <DashboardOutlined /> },
      { key: '/accounting/journal', label: '분개장', icon: <FileTextOutlined /> },
      { key: '/accounting/accounts', label: '계정과목', icon: <ProfileOutlined /> },
      { key: '/accounting/vouchers', label: '전표관리', icon: <AuditOutlined /> },
    ],
  },
  construction: {
    title: '공사관리',
    icon: <ToolOutlined />,
    items: [
      { key: '/construction', label: '대시보드', icon: <DashboardOutlined /> },
      { key: '/construction/projects', label: '공사목록', icon: <ProjectOutlined /> },
      { key: '/construction/contracts', label: '계약관리', icon: <ContainerOutlined /> },
      { key: '/construction/progress', label: '기성관리', icon: <BarChartOutlined /> },
    ],
  },
}

function MainLayout({ module }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { colors, isDark } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  
  const currentMenu = menuConfig[module]

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
    navigate('/login')
  }

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleModuleChange = (value) => {
    navigate(`/${value}`)
  }

  const userMenuItems = [
    {
      key: 'settings',
      label: '설정',
      icon: <SettingOutlined />,
      onClick: () => setShowSettings(true),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '로그아웃',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={250}
        style={{
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        {/* 로고 */}
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <Space>
            <BankOutlined style={{ fontSize: 24, color: colors.primary }} />
            {!collapsed && (
              <Title level={4} style={{ margin: 0, color: colors.text }}>
                ERP System
              </Title>
            )}
          </Space>
        </div>

        {/* 모듈 선택 */}
        {!collapsed && (
          <div style={{ padding: '16px' }}>
            <Segmented
              block
              value={module}
              onChange={handleModuleChange}
              options={[
                { label: '회계', value: 'accounting', icon: <BankOutlined /> },
                { label: '공사', value: 'construction', icon: <ToolOutlined /> },
              ]}
            />
          </div>
        )}

        {/* 메뉴 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={currentMenu.items}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        {/* 헤더 */}
        <Header style={{ 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <Title level={4} style={{ margin: 0, color: colors.text }}>
            {currentMenu.icon} {currentMenu.title}
          </Title>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: colors.primary }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <Text strong style={{ display: 'block', color: colors.text }}>관리자</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Administrator</Text>
              </div>
              <SettingOutlined style={{ color: colors.textSecondary }} />
            </Space>
          </Dropdown>
        </Header>

        {/* 콘텐츠 영역 */}
        <Content style={{ 
          margin: '24px', 
          padding: '24px',
          background: colors.card,
          borderRadius: 8,
          minHeight: 280,
          overflow: 'auto',
        }}>
          <Outlet />
        </Content>
      </Layout>

      {/* 설정 팝업 */}
      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </Layout>
  )
}

export default MainLayout
