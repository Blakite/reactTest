import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Avatar, Dropdown, Typography, Space, Tabs, Spin, Button, Tooltip,
  SettingOutlined, LogoutOutlined, UserOutlined, BankOutlined,
  FullscreenOutlined, ReloadOutlined, StarOutlined, LockOutlined, CloseOutlined, ExportOutlined, PushpinOutlined,
} from '@/lib/antd'
import { useTheme } from '@/contexts/ThemeContext'
import { useTab } from '@/contexts/TabContext'
import { useMenu } from '@/contexts/MenuContext'
import SettingsPopup from '@/components/SettingsPopup'
import { LAYOUT_SIDEBAR, LAYOUT_TOP } from '@/contexts/ThemeContext'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const pageModules = import.meta.glob('../pages/**/*.jsx')
const componentCache = {}

function loadComponent(componentPath) {
  if (!componentCache[componentPath]) {
    const modulePath = `../pages/${componentPath}.jsx`
    const importFn = pageModules[modulePath]
    if (!importFn) {
      componentCache[componentPath] = lazy(() => 
        Promise.resolve({ default: () => <div>페이지를 찾을 수 없습니다: {componentPath}</div> })
      )
    } else {
      componentCache[componentPath] = lazy(importFn)
    }
  }
  return componentCache[componentPath]
}

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
  const { colors, layoutType } = useTheme()
  const { tabs, activeKey, addTab, removeTab, setActiveTab, removeAllTabs, removeOtherTabs, removeTabsToTheRight, removeTabsToTheLeft, togglePin, isPinned, refreshTab, refreshKeys } = useTab()
  const { user, getMenusByModule, getModulesWithIcons, isLoading: menuLoading, clearMenus } = useMenu()
  const [showSettings, setShowSettings] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const contextMenuRef = useRef(null)
  // 전역 창 레지스트리 (탭/인스턴스 구분 없이 동일 메뉴는 한 창만 유지)
  const getPopupRegistry = () => (window.__erpPopupWindows = window.__erpPopupWindows || {})

  useEffect(() => {
    if (!contextMenu) return
    const close = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [contextMenu])

  const currentMenuItems = getMenusByModule(module)
  const modulesWithIcons = getModulesWithIcons()
  const currentModule = modulesWithIcons.find(m => m.id === module)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('userId')
    clearMenus()
    navigate('/login')
  }

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

  const handleModuleChange = (moduleId) => {
    navigate(`/${moduleId}`)
  }

  const handleTabEdit = (targetKey, action) => {
    if (action === 'remove') {
      if (isPinned(targetKey)) {
        togglePin(targetKey) // 잠금 탭의 압핀 클릭 시 잠금 해제
        return
      }
      removeTab(targetKey)
    }
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    const tab = tabs.find((t) => t.key === key)
    if (tab && tab.module !== module) {
      navigate(`/${tab.module}`)
    }
  }

  const userMenuItems = [
    { key: 'settings', label: '설정', icon: <SettingOutlined />, onClick: () => setShowSettings(true) },
    { type: 'divider' },
    { key: 'logout', label: '로그아웃', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ]

  const menuItemsForAntd = currentMenuItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }))

  const moduleTabItems = modulesWithIcons.map(mod => ({
    key: mod.id,
    label: (
      <span style={{ padding: '0 4px' }}>
        {mod.icon} <span style={{ marginLeft: 4 }}>{mod.name.replace('관리', '')}</span>
      </span>
    ),
  }))

  const handleTabContextMenu = (e) => {
    const el = e.target.closest('[data-tabkey]')
    if (!el) return
    e.preventDefault()
    const tabKey = el.getAttribute('data-tabkey')
    setContextMenu({ tabKey, x: e.clientX, y: e.clientY })
  }

  const handleContextMenuAction = (action) => {
    if (!contextMenu) return
    const { tabKey } = contextMenu
    switch (action) {
      case 'close':
        removeTab(tabKey)
        break
      case 'closeAll':
        removeAllTabs()
        break
      case 'closeRight':
        removeTabsToTheRight(tabKey)
        break
      case 'closeLeft':
        removeTabsToTheLeft(tabKey)
        break
      case 'closeOthers':
        removeOtherTabs(tabKey)
        setActiveTab(tabKey)
        break
      default:
        break
    }
    setContextMenu(null)
  }

  const tabContextMenuItems = contextMenu ? [
    { key: 'close', label: '탭 닫기', onClick: () => handleContextMenuAction('close') },
    { key: 'closeAll', label: '모든 탭 닫기', onClick: () => handleContextMenuAction('closeAll') },
    { key: 'closeRight', label: '현재 탭 오른쪽 모두 닫기', onClick: () => handleContextMenuAction('closeRight') },
    { key: 'closeLeft', label: '현재 탭 왼쪽 모두 닫기', onClick: () => handleContextMenuAction('closeLeft') },
    { key: 'closeOthers', label: '현재 탭 제외하고 닫기', onClick: () => handleContextMenuAction('closeOthers') },
  ] : []

  // 현재 액티브 탭만 팝업 윈도우로 열기 (창 ID = 메뉴 URL, 이미 열린 창이면 포커스만)
  const handleOpenInNewWindow = () => {
    if (!activeKey) return
    const registry = getPopupRegistry()
    const winId = activeKey
    const existing = registry[winId]
    if (existing && typeof existing.closed !== 'undefined' && !existing.closed) {
      existing.focus()
      return
    }
    const standaloneUrl = new URL('standalone', window.location.href)
    standaloneUrl.searchParams.set('path', activeKey)
    const popupFeatures = 'noopener,noreferrer,width=1200,height=800,scrollbars=yes,resizable=yes'
    const winName = activeKey.replace(/\//g, '_') // 브라우저 창 이름에 / 사용 시 문제 방지
    const w = window.open(standaloneUrl.href, winName, popupFeatures)
    if (w) registry[winId] = w
  }

  // 툴바 버튼: lineHeight 22px, 하나의 그룹 박스로 표시 (라이트/다크 테마 대응)
  const toolbarIconSize = 11
  const toolbarBtnBase = { minWidth: 22, height: 22, lineHeight: '22px', padding: '0 4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0, color: colors.text }
  const toolbarGroupStyle = { display: 'inline-flex', alignItems: 'stretch', border: `1px solid ${colors.border}`, borderRadius: 6, overflow: 'hidden', marginLeft: 8, background: colors.card }
  const toolbarButtons = [
    { key: 'newWin', tip: '현재창을 새창으로 열기 (메뉴만 오픈)', icon: <ExportOutlined style={{ fontSize: toolbarIconSize }} />, onClick: handleOpenInNewWindow },
    { key: 'closeAll', tip: '모든 탭 닫기 (고정된 탭 제외)', icon: <CloseOutlined style={{ fontSize: toolbarIconSize }} />, onClick: removeAllTabs },
    { key: 'pin', tip: isPinned(activeKey) ? '현재창 잠금 해제' : '현재창 잠금', icon: <LockOutlined style={{ fontSize: toolbarIconSize }} />, onClick: () => activeKey && togglePin(activeKey), primary: isPinned(activeKey) },
    { key: 'refresh', tip: '현재 액티브 탭 새로고침', icon: <ReloadOutlined style={{ fontSize: toolbarIconSize }} />, onClick: () => activeKey && refreshTab(activeKey) },
    { key: 'fullscreen', tip: '전체화면으로 보기', icon: <FullscreenOutlined style={{ fontSize: toolbarIconSize }} />, onClick: () => document.documentElement.requestFullscreen?.() },
    { key: 'star', tip: '즐겨찾기등록', icon: <StarOutlined style={{ fontSize: toolbarIconSize }} />, onClick: () => {} },
  ]
  const tabToolbar = (
    <div style={toolbarGroupStyle}>
      {toolbarButtons.map((btn, idx) => (
        <Tooltip key={btn.key} title={btn.tip}>
          <Button
            type={btn.primary ? 'primary' : 'text'}
            size="small"
            icon={btn.icon}
            onClick={btn.onClick}
            style={{
              ...toolbarBtnBase,
              borderRight: idx < toolbarButtons.length - 1 ? `1px solid ${colors.border}` : 'none',
            }}
          />
        </Tooltip>
      ))}
    </div>
  )

  // ERP 전체 단일 MDI: 모듈별 필터 없이 모든 탭 표시 (우클릭용 data-tabkey, 고정 탭은 X 위치에 압핀 표시, 새로고침용 key)
  const tabItems = tabs.map((tab) => ({
    key: tab.key,
    label: (
      <span data-tabkey={tab.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {tab.icon} {tab.label}
      </span>
    ),
    children: <TabContent key={`${tab.key}-${refreshKeys[tab.key] || 0}`} tabKey={tab.key} componentPath={tab.componentPath} />,
    closable: true,
    closeIcon: isPinned(tab.key) ? <PushpinOutlined style={{ fontSize: 12 }} /> : undefined, // 잠금 시 X 위치에 고정 압핀 표시
  }))

  if (menuLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="메뉴 로딩 중..." />
      </div>
    )
  }

  // ——— 이중 사이드바 레이아웃 ———
  if (layoutType === LAYOUT_SIDEBAR) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* 모듈 아이콘 레일 */}
        <Sider
          width={64}
          style={{ background: colors.primary, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <BankOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {modulesWithIcons.map(mod => (
              <div
                key={mod.id}
                title={mod.name}
                onClick={() => handleModuleChange(mod.id)}
                style={{
                  width: 48, height: 48, margin: '4px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8, cursor: 'pointer', fontSize: 22,
                  color: mod.id === module ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: mod.id === module ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (mod.id !== module) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={(e) => { if (mod.id !== module) e.currentTarget.style.background = 'transparent' }}
              >
                {mod.icon}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 0' }}>
            <div
              title="설정"
              onClick={() => setShowSettings(true)}
              style={{
                width: 48,
                height: 48,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 20,
                color: 'rgba(255,255,255,0.65)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <SettingOutlined />
            </div>
          </div>
        </Sider>

        {/* 메뉴 사이드바 */}
        <Sider width={200} style={{ background: colors.card, borderRight: `1px solid ${colors.border}` }}>
          <div style={{ height: 64, padding: '0 16px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
            <Space>
              <span style={{ fontSize: 20, color: colors.primary }}>{currentModule?.icon}</span>
              <Title level={5} style={{ margin: 0, color: colors.text }}>{currentModule?.name || '모듈'}</Title>
            </Space>
          </div>
          <Menu mode="inline" selectedKeys={activeKey ? [activeKey] : []} onClick={handleMenuClick} items={menuItemsForAntd} style={{ borderRight: 0, background: 'transparent' }} />
        </Sider>

        <Layout>
          <Header style={{ height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, background: colors.card }}>
            <Title level={4} style={{ margin: 0, color: colors.text }}>ERP System</Title>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: colors.primary }} />
                <div style={{ lineHeight: 1.2 }}>
                  <Text strong style={{ display: 'block', color: colors.text }}>{user?.name || '사용자'}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{user?.role || 'User'}</Text>
                </div>
              </Space>
            </Dropdown>
          </Header>
          <Content style={{ margin: 0, padding: 0, background: colors.background, minHeight: 280, overflow: 'auto' }}>
            {tabItems.length > 0 ? (
              <div onContextMenu={handleTabContextMenu} style={{ height: '100%' }}>
                {contextMenu && (
                  <div
                    ref={contextMenuRef}
                    style={{
                      position: 'fixed',
                      left: contextMenu.x,
                      top: contextMenu.y,
                      zIndex: 1050,
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      padding: '4px 0',
                      minWidth: 180,
                    }}
                  >
                    <Menu mode="vertical" selectedKeys={[]} items={tabContextMenuItems} style={{ border: 'none', background: 'transparent' }} />
                  </div>
                )}
                <Tabs type="editable-card" hideAdd destroyInactiveTabPane={false} activeKey={activeKey} onChange={handleTabChange} onEdit={handleTabEdit} items={tabItems} tabBarExtraContent={tabToolbar} style={{ height: '100%', padding: '8px 16px 0 16px' }} tabBarStyle={{ marginBottom: 0 }} />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400, color: colors.textSecondary, flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 48, opacity: 0.3 }}>{currentModule?.icon || <BankOutlined />}</span>
                <Text type="secondary">왼쪽 메뉴에서 화면을 선택하세요</Text>
              </div>
            )}
          </Content>
        </Layout>

        <SettingsPopup isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </Layout>
    )
  }

  // ——— 상단 탭바 레이아웃 ———
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ height: 48, padding: 0, background: colors.primary, display: 'flex', alignItems: 'center', lineHeight: 'normal' }}>
        <div style={{ width: 220, height: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(0,0,0,0.1)', flexShrink: 0 }}>
          <Space size="small">
            <BankOutlined style={{ fontSize: 20, color: '#fff' }} />
            <Title level={5} style={{ margin: 0, color: '#fff', fontWeight: 600 }}>ERP System</Title>
          </Space>
        </div>
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <Tabs activeKey={module} onChange={handleModuleChange} items={moduleTabItems} tabBarStyle={{ margin: 0, height: 48 }} tabBarGutter={0} className="module-tabs-inline" />
        </div>
      </Header>

      <Layout>
        <Sider width={220} style={{ background: colors.card, borderRight: `1px solid ${colors.border}`, height: 'calc(100vh - 48px)', position: 'sticky', top: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <div style={{ padding: '16px', borderBottom: `1px solid ${colors.border}` }}>
                <Space>
                  <span style={{ fontSize: 18, color: colors.primary }}>{currentModule?.icon}</span>
                  <Text strong style={{ fontSize: 15, color: colors.text }}>{currentModule?.name || '모듈'}</Text>
                </Space>
              </div>
              <Menu mode="inline" selectedKeys={activeKey ? [activeKey] : []} onClick={handleMenuClick} items={menuItemsForAntd} style={{ borderRight: 0, background: 'transparent' }} />
            </div>
            <div style={{ borderTop: `1px solid ${colors.border}`, padding: '12px 16px', background: colors.card, flexShrink: 0 }}>
              <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px', borderRadius: 6 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = colors.border }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: colors.primary, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', color: colors.text }}>{user?.name || '사용자'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{user?.role || 'User'}</Text>
                  </div>
                  <SettingOutlined style={{ color: colors.textSecondary }} />
                </div>
              </Dropdown>
            </div>
          </div>
        </Sider>

        <Content style={{ margin: 0, padding: 0, background: colors.background, minHeight: 280, overflow: 'auto' }}>
          <div style={{ margin: 16, minHeight: 'calc(100vh - 48px - 32px)', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {tabItems.length > 0 ? (
              <div onContextMenu={handleTabContextMenu} style={{ flex: 1, height: '100%' }}>
                {contextMenu && (
                  <div
                    ref={contextMenuRef}
                    style={{
                      position: 'fixed',
                      left: contextMenu.x,
                      top: contextMenu.y,
                      zIndex: 1050,
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      padding: '4px 0',
                      minWidth: 180,
                    }}
                  >
                    <Menu mode="vertical" selectedKeys={[]} items={tabContextMenuItems} style={{ border: 'none', background: 'transparent' }} />
                  </div>
                )}
                <Tabs type="editable-card" hideAdd destroyInactiveTabPane={false} activeKey={activeKey} onChange={handleTabChange} onEdit={handleTabEdit} items={tabItems} tabBarExtraContent={tabToolbar} style={{ flex: 1, height: '100%', padding: '8px 16px 0 16px' }} tabBarStyle={{ marginBottom: 0 }} />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, color: colors.textSecondary, flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 48, opacity: 0.3 }}>{currentModule?.icon || <BankOutlined />}</span>
                <Text type="secondary">왼쪽 메뉴에서 화면을 선택하세요</Text>
              </div>
            )}
          </div>
        </Content>
      </Layout>

      <SettingsPopup isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <style>{`
        .module-tabs-inline .ant-tabs-nav { margin: 0 !important; height: 48px !important; }
        .module-tabs-inline .ant-tabs-nav::before { border-bottom: none !important; }
        .module-tabs-inline .ant-tabs-tab { background: transparent !important; border: none !important; color: rgba(255,255,255,0.7) !important; padding: 0 20px !important; margin: 0 !important; height: 48px !important; line-height: 48px !important; }
        .module-tabs-inline .ant-tabs-tab:hover { color: #fff !important; background: rgba(255,255,255,0.1) !important; }
        .module-tabs-inline .ant-tabs-tab-active { background: rgba(255,255,255,0.15) !important; color: #fff !important; }
        .module-tabs-inline .ant-tabs-tab-active .ant-tabs-tab-btn { color: #fff !important; }
        .module-tabs-inline .ant-tabs-ink-bar { background: #fff !important; height: 3px !important; }
        .module-tabs-inline .ant-tabs-tab-btn { color: inherit !important; }
        .module-tabs-inline .ant-tabs-nav-operations, .module-tabs-inline .ant-tabs-nav-more { color: rgba(255,255,255,0.7) !important; }
        .module-tabs-inline .ant-tabs-nav-list { height: 48px !important; }
      `}</style>
    </Layout>
  )
}

export default MainLayout
