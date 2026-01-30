/**
 * IBSheetGrid - IBSheet8 래퍼 컴포넌트
 * 
 * MDI 탭 환경에서 안전하게 동작
 */
import { useEffect, useRef } from 'react'
import ibsheetManager from '@/utils/ibsheetManager'

export default function IBSheetGrid({ 
  id, 
  tabKey,  // 소속 탭 키 (MDI용)
  config, 
  data,
  height = 400,
  onRenderFinish,
  onClick,
}) {
  const containerRef = useRef(null)
  const sheetRef = useRef(null)
  const isCreatingRef = useRef(false)

  // IBSheet 생성
  useEffect(() => {
    // 이미 생성 시작했으면 스킵 (StrictMode 대응)
    if (isCreatingRef.current) {
      console.log(`[IBSheetGrid] Already creating, skipping: ${id}`)
      return
    }

    if (!window.IBSheet || !containerRef.current) {
      return
    }

    // 생성 시작 표시 (비동기 호출 전에!)
    isCreatingRef.current = true

    const createSheet = async () => {
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
        ibsheetManager.register(id, tabKey)
        console.log(`[IBSheetGrid] Created: ${id} (tab: ${tabKey})`)
        
        if (onRenderFinish) {
          onRenderFinish(sheet)
        }
      } catch (e) {
        console.error(`[IBSheetGrid] Create error (${id}):`, e)
        isCreatingRef.current = false
      }
    }

    createSheet()

    return () => {
      // 컴포넌트 언마운트 시 시트 정리
      if (sheetRef.current) {
        ibsheetManager.dispose(id)
        sheetRef.current = null
        isCreatingRef.current = false
      }
    }
  }, [id, tabKey])

  // 데이터 변경 시 리로드
  useEffect(() => {
    if (sheetRef.current && data) {
      try {
        sheetRef.current.loadSearchData({ data: data })
      } catch (e) {
        console.error(`[IBSheetGrid] Load data error (${id}):`, e)
      }
    }
  }, [data, id])

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: height }}
    />
  )
}
