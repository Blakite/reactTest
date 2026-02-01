import authRoutes from './authRoutes'
import accountingRoutes, { accountingComponents, accountingMenu } from './accountingRoutes'
import constructionRoutes, { constructionComponents, constructionMenu } from './constructionRoutes'
import Home from '../pages/Home'
import StandaloneLayout from '../layouts/StandaloneLayout'

// 전체 컴포넌트 매핑
export const componentRegistry = {
  ...accountingComponents,
  ...constructionComponents,
}

// 메뉴 설정
export const menuConfig = {
  accounting: accountingMenu,
  construction: constructionMenu,
}

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/standalone',
    element: <StandaloneLayout />,
  },
  ...authRoutes,
  ...accountingRoutes,
  ...constructionRoutes,
]

export default routes
