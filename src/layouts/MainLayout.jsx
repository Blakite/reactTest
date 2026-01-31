import { useState, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Avatar, Dropdown, Typography, Space, Tabs, Spin,
  SettingOutlined, LogoutOutlined, UserOutlined, BankOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useTab } from '@/contexts/TabContext'
import { useMenu } from '@/contexts/MenuContext'
import SettingsPopup from '@/components/SettingsPopup'

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
  const { user, getMenusByModule, getModulesWithIcons, isLoading: menuLoading, clearMenus } = useMenu()
  const [showSettings, setShowSettings] = useState(false)
  
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

  // 모듈 탭 변경
  const handleModuleTabChange = (moduleId) => {
    navigate(`/${moduleId}`)
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
    { type: 'divider' },
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

  // 모듈 탭 아이템 생성
  const moduleTabItems = modulesWithIcons.map(mod => ({
    key: mod.id,
    label: (
      <span style={{ padding: '0 4px' }}>
        {mod.icon} <span style={{ marginLeft: 4 }}>{mod.name.replace('관리', '')}</span>
      </span>
    ),
  }))

  // 페이지 탭 아이템 생성
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
      {/* ========== 상단 헤더 (한 줄: 로고 + 모듈탭) ========== */}
      <Header style={{ 
        height: 48,
        padding: 0, 
        background: colors.primary,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 'normal',
      }}>
        {/* 로고 영역 */}
        <div style={{
          width: 220,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}>
          <Space size="small">
            <BankOutlined style={{ fontSize: 20, color: '#fff' }} />
            <Title level={5} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>
              ERP System
            </Title>
          </Space>
        </div>

        {/* 모듈 탭바 */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <Tabs
            activeKey={module}
            onChange={handleModuleTabChange}
            items={moduleTabItems}
            tabBarStyle={{
              margin: 0,
              height: 48,
            }}
            tabBarGutter={0}
            className="module-tabs-inline"
          />
        </div>
      </Header>

      <Layout>
        {/* ========== 좌측 메뉴 사이드바 ========== */}
        <Sider 
          width={220}
          style={{
            background: colors.card,
            borderRight: `1px solid ${colors.border}`,
            height: 'calc(100vh - 48px)',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
          }}>
            {/* 메뉴 영역 (스크롤 가능) */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {/* 현재 모듈 타이틀 */}
              <div style={{ 
                padding: '16px',
                borderBottom: `1px solid ${colors.border}`,
              }}>
                <Space>
                  <span style={{ fontSize: 18, color: colors.primary }}>
                    {currentModule?.icon}
                  </span>
                  <Text strong style={{ fontSize: 15, color: colors.text }}>
                    {currentModule?.name || '모듈'}
                  </Text>
                </Space>
              </div>

              {/* 메뉴 목록 */}
              <Menu
                mode="inline"
                selectedKeys={activeKey ? [activeKey] : []}
                onClick={handleMenuClick}
                items={menuItemsForAntd}
                style={{ 
                  borderRight: 0,
                  background: 'transparent',
                }}
              />
            </div>

            {/* 사용자 정보 & 설정 (하단 고정) */}
            <div style={{
              borderTop: `1px solid ${colors.border}`,
              padding: '12px 16px',
              background: colors.card,
              flexShrink: 0,
            }}>
              <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: 6,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.border}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: colors.primary, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', color: colors.text }}>
                      {user?.name || '사용자'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {user?.role || 'User'}
                    </Text>
                  </div>
                  <SettingOutlined style={{ color: colors.textSecondary }} />
                </div>
              </Dropdown>
            </div>
          </div>
        </Sider>

        {/* ========== 메인 콘텐츠 영역 (MDI) ========== */}
        <Content style={{ 
          margin: 0, 
          padding: 0,
          background: colors.background,
          minHeight: 280,
          overflow: 'auto',
        }}>
          <div
            className="mdi-area"
            style={{
              margin: 16,
              minHeight: 'calc(100vh - 48px - 32px)',
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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
                  flex: 1,
                  height: '100%',
                  padding: '8px 16px 0 16px',
                }}
                tabBarStyle={{
                  marginBottom: 0,
                }}
              />
            ) : (
              <div style={{ 
                flex: 1,
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: 400,
                color: colors.textSecondary,
                flexDirection: 'column',
                gap: 16,
              }}>
                <span style={{ fontSize: 48, opacity: 0.3 }}>
                  {currentModule?.icon || <BankOutlined />}
                </span>
                <Text type="secondary">왼쪽 메뉴에서 화면을 선택하세요</Text>
              </div>
            )}
          </div>
        </Content>
      </Layout>

      {/* 설정 팝업 */}
      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* 모듈 탭 스타일 (한 줄 버전) */}
      <style>{`
        .module-tabs-inline .ant-tabs-nav {
          margin: 0 !important;
          height: 48px !important;
        }
        .module-tabs-inline .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .module-tabs-inline .ant-tabs-tab {
          background: transparent !important;
          border: none !important;
          color: rgba(255,255,255,0.7) !important;
          padding: 0 20px !important;
          margin: 0 !important;
          height: 48px !important;
          line-height: 48px !important;
          transition: all 0.2s;
        }
        .module-tabs-inline .ant-tabs-tab:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.1) !important;
        }
        .module-tabs-inline .ant-tabs-tab-active {
          background: rgba(255,255,255,0.15) !important;
          color: #fff !important;
        }
        .module-tabs-inline .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #fff !important;
        }
        .module-tabs-inline .ant-tabs-ink-bar {
          background: #fff !important;
          height: 3px !important;
        }
        .module-tabs-inline .ant-tabs-tab-btn {
          color: inherit !important;
        }
        .module-tabs-inline .ant-tabs-nav-operations {
          color: rgba(255,255,255,0.7) !important;
        }
        .module-tabs-inline .ant-tabs-nav-more {
          color: rgba(255,255,255,0.7) !important;
          height: 48px !important;
        }
        .module-tabs-inline .ant-tabs-nav-list {
          height: 48px !important;
        }
      `}</style>
    </Layout>
  )
}

export default MainLayout
