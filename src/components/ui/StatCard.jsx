/**
 * StatCard - 통계 카드 컴포넌트
 * Card + Statistic 래핑
 */
import { Card, Statistic } from 'antd'

export default function StatCard({ 
  title, 
  value, 
  suffix,
  prefix,
  color,
  formatter,
  ...props 
}) {
  return (
    <Card {...props}>
      <Statistic 
        title={title}
        value={value}
        suffix={suffix}
        prefix={prefix}
        formatter={formatter}
        valueStyle={color ? { color } : undefined}
      />
    </Card>
  )
}
