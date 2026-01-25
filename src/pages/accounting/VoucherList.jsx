import { useState } from 'react'
import { 
  DataTable, SearchForm, SearchButtons, PageHeader, StatCard, StatusTag,
  Form, Select, DatePicker, Row, Col, Card, Typography,
  FileTextOutlined 
} from '@/components/ui'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const { RangePicker } = DatePicker
const { Text } = Typography

// 샘플 데이터
const sampleVouchers = [
  { id: 'V2026-0001', date: '2026-01-25', dept: '경영지원팀', desc: '사무용품 구입', amount: 150000, status: '승인' },
  { id: 'V2026-0002', date: '2026-01-24', dept: '개발팀', desc: '서버 호스팅 비용', amount: 2500000, status: '대기' },
  { id: 'V2026-0003', date: '2026-01-23', dept: '영업팀', desc: '출장 경비', amount: 450000, status: '승인' },
  { id: 'V2026-0004', date: '2026-01-22', dept: '경영지원팀', desc: '복리후생비', amount: 1200000, status: '반려' },
  { id: 'V2026-0005', date: '2026-01-21', dept: '개발팀', desc: '소프트웨어 라이선스', amount: 3500000, status: '대기' },
  { id: 'V2026-0006', date: '2026-01-20', dept: '영업팀', desc: '고객 접대비', amount: 280000, status: '승인' },
  { id: 'V2026-0007', date: '2026-01-19', dept: '인사팀', desc: '교육훈련비', amount: 800000, status: '승인' },
  { id: 'V2026-0008', date: '2026-01-18', dept: '경영지원팀', desc: '통신비', amount: 95000, status: '대기' },
]

const departments = [
  { value: '전체', label: '전체' },
  { value: '경영지원팀', label: '경영지원팀' },
  { value: '개발팀', label: '개발팀' },
  { value: '영업팀', label: '영업팀' },
  { value: '인사팀', label: '인사팀' },
]

function VoucherList() {
  const [form] = Form.useForm()
  const [selectedDept, setSelectedDept] = useState('전체')
  const [dateRange, setDateRange] = useState([dayjs('2026-01-01'), dayjs('2026-01-31')])

  // 필터링된 전표 목록
  const filteredVouchers = sampleVouchers.filter(voucher => {
    const deptMatch = selectedDept === '전체' || voucher.dept === selectedDept
    const dateMatch = dateRange 
      ? dayjs(voucher.date).isBetween(dateRange[0], dateRange[1], 'day', '[]')
      : true
    return deptMatch && dateMatch
  })

  const totalAmount = filteredVouchers.reduce((sum, v) => sum + v.amount, 0)

  const handleSearch = () => {
    console.log('조회:', { selectedDept, dateRange })
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedDept('전체')
    setDateRange([dayjs('2026-01-01'), dayjs('2026-01-31')])
  }

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '전표번호',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '발행일자',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: '발행부서',
      dataIndex: 'dept',
      key: 'dept',
      width: 120,
      filters: departments.filter(d => d.value !== '전체').map(d => ({ text: d.label, value: d.value })),
      onFilter: (value, record) => record.dept === value,
    },
    {
      title: '적요',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
    },
    {
      title: '금액',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => <Text strong>₩ {amount.toLocaleString()}</Text>,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      filters: [
        { text: '승인', value: '승인' },
        { text: '대기', value: '대기' },
        { text: '반려', value: '반려' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <StatusTag status={status} />,
    },
  ]

  return (
    <div>
      <PageHeader 
        icon={<FileTextOutlined />} 
        title="전표관리" 
        extra={<SearchButtons onSearch={handleSearch} onReset={handleReset} />}
      />

      {/* 조회 조건 */}
      <SearchForm form={form} showButtons={false}>
        <Form.Item label="발행부서" name="dept">
          <Select
            value={selectedDept}
            onChange={setSelectedDept}
            options={departments}
            style={{ width: 150 }}
            placeholder="부서 선택"
          />
        </Form.Item>
        <Form.Item label="발행일자" name="dateRange">
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
          />
        </Form.Item>
      </SearchForm>

      {/* 결과 요약 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <StatCard title="조회결과" value={filteredVouchers.length} suffix="건" />
        </Col>
        <Col span={6}>
          <StatCard 
            title="합계금액" 
            value={totalAmount} 
            prefix="₩"
            formatter={(value) => value.toLocaleString()}
          />
        </Col>
        <Col span={6}>
          <StatCard 
            title="승인" 
            value={filteredVouchers.filter(v => v.status === '승인').length}
            suffix="건"
            color="#52c41a"
          />
        </Col>
        <Col span={6}>
          <StatCard 
            title="대기" 
            value={filteredVouchers.filter(v => v.status === '대기').length}
            suffix="건"
            color="#faad14"
          />
        </Col>
      </Row>

      {/* 전표 목록 테이블 */}
      <Card>
        <DataTable columns={columns} data={filteredVouchers} />
      </Card>
    </div>
  )
}

export default VoucherList
