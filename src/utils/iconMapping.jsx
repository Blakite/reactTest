/**
 * 아이콘 문자열을 React 컴포넌트로 매핑
 * DB에서 조회한 아이콘 이름을 실제 컴포넌트로 변환
 */
import {
  DashboardOutlined,
  FileTextOutlined,
  ProfileOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ProjectOutlined,
  ContainerOutlined,
  BarChartOutlined,
  BankOutlined,
  ToolOutlined,
  SettingOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FolderOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CloudOutlined,
  SafetyOutlined,
  TeamOutlined,
  ShopOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  AccountBookOutlined,
  CreditCardOutlined,
  WalletOutlined,
  CalculatorOutlined,
  FileOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  TruckOutlined,
  InboxOutlined,
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  ScanOutlined,
  QrcodeOutlined,
  BarcodeOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  HeatMapOutlined,
  FundOutlined,
  StockOutlined,
  RiseOutlined,
  FallOutlined,
  AlertOutlined,
  BellOutlined,
  BulbOutlined,
  ExperimentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  HeartOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from '@ant-design/icons'

// 아이콘 이름 → 컴포넌트 매핑
const iconComponents = {
  // 대시보드 & 기본
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  
  // 문서 & 파일
  FileTextOutlined,
  ProfileOutlined,
  AuditOutlined,
  FolderOutlined,
  InboxOutlined,
  
  // 비즈니스
  BankOutlined,
  ToolOutlined,
  ProjectOutlined,
  ContainerOutlined,
  ShopOutlined,
  
  // 차트 & 통계
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  HeatMapOutlined,
  FundOutlined,
  StockOutlined,
  RiseOutlined,
  FallOutlined,
  
  // 상태
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  BellOutlined,
  
  // 설정 & 사용자
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  
  // 금융
  DollarOutlined,
  AccountBookOutlined,
  CreditCardOutlined,
  WalletOutlined,
  CalculatorOutlined,
  FileOutlined,

  // 물류 & 배송
  ShoppingCartOutlined,
  GiftOutlined,
  TruckOutlined,
  CarOutlined,
  
  // 통신
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  
  // 기술
  DatabaseOutlined,
  ApiOutlined,
  CloudOutlined,
  ScanOutlined,
  QrcodeOutlined,
  BarcodeOutlined,
  
  // 기타
  EnvironmentOutlined,
  CalendarOutlined,
  BulbOutlined,
  ExperimentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  HeartOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
}

/**
 * 아이콘 이름으로 React 컴포넌트 반환
 * @param {string} iconName - 아이콘 이름 (예: 'DashboardOutlined')
 * @returns {React.ReactElement|null}
 */
export function getIcon(iconName) {
  const IconComponent = iconComponents[iconName]
  if (IconComponent) {
    return <IconComponent />
  }
  console.warn(`[iconMapping] Unknown icon: ${iconName}`)
  return null
}

/**
 * 아이콘 컴포넌트 클래스 반환 (직접 렌더링용)
 */
export function getIconComponent(iconName) {
  return iconComponents[iconName] || null
}

export default iconComponents
