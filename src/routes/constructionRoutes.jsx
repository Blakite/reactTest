import { lazy, Suspense } from 'react'
import MainLayout from '../layouts/MainLayout'

// Lazy 로드 컴포넌트
const Dashboard = lazy(() => import('../pages/construction/Dashboard'))
const ProjectList = lazy(() => import('../pages/construction/ProjectList'))
const ProjectDetail = lazy(() => import('../pages/construction/ProjectDetail'))
const ContractList = lazy(() => import('../pages/construction/ContractList'))
const ProgressReport = lazy(() => import('../pages/construction/ProgressReport'))

// 컴포넌트 매핑 (탭에서 사용)
export const constructionComponents = {
  '/construction': Dashboard,
  '/construction/projects': ProjectList,
  '/construction/projects/:id': ProjectDetail,
  '/construction/contracts': ContractList,
  '/construction/progress': ProgressReport,
}

// 메뉴 설정 (MainLayout에서 사용)
export const constructionMenu = {
  title: '공사관리',
  items: [
    { key: '/construction', label: '대시보드' },
    { key: '/construction/projects', label: '공사목록' },
    { key: '/construction/contracts', label: '계약관리' },
    { key: '/construction/progress', label: '기성관리' },
  ],
}

const constructionRoutes = [
  {
    path: '/construction',
    element: <MainLayout module="construction" />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'contracts', element: <ContractList /> },
      { path: 'progress', element: <ProgressReport /> },
    ],
  },
]

export default constructionRoutes
