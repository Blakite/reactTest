import { useState, useEffect, useRef } from 'react'
import { 
  SearchForm, SearchButtons, PageHeader,
  Form, Select, DatePicker, Card,
  FileTextOutlined 
} from '@/components/ui'
import { Spin, message, Checkbox } from 'antd'
import dayjs from 'dayjs'
import ibsheetManager from '@/utils/ibsheetManager'

// 디폴트 마감년월 계산 (10일 이전이면 지난달, 이후면 이번달)
const getDefaultClosingMonth = () => {
  const today = dayjs()
  const day = today.date()
  if (day < 10) {
    return today.subtract(1, 'month').startOf('month')
  }
  return today.startOf('month')
}

// 상단 체크박스 옵션 (그림과 동일)
const SECTION_CHECKBOXES = [
  { key: 'siteClose', label: '현장마감여부' },
  { key: 'siteExpense', label: '현장경비' },
  { key: 'corpCard', label: '법인카드' },
  { key: 'advanceFund', label: '전도금현황' },
  { key: 'tempPayment', label: '가지급금현황' },
  { key: 'tempReceipt', label: '가수금현황' },
  { key: 'jointVenture', label: '공동도급' },
]

// 샘플 데이터 (그림 컬럼 구조에 맞춤)
const sampleClosingData = [
  {
    no: 1, chk: false, gubun: '현장', siteCode: 'S001', siteName: 'A현장',
    siteClose_construction: 'Y', siteClose_outside: 'Y', siteClose_material: 'Y', siteClose_labor: 'Y', siteClose_expense: 'Y', siteClose_corpCard: 'Y',
    advance_prevMonth: 1000, advance_deposit: 500, advance_withdraw: 300, advance_balance: 1200,
    tempPay_lastDate: '2026-01-15', tempPay_applied: 2000, tempPay_settlement: 1800, tempPay_balance: 200,
  },
  {
    no: 2, chk: false, gubun: '현장', siteCode: 'S002', siteName: 'B현장',
    siteClose_construction: 'Y', siteClose_outside: 'N', siteClose_material: 'Y', siteClose_labor: 'Y', siteClose_expense: 'N', siteClose_corpCard: 'Y',
    advance_prevMonth: 800, advance_deposit: 200, advance_withdraw: 400, advance_balance: 600,
    tempPay_lastDate: '2026-01-10', tempPay_applied: 1500, tempPay_settlement: 1500, tempPay_balance: 0,
  },
]

const corporations = [
  { value: '전체', label: '전체' },
  { value: '본사', label: '본사' },
  { value: '지사A', label: '지사A' },
  { value: '지사B', label: '지사B' },
]

const departments = [
  { value: '전체', label: '전체' },
  { value: '경영지원팀', label: '경영지원팀' },
  { value: '개발팀', label: '개발팀' },
  { value: '영업팀', label: '영업팀' },
]

// IBSheet 설정 - 전사마감현황 목록 컬럼 (그림과 동일: 다단 헤더)
const sheetConfig = {
  Cfg: {
    SearchMode: 2,
    CanEdit: 0,
    HeaderMerge: 2,
  },
  Cols: [
    { Header: '순번', Name: 'no', Type: 'Int', Width: 50, Align: 'Center' },
    { Header: '선택', Name: 'chk', Type: 'Bool', Width: 50, Align: 'Center' },
    { Header: '구분', Name: 'gubun', Type: 'Text', Width: 70, Align: 'Center' },
    { Header: '현장코드', Name: 'siteCode', Type: 'Text', Width: 90, Align: 'Center' },
    { Header: '현장명', Name: 'siteName', Type: 'Text', Width: 100, Align: 'Center' },
    // 현장마감여부 (6개)
    { Header: ['현장마감여부', '공사'], Name: 'siteClose_construction', Type: 'Text', Width: 60, Align: 'Center' },
    { Header: ['현장마감여부', '외주'], Name: 'siteClose_outside', Type: 'Text', Width: 60, Align: 'Center' },
    { Header: ['현장마감여부', '자재'], Name: 'siteClose_material', Type: 'Text', Width: 60, Align: 'Center' },
    { Header: ['현장마감여부', '노무'], Name: 'siteClose_labor', Type: 'Text', Width: 60, Align: 'Center' },
    { Header: ['현장마감여부', '현장경비 미결제'], Name: 'siteClose_expense', Type: 'Text', Width: 100, Align: 'Center' },
    { Header: ['현장마감여부', '법인카드 미결제'], Name: 'siteClose_corpCard', Type: 'Text', Width: 100, Align: 'Center' },
    // 전도금 현황 (4개)
    { Header: ['전도금 현황', '전월이월'], Name: 'advance_prevMonth', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    { Header: ['전도금 현황', '입금'], Name: 'advance_deposit', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    { Header: ['전도금 현황', '출금'], Name: 'advance_withdraw', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    { Header: ['전도금 현황', '잔액'], Name: 'advance_balance', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    // 가지급금 현황 (4개)
    { Header: ['가지급금 현황', '최종지급일'], Name: 'tempPay_lastDate', Type: 'Text', Width: 90, Align: 'Center' },
    { Header: ['가지급금 현황', '신청금액'], Name: 'tempPay_applied', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    { Header: ['가지급금 현황', '정산금액'], Name: 'tempPay_settlement', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
    { Header: ['가지급금 현황', '잔액'], Name: 'tempPay_balance', Type: 'Int', Width: 90, Align: 'Right', Format: '#,###' },
  ],
}

// 체크박스 기본값 (모두 체크)
const defaultSectionChecked = SECTION_CHECKBOXES.reduce((acc, { key }) => ({ ...acc, [key]: true }), {})

function ClosingStatus({ tabKey }) {
  const [form] = Form.useForm()
  const [selectedCorp, setSelectedCorp] = useState('전체')
  const [selectedDept, setSelectedDept] = useState('전체')
  const [closingMonth, setClosingMonth] = useState(getDefaultClosingMonth())
  const [sectionChecked, setSectionChecked] = useState(defaultSectionChecked)
  
  // Loader 관련 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetReady, setIsSheetReady] = useState(false)
  const sheetRef = useRef(null)
  const containerRef = useRef(null)
  const isCreatingRef = useRef(false)  // 생성 "시작" 여부
  const sheetId = 'closingSheet'

  // IBSheet Loader로 동적 로드
  useEffect(() => {
    let isMounted = true

    const loadIBSheet = async () => {
      try {
        // @ibsheet/loader를 사용하여 동적 로드
        const loader = (await import('@ibsheet/loader')).default
        
        // IBSheet 설정
        loader.config({
          registry: [{
            name: 'ibsheet',
            baseUrl: '/ibsheet/',
            locales: ['ko'],
          }]
        })

        // IBSheet 로드
        await loader.load()
        
        if (isMounted) {
          setIsLoading(false)
          console.log('[IBSheet Loader] 로드 완료')
        }
      } catch (error) {
        console.error('[IBSheet Loader] 오류:', error)
        if (isMounted) {
          message.error('IBSheet 로드에 실패했습니다.')
          setIsLoading(false)
        }
      }
    }

    loadIBSheet()

    return () => {
      isMounted = false
    }
  }, [])

  // IBSheet 생성
  useEffect(() => {
    // 이미 생성 시작했으면 스킵 (StrictMode 대응)
    if (isCreatingRef.current) {
      console.log(`[IBSheet Loader] Already creating, skipping: ${sheetId}`)
      return
    }

    if (isLoading || !containerRef.current || !window.IBSheet) return

    // 생성 시작 표시 (비동기 호출 전에!)
    isCreatingRef.current = true

    const createSheet = async () => {
      try {
        const sheet = await window.IBSheet.create({
          id: sheetId,
          el: containerRef.current,
          options: {
            ...sheetConfig,
            Cfg: {
              ...sheetConfig.Cfg,
              FitWidth: 1,
              Language: 'ko',
            },
          },
          data: { data: getFilteredData() },
          locale: 'ko',
        })

        sheetRef.current = sheet
        ibsheetManager.register(sheetId, tabKey)
        setIsSheetReady(true)
        console.log(`[IBSheet Loader] Created: ${sheetId} (tab: ${tabKey})`)
      } catch (error) {
        console.error('[IBSheet Loader] 생성 오류:', error)
        isCreatingRef.current = false  // 에러 시 다시 시도 가능
      }
    }

    createSheet()

    return () => {}
  }, [isLoading])

  // 필터링된 데이터 가져오기 (순번 부여)
  const getFilteredData = () => {
    return sampleClosingData.map((item, idx) => ({ ...item, no: idx + 1 }))
  }

  const filteredData = getFilteredData()

  const handleSearch = () => {
    console.log('조회:', { selectedCorp, selectedDept, closingMonth: closingMonth.format('YYYY-MM') })
    if (sheetRef.current) {
      sheetRef.current.loadSearchData({ data: filteredData })
    }
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedCorp('전체')
    setSelectedDept('전체')
    setClosingMonth(getDefaultClosingMonth())
  }

  return (
    <div>
      <PageHeader 
        icon={<FileTextOutlined />} 
        title="전사마감현황 목록" 
        extra={<SearchButtons onSearch={handleSearch} onReset={handleReset} />}
      />

      {/* 조회 조건 */}
      <SearchForm form={form} showButtons={false}>
        <Form.Item label="법인" name="corp">
          <Select
            value={selectedCorp}
            onChange={setSelectedCorp}
            options={corporations}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item label="부서" name="dept">
          <Select
            value={selectedDept}
            onChange={setSelectedDept}
            options={departments}
            style={{ width: 150 }}
          />
        </Form.Item>
        <Form.Item label="마감년월" name="closingMonth">
          <DatePicker
            value={closingMonth}
            onChange={(date) => setClosingMonth(date || getDefaultClosingMonth())}
            picker="month"
            format="YYYY-MM"
          />
        </Form.Item>
      </SearchForm>

      {/* 상단 체크박스 (그림과 동일) */}
      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center' }}>
        {SECTION_CHECKBOXES.map(({ key, label }) => (
          <Checkbox
            key={key}
            checked={sectionChecked[key]}
            onChange={(e) => setSectionChecked((prev) => ({ ...prev, [key]: e.target.checked }))}
          >
            {label}
          </Checkbox>
        ))}
      </div>

      {/* 마감현황 그리드 - Loader 방식 */}
      <Card>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Spin size="large" tip="IBSheet 로딩 중..." />
          </div>
        ) : (
          <div ref={containerRef} style={{ width: '100%', height: 400 }} />
        )}
      </Card>

      {/* Loader 방식 표시 */}
      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
        * 이 화면은 IBSheet Loader 방식으로 동적 로드됩니다.
      </div>
    </div>
  )
}

export default ClosingStatus
