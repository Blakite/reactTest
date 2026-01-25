import authRoutes from './authRoutes'
import accountingRoutes from './accountingRoutes'
import constructionRoutes from './constructionRoutes'
import Home from '../pages/Home'

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  ...authRoutes,
  ...accountingRoutes,
  ...constructionRoutes,
]

export default routes
