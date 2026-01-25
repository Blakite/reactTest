/**
 * SearchForm - 공통 검색 폼 컴포넌트
 * Card + Form을 래핑하여 검색 영역 패턴 적용
 * 
 * showButtons: false로 설정하면 버튼 숨김 (PageHeader에 버튼 배치 시)
 */
import { Card, Form, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

export default function SearchForm({ 
  form,
  onSearch, 
  onReset, 
  children,
  searchText = '조회',
  resetText = '초기화',
  showButtons = true,
  ...props 
}) {
  return (
    <Card style={{ marginBottom: 16 }} {...props}>
      <Form form={form} layout="inline">
        {children}
        {showButtons && (
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
                {searchText}
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={onReset}
              >
                {resetText}
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  )
}

// 버튼 컴포넌트도 export (PageHeader에서 사용)
export function SearchButtons({ onSearch, onReset, searchText = '조회', resetText = '초기화' }) {
  return (
    <Space>
      <Button 
        type="primary" 
        icon={<SearchOutlined />}
        onClick={onSearch}
      >
        {searchText}
      </Button>
      <Button 
        icon={<ReloadOutlined />}
        onClick={onReset}
      >
        {resetText}
      </Button>
    </Space>
  )
}

// Form.Item도 함께 export
export { Form }
