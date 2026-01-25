import { lazy } from 'react'
import MainLayout from '../layouts/MainLayout'

const Dashboard = lazy(() => import('../pages/construction/Dashboard'))
const ProjectList = lazy(() => import('../pages/construction/ProjectList'))
const ProjectDetail = lazy(() => import('../pages/construction/ProjectDetail'))
const ContractList = lazy(() => import('../pages/construction/ContractList'))
const ProgressReport = lazy(() => import('../pages/construction/ProgressReport'))

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
