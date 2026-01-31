import { useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Avatar, Dropdown, Typography, Space, Segmented, Tabs, Spin,
  SettingOutlined, LogoutOutlined, UserOutlined, BankOutlined, ToolOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useTab } from '@/contexts/TabContext'
import { useMenu } from '@/contexts/MenuContext'
import SettingsPopup from '@/components/SettingsPopup'
import { getIcon } from '@/utils/iconMapping'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

// Vite의 import.meta.glob으로 페이지 컴포넌트 미리 로드
const pageModules = import.meta.glob('../pages/**/*.jsx')

// 동적 컴포넌트 캐시
const componentCache = {}

// 동적 컴포넌트 로더
function loadComponent(componentPath) {
  if (!componentCache[componentPath]) {
    const modulePath = `../pages/${componentPath}.jsx`
    const importFn = pageModules[modulePath]
    
    if (!importFn) {
      console.error(`[MainLayout] Component not found: ${modulePath}`)
      // 폴백: 빈 컴포넌트 반환
      componentCache[componentPath] = lazy(() => 
        Promise.resolve({ default: () => <div>페이지를 찾을 수 없습니다: {componentPath}</div> })
      )
    } else {
      componentCache[componentPath] = lazy(importFn)
    }
  }
  return componentCache[componentPath]
}

// 탭 컨텐츠 래퍼
function TabContent({ tabKey, componentPath }) {
  const Component = loadComponent(componentPath)
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
  const { user, modules, getMenusByModule, getModulesWithIcons, isLoading: menuLoading, clearMenus } = useMenu()
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  
  // 현재 모듈의 메뉴 가져오기
  const currentMenuItems = getMenusByModule(module)
  const modulesWithIcons = getModulesWithIcons()
  
  // 현재 모듈 정보
  const currentModule = modulesWithIcons.find(m => m.id === module)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('userId')
    clearMenus()
    navigate('/login')
  }

  // 메뉴 클릭 시 탭 추가
  const handleMenuClick = ({ key }) => {
    const menuItem = currentMenuItems.find(item => item.key === key)
    if (menuItem) {
      addTab({
        key: key,
        label: menuItem.label,
        path: key,
        module: module,
        componentPath: menuItem.componentPath,
        icon: menuItem.icon,
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

  // Ant Design Menu용 아이템 변환
  const menuItemsForAntd = currentMenuItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }))

  // 모듈 선택 옵션
  const moduleOptions = modulesWithIcons.map(mod => ({
    label: mod.name.replace('관리', ''),  // '회계관리' -> '회계'
    value: mod.id,
    icon: mod.icon,
  }))

  // 탭 아이템 생성
  const tabItems = tabs
    .filter(tab => tab.module === module)
    .map(tab => ({
      key: tab.key,
      label: (
        <span>
          {tab.icon} {tab.label}
        </span>
      ),
      children: (
        <TabContent 
          tabKey={tab.key} 
          componentPath={tab.componentPath} 
        />
      ),
      closable: true,
    }))

  // 메뉴 로딩 중
  if (menuLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="메뉴 로딩 중..." />
      </div>
    )
  }

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
        {!collapsed && moduleOptions.length > 1 && (
          <div style={{ padding: '16px' }}>
            <Segmented
              block
              value={module}
              onChange={handleModuleChange}
              options={moduleOptions}
            />
          </div>
        )}

        {/* 메뉴 */}
        <Menu
          mode="inline"
          selectedKeys={activeKey ? [activeKey] : []}
          onClick={handleMenuClick}
          items={menuItemsForAntd}
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
            {currentModule?.icon} {currentModule?.name || module}
          </Title>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: colors.primary }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <Text strong style={{ display: 'block', color: colors.text }}>
                  {user?.name || '사용자'}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {user?.role || 'User'}
                </Text>
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
              {currentModule?.icon || <BankOutlined style={{ fontSize: 48, opacity: 0.5 }} />}
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
