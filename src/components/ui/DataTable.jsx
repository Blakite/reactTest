/**
 * DataTable - 공통 데이터 테이블 컴포넌트
 * Ant Design Table을 래핑하여 회사 공통 설정 적용
 */
import { Table } from 'antd'

const defaultPagination = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total) => `총 ${total}건`,
}

export default function DataTable({ 
  columns, 
  data, 
  rowKey = 'id',
  pagination = true,
  ...props 
}) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      pagination={pagination === false ? false : { ...defaultPagination, ...pagination }}
      bordered
      size="middle"
      {...props}
    />
  )
}
