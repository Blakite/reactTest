import { useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Avatar, Dropdown, Typography, Space, Segmented, Tabs, Spin,
  DashboardOutlined, FileTextOutlined, ProfileOutlined, AuditOutlined,
  ProjectOutlined, ContainerOutlined, BarChartOutlined, SettingOutlined,
  LogoutOutlined, UserOutlined, BankOutlined, ToolOutlined, CheckCircleOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useTab } from '@/contexts/TabContext'
import SettingsPopup from '@/components/SettingsPopup'
import { componentRegistry } from '@/routes'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

// 메뉴 아이콘 매핑
const menuIcons = {
  '/accounting': <DashboardOutlined />,
  '/accounting/journal': <FileTextOutlined />,
  '/accounting/accounts': <ProfileOutlined />,
  '/accounting/vouchers': <AuditOutlined />,
  '/accounting/closing': <CheckCircleOutlined />,
  '/construction': <DashboardOutlined />,
  '/construction/projects': <ProjectOutlined />,
  '/construction/contracts': <ContainerOutlined />,
  '/construction/progress': <BarChartOutlined />,
}

const menuConfig = {
  accounting: {
    title: '회계관리',
    icon: <BankOutlined />,
    items: [
      { key: '/accounting', label: '대시보드', icon: <DashboardOutlined /> },
      { key: '/accounting/journal', label: '분개장', icon: <FileTextOutlined /> },
      { key: '/accounting/accounts', label: '계정과목', icon: <ProfileOutlined /> },
      { key: '/accounting/vouchers', label: '전표관리', icon: <AuditOutlined /> },
      { key: '/accounting/closing', label: '마감현황', icon: <CheckCircleOutlined /> },
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

// 탭 컨텐츠 래퍼 (탭별로 컴포넌트 유지)
function TabContent({ tabKey, component: Component }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Spin size="large" />
      </div>
    }>
      <Component tabKey={tabKey} />
    </Suspense>
  )
}

function MainLayout({ module }) {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { tabs, activeKey, addTab, removeTab, setActiveTab } = useTab()
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  
  const currentMenu = menuConfig[module]

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
    navigate('/login')
  }

  // 메뉴 클릭 시 탭 추가
  const handleMenuClick = ({ key }) => {
    const menuItem = currentMenu.items.find(item => item.key === key)
    if (menuItem && componentRegistry[key]) {
      addTab({
        key: key,
        label: menuItem.label,
        path: key,
        module: module,
        component: componentRegistry[key],
      })
    }
  }

  // 모듈 변경
  const handleModuleChange = (value) => {
    navigate(`/${value}`)
  }

  // 탭 편집 (닫기)
  const handleTabEdit = (targetKey, action) => {
    if (action === 'remove') {
      removeTab(targetKey)
    }
  }

  // 탭 변경
  const handleTabChange = (key) => {
    setActiveTab(key)
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

  // 탭 아이템 생성
  const tabItems = tabs
    .filter(tab => tab.module === module)
    .map(tab => ({
      key: tab.key,
      label: (
        <span>
          {menuIcons[tab.key]} {tab.label}
        </span>
      ),
      children: (
        <TabContent 
          tabKey={tab.key} 
          component={tab.component} 
        />
      ),
      closable: true,
    }))

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
          selectedKeys={activeKey ? [activeKey] : []}
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

        {/* 탭 콘텐츠 영역 */}
        <Content style={{ 
          margin: '0', 
          padding: '0',
          background: colors.card,
          minHeight: 280,
          overflow: 'auto',
        }}>
          {tabItems.length > 0 ? (
            <Tabs
              type="editable-card"
              hideAdd
              destroyInactiveTabPane={false}
              activeKey={activeKey}
              onChange={handleTabChange}
              onEdit={handleTabEdit}
              items={tabItems}
              style={{ 
                height: '100%',
                padding: '8px 16px 0 16px',
              }}
              tabBarStyle={{
                marginBottom: 0,
              }}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              minHeight: 400,
              color: colors.textSecondary,
              flexDirection: 'column',
              gap: 16,
            }}>
              <DashboardOutlined style={{ fontSize: 48, opacity: 0.5 }} />
              <Text type="secondary">왼쪽 메뉴에서 화면을 선택하세요</Text>
            </div>
          )}
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
