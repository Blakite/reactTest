import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// Lazy 로드 컴포넌트
const Dashboard = lazy(() => import('../pages/accounting/Dashboard'))
const JournalEntry = lazy(() => import('../pages/accounting/JournalEntry'))
const AccountList = lazy(() => import('../pages/accounting/AccountList'))
const VoucherList = lazy(() => import('../pages/accounting/VoucherList'))
const ClosingStatus = lazy(() => import('../pages/accounting/ClosingStatus'))
const BlankPage = lazy(() => import('../pages/common/BlankPage'))

// URL 직접 접근 시 pathname을 tabKey로 전달하는 래퍼
function BlankPageRoute() {
  const { pathname } = useLocation()
  return (
    <Suspense fallback={null}>
      <BlankPage tabKey={pathname} />
    </Suspense>
  )
}

// 컴포넌트 매핑 (탭에서 사용, 3레벨 메뉴용 - 메뉴는 menus.json componentPath 기준 동적 로드)
export const accountingComponents = {
  '/accounting': Dashboard,
  '/accounting/journal': JournalEntry,
  '/accounting/ledger/journal': JournalEntry,
  '/accounting/accounts': AccountList,
  '/accounting/vouchers': VoucherList,
  '/accounting/closing': ClosingStatus,
  '/accounting/inquiry/voucher-mgmt': VoucherList,
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
      { path: 'ledger/journal', element: <JournalEntry /> },
      { path: 'accounts', element: <AccountList /> },
      { path: 'vouchers', element: <VoucherList /> },
      { path: 'vouchers/tax-invoice', element: <BlankPageRoute /> },
      { path: 'vouchers/dept-expense', element: <BlankPageRoute /> },
      { path: 'vouchers/personal-expense', element: <BlankPageRoute /> },
      { path: 'vouchers/advance', element: <BlankPageRoute /> },
      { path: 'vouchers/unsettled-reversal', element: <BlankPageRoute /> },
      { path: 'vouchers/temp', element: <BlankPageRoute /> },
      { path: 'vouchers/corp-card', element: <BlankPageRoute /> },
      { path: 'vouchers/closing', element: <BlankPageRoute /> },
      { path: 'vouchers/unsettled', element: <BlankPageRoute /> },
      { path: 'vouchers/common-cost', element: <BlankPageRoute /> },
      { path: 'inquiry/voucher-mgmt', element: <VoucherList /> },
      { path: 'inquiry/voucher', element: <BlankPageRoute /> },
      { path: 'inquiry/history', element: <BlankPageRoute /> },
      { path: 'inquiry/daily', element: <BlankPageRoute /> },
      { path: 'closing', element: <ClosingStatus /> },
    ],
  },
]

export default accountingRoutes
