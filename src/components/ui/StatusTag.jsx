/**
 * StatusTag - 상태 태그 컴포넌트
 * 상태값에 따라 자동으로 색상 적용
 */
import { Tag } from 'antd'

const defaultStatusColors = {
  // 승인 관련
  '승인': 'success',
  '완료': 'success',
  '정상': 'success',
  
  // 대기 관련
  '대기': 'warning',
  '진행중': 'warning',
  '처리중': 'warning',
  
  // 반려/오류 관련
  '반려': 'error',
  '오류': 'error',
  '지연': 'error',
  '취소': 'error',
}

export default function StatusTag({ 
  status, 
  color,
  colorMap = {},
  ...props 
}) {
  const mergedColorMap = { ...defaultStatusColors, ...colorMap }
  const tagColor = color || mergedColorMap[status] || 'default'
  
  return (
    <Tag color={tagColor} {...props}>
      {status}
    </Tag>
  )
}
