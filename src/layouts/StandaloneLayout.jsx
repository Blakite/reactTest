import { useState, useEffect, Suspense, lazy } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Layout, Button, Typography, Spin } from '@/lib/antd'
import { useMenu } from '@/contexts/MenuContext'
import { CloseOutlined } from '@ant-design/icons'

const { Header, Content } = Layout
const { Title } = Typography

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

export default function StandaloneLayout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const path = searchParams.get('path')
  const { getMenuByKey, isLoading: menuLoading } = useMenu()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || menuLoading) return
    const userId = localStorage.getItem('userId')
    if (!userId) {
      navigate('/login')
      return
    }
    if (!path) {
      navigate('/')
      return
    }
  }, [mounted, menuLoading, path, navigate])

  const menu = path ? getMenuByKey(path) : null

  useEffect(() => {
    if (path && !menuLoading && menu === null && getMenuByKey(path) === null) {
      navigate('/')
    }
  }, [path, menuLoading, menu, getMenuByKey, navigate])

  if (!mounted || menuLoading || !path || !menu) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="로딩 중..." />
      </div>
    )
  }

  const Component = loadComponent(menu.componentPath)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {menu.icon} {menu.label}
        </Title>
        <Button type="text" icon={<CloseOutlined />} onClick={() => window.close()}>
          닫기
        </Button>
      </Header>
      <Content style={{ padding: 16, background: '#f5f5f5' }}>
        <Suspense
          fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Spin size="large" />
            </div>
          }
        >
          <Component tabKey={path} />
        </Suspense>
      </Content>
    </Layout>
  )
}
