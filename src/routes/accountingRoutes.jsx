import { lazy, Suspense } from 'react'
import MainLayout from '../layouts/MainLayout'

// Lazy 로드 컴포넌트
const Dashboard = lazy(() => import('../pages/accounting/Dashboard'))
const JournalEntry = lazy(() => import('../pages/accounting/JournalEntry'))
const AccountList = lazy(() => import('../pages/accounting/AccountList'))
const VoucherList = lazy(() => import('../pages/accounting/VoucherList'))
const ClosingStatus = lazy(() => import('../pages/accounting/ClosingStatus'))

// 컴포넌트 매핑 (탭에서 사용)
export const accountingComponents = {
  '/accounting': Dashboard,
  '/accounting/journal': JournalEntry,
  '/accounting/accounts': AccountList,
  '/accounting/vouchers': VoucherList,
  '/accounting/closing': ClosingStatus,
}

// 메뉴 설정 (MainLayout에서 사용)
export const accountingMenu = {
  title: '회계관리',
  items: [
    { key: '/accounting', label: '대시보드' },
    { key: '/accounting/journal', label: '분개장' },
    { key: '/accounting/accounts', label: '계정과목' },
    { key: '/accounting/vouchers', label: '전표관리' },
    { key: '/accounting/closing', label: '마감현황' },
  ],
}

const accountingRoutes = [
  {
    path: '/accounting',
    element: <MainLayout module="accounting" />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'journal', element: <JournalEntry /> },
      { path: 'accounts', element: <AccountList /> },
      { path: 'vouchers', element: <VoucherList /> },
      { path: 'closing', element: <ClosingStatus /> },
    ],
  },
]

export default accountingRoutes
