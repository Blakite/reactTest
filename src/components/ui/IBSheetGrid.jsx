/**
 * IBSheetGrid - IBSheet8 래퍼 컴포넌트
 * window.IBSheet를 직접 사용
 */
import { useEffect, useRef } from 'react'

export default function IBSheetGrid({ 
  id, 
  config, 
  data,
  height = 400,
  onRenderFinish,
  onClick,
}) {
  const containerRef = useRef(null)
  const sheetRef = useRef(null)
  const isCreating = useRef(false)

  useEffect(() => {
    // IBSheet 생성
    const createSheet = async () => {
      if (!window.IBSheet || !containerRef.current || isCreating.current) {
        return
      }

      // 이미 존재하는 시트가 있으면 제거
      try {
        if (window.IBSheet.getSheetById(id)) {
          window.IBSheet.disposeById(id)
        }
      } catch (e) {
        // 시트가 없으면 무시
      }

      isCreating.current = true

      const options = {
        ...config,
        Cfg: {
          ...config.Cfg,
          FitWidth: 1,
          Language: 'ko',
        },
      }

      try {
        const sheet = await window.IBSheet.create({
          id: id,
          el: containerRef.current,
          options: options,
          data: { data: data || [] },
          locale: 'ko',
        })
        
        sheetRef.current = sheet
        isCreating.current = false
        
        if (onRenderFinish) {
          onRenderFinish(sheet)
        }
      } catch (e) {
        console.error('IBSheet 생성 오류:', e)
        isCreating.current = false
      }
    }

    createSheet()

    // Cleanup
    return () => {
      isCreating.current = false
      if (window.IBSheet) {
        try {
          window.IBSheet.disposeById(id)
        } catch (e) {
          // 무시
        }
        sheetRef.current = null
      }
    }
  }, [id])

  // 데이터 변경 시 리로드
  useEffect(() => {
    if (sheetRef.current && data) {
      sheetRef.current.loadSearchData({ data: data })
    }
  }, [data])

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: height }}
    />
  )
}
