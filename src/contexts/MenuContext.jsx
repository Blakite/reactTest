import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchUserMenus } from '@/services/api'
import { getIcon } from '@/utils/iconMapping'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [modules, setModules] = useState([])
  const [menus, setMenus] = useState([])
  const [componentRegistry, setComponentRegistry] = useState({})

  // 메뉴 로드
  const loadUserMenus = useCallback(async (userId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchUserMenus(userId)
      
      setUser(data.user)
      setModules(data.modules)
      setMenus(data.menus)

      // 컴포넌트 레지스트리 생성 (동적 import)
      const registry = {}
      for (const menu of data.menus) {
        // 동적 import를 위한 함수 저장
        registry[menu.key] = () => import(/* @vite-ignore */ `@/pages/${menu.componentPath}`)
      }
      setComponentRegistry(registry)

      console.log('[MenuContext] Loaded menus for user:', userId, data)
    } catch (err) {
      console.error('[MenuContext] Failed to load menus:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 로그인 시 메뉴 로드
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      loadUserMenus(userId)
    } else {
      setIsLoading(false)
    }
  }, [loadUserMenus])

  // 특정 모듈의 메뉴 가져오기
  const getMenusByModule = useCallback((moduleId) => {
    return menus
      .filter(menu => menu.moduleId === moduleId)
      .map(menu => ({
        key: menu.key,
        label: menu.label,
        icon: getIcon(menu.icon),
        componentPath: menu.componentPath,
      }))
  }, [menus])

  // 메뉴 키로 메뉴 정보 가져오기
  const getMenuByKey = useCallback((key) => {
    const menu = menus.find(m => m.key === key)
    if (!menu) return null
    return {
      ...menu,
      icon: getIcon(menu.icon),
    }
  }, [menus])

  // 모듈 정보 가져오기 (아이콘 포함)
  const getModulesWithIcons = useCallback(() => {
    return modules.map(mod => ({
      ...mod,
      icon: getIcon(mod.icon),
    }))
  }, [modules])

  // 메뉴 새로고침
  const refreshMenus = useCallback(async () => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      await loadUserMenus(userId)
    }
  }, [loadUserMenus])

  // 로그아웃 시 메뉴 초기화
  const clearMenus = useCallback(() => {
    setUser(null)
    setModules([])
    setMenus([])
    setComponentRegistry({})
  }, [])

  const value = {
    isLoading,
    error,
    user,
    modules,
    menus,
    componentRegistry,
    loadUserMenus,
    getMenusByModule,
    getMenuByKey,
    getModulesWithIcons,
    refreshMenus,
    clearMenus,
  }

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

export default MenuContext
