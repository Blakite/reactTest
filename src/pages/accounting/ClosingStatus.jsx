import { useState, useEffect, useRef } from 'react'
import { 
  SearchForm, SearchButtons, PageHeader, StatCard,
  Form, Select, DatePicker, Row, Col, Card,
  FileTextOutlined 
} from '@/components/ui'
import { Spin, message } from 'antd'
import dayjs from 'dayjs'

// 디폴트 마감년월 계산 (10일 이전이면 지난달, 이후면 이번달)
const getDefaultClosingMonth = () => {
  const today = dayjs()
  const day = today.date()
  if (day < 10) {
    return today.subtract(1, 'month').startOf('month')
  }
  return today.startOf('month')
}

// 샘플 데이터
const sampleClosingData = [
  { id: 1, corp: '본사', dept: '경영지원팀', month: '2026-01', status: '마감완료', closedAt: '2026-01-15', closedBy: '김회계' },
  { id: 2, corp: '본사', dept: '개발팀', month: '2026-01', status: '마감완료', closedAt: '2026-01-14', closedBy: '이재무' },
  { id: 3, corp: '본사', dept: '영업팀', month: '2026-01', status: '미마감', closedAt: '', closedBy: '' },
  { id: 4, corp: '지사A', dept: '경영지원팀', month: '2026-01', status: '마감완료', closedAt: '2026-01-13', closedBy: '박경리' },
  { id: 5, corp: '지사A', dept: '영업팀', month: '2026-01', status: '진행중', closedAt: '', closedBy: '' },
  { id: 6, corp: '지사B', dept: '경영지원팀', month: '2026-01', status: '미마감', closedAt: '', closedBy: '' },
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

// IBSheet 설정
const sheetConfig = {
  Cfg: {
    SearchMode: 2,
    CanEdit: 0,
    HeaderMerge: 3,
  },
  Cols: [
    { Header: '법인', Name: 'corp', Type: 'Text', Width: 100, Align: 'Center' },
    { Header: '부서', Name: 'dept', Type: 'Text', Width: 120, Align: 'Center' },
    { Header: '마감년월', Name: 'month', Type: 'Text', Width: 100, Align: 'Center' },
    { Header: '마감상태', Name: 'status', Type: 'Text', Width: 100, Align: 'Center' },
    { Header: '마감일시', Name: 'closedAt', Type: 'Text', Width: 120, Align: 'Center' },
    { Header: '마감처리자', Name: 'closedBy', Type: 'Text', Width: 100, Align: 'Center' },
  ],
}

function ClosingStatus() {
  const [form] = Form.useForm()
  const [selectedCorp, setSelectedCorp] = useState('전체')
  const [selectedDept, setSelectedDept] = useState('전체')
  const [closingMonth, setClosingMonth] = useState(getDefaultClosingMonth())
  
  // Loader 관련 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetReady, setIsSheetReady] = useState(false)
  const sheetRef = useRef(null)
  const containerRef = useRef(null)
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
          console.log('IBSheet Loader: 로드 완료')
        }
      } catch (error) {
        console.error('IBSheet Loader 오류:', error)
        message.error('IBSheet 로드에 실패했습니다.')
        if (isMounted) {
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
    if (isLoading || !containerRef.current || !window.IBSheet) return

    const createSheet = async () => {
      try {
        // 기존 시트 제거
        try {
          if (window.IBSheet.getSheetById(sheetId)) {
            window.IBSheet.disposeById(sheetId)
          }
        } catch (e) {}

        const sheet = await window.IBSheet.create({
          id: sheetId,
          el: containerRef.current,
          options: {
            ...sheetConfig,
            Cfg: {
              ...sheetConfig.Cfg,
              FitWidth: 1,
            },
          },
          data: { data: getFilteredData() },
        })

        sheetRef.current = sheet
        setIsSheetReady(true)
        console.log('IBSheet 생성 완료 (Loader 방식)')
      } catch (error) {
        console.error('IBSheet 생성 오류:', error)
      }
    }

    createSheet()

    return () => {
      if (window.IBSheet) {
        try {
          window.IBSheet.disposeById(sheetId)
        } catch (e) {}
      }
      sheetRef.current = null
    }
  }, [isLoading])

  // 필터링된 데이터 가져오기
  const getFilteredData = () => {
    const monthStr = closingMonth.format('YYYY-MM')
    return sampleClosingData.filter(item => {
      const corpMatch = selectedCorp === '전체' || item.corp === selectedCorp
      const deptMatch = selectedDept === '전체' || item.dept === selectedDept
      const monthMatch = item.month === monthStr
      return corpMatch && deptMatch && monthMatch
    })
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

  // 통계 계산
  const stats = {
    total: filteredData.length,
    closed: filteredData.filter(d => d.status === '마감완료').length,
    inProgress: filteredData.filter(d => d.status === '진행중').length,
    notClosed: filteredData.filter(d => d.status === '미마감').length,
  }

  return (
    <div>
      <PageHeader 
        icon={<FileTextOutlined />} 
        title="마감현황" 
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

      {/* 결과 요약 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <StatCard title="전체" value={stats.total} suffix="건" />
        </Col>
        <Col span={6}>
          <StatCard title="마감완료" value={stats.closed} suffix="건" color="#52c41a" />
        </Col>
        <Col span={6}>
          <StatCard title="진행중" value={stats.inProgress} suffix="건" color="#1890ff" />
        </Col>
        <Col span={6}>
          <StatCard title="미마감" value={stats.notClosed} suffix="건" color="#ff4d4f" />
        </Col>
      </Row>

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
