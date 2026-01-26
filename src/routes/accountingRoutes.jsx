import { lazy } from 'react'
import MainLayout from '../layouts/MainLayout'

const Dashboard = lazy(() => import('../pages/accounting/Dashboard'))
const JournalEntry = lazy(() => import('../pages/accounting/JournalEntry'))
const AccountList = lazy(() => import('../pages/accounting/AccountList'))
const VoucherList = lazy(() => import('../pages/accounting/VoucherList'))
const ClosingStatus = lazy(() => import('../pages/accounting/ClosingStatus'))

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
