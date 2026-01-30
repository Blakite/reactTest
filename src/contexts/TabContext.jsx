import { createContext, useContext, useState, useCallback } from 'react'
import { message } from 'antd'
import ibsheetManager from '@/utils/ibsheetManager'

const TabContext = createContext(null)

const MAX_TABS = 15

export function TabProvider({ children }) {
  const [tabs, setTabs] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  // 탭 추가 (이미 있으면 포커스 이동)
  const addTab = useCallback((tab) => {
    setTabs(prevTabs => {
      // 이미 열린 탭인지 확인
      const existingTab = prevTabs.find(t => t.key === tab.key)
      if (existingTab) {
        // 이미 열려있으면 해당 탭으로 포커스 이동
        setActiveKey(tab.key)
        return prevTabs
      }

      // 최대 탭 수 확인
      if (prevTabs.length >= MAX_TABS) {
        message.warning(`최대 ${MAX_TABS}개의 탭만 열 수 있습니다.`)
        return prevTabs
      }

      // 새 탭 추가
      setActiveKey(tab.key)
      return [...prevTabs, tab]
    })
  }, [])

  // 탭 제거
  const removeTab = useCallback((targetKey) => {
    setTabs(prevTabs => {
      const targetIndex = prevTabs.findIndex(t => t.key === targetKey)
      if (targetIndex === -1) return prevTabs

      // 해당 탭의 IBSheet dispose
      ibsheetManager.disposeByTab(targetKey)

      const newTabs = prevTabs.filter(t => t.key !== targetKey)

      // 닫은 탭이 활성 탭이면 다른 탭 활성화
      if (activeKey === targetKey && newTabs.length > 0) {
        // 이전 탭 또는 다음 탭 활성화
        const newActiveIndex = targetIndex === 0 ? 0 : targetIndex - 1
        setActiveKey(newTabs[newActiveIndex]?.key || null)
      } else if (newTabs.length === 0) {
        setActiveKey(null)
      }

      return newTabs
    })
  }, [activeKey])

  // 탭 활성화
  const setActiveTab = useCallback((key) => {
    setActiveKey(key)
  }, [])

  // 모든 탭 닫기
  const removeAllTabs = useCallback(() => {
    ibsheetManager.disposeAll()
    setTabs([])
    setActiveKey(null)
  }, [])

  // 다른 탭 닫기 (현재 탭 제외)
  const removeOtherTabs = useCallback((keepKey) => {
    setTabs(prevTabs => {
      prevTabs.forEach(tab => {
        if (tab.key !== keepKey) {
          ibsheetManager.disposeByTab(tab.key)
        }
      })
      return prevTabs.filter(t => t.key === keepKey)
    })
  }, [])

  const value = {
    tabs,
    activeKey,
    addTab,
    removeTab,
    setActiveTab,
    removeAllTabs,
    removeOtherTabs,
  }

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  )
}

export function useTab() {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTab must be used within a TabProvider')
  }
  return context
}

export default TabContext
