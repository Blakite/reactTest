/**
 * Mock API 서비스
 * 
 * 실제 백엔드 연동 시 fetch URL만 변경하면 됨
 */

const API_BASE = '/mock'  // 실제 백엔드: '/api'

/**
 * 메뉴 데이터 조회
 */
export async function fetchMenuData() {
  const response = await fetch(`${API_BASE}/menus.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch menu data')
  }
  return response.json()
}

/**
 * 사용자 데이터 조회
 */
export async function fetchUsers() {
  const response = await fetch(`${API_BASE}/users.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

/**
 * 사용자별 메뉴 조회 (권한 필터링 적용)
 * @param {string} userId - 사용자 ID
 */
export async function fetchUserMenus(userId) {
  const [menuData, userData] = await Promise.all([
    fetchMenuData(),
    fetchUsers()
  ])

  const user = userData.users.find(u => u.id === userId)
  if (!user) {
    throw new Error(`User not found: ${userId}`)
  }

  // 권한에 따라 메뉴 필터링
  let authorizedMenus
  if (user.menuAuth.includes('*')) {
    // 관리자: 모든 메뉴
    authorizedMenus = menuData.menus
  } else {
    // 일반 사용자: 권한 있는 메뉴만
    authorizedMenus = menuData.menus.filter(menu => 
      user.menuAuth.includes(menu.id)
    )
  }

  // 권한 있는 모듈만 필터링
  const authorizedModuleIds = [...new Set(authorizedMenus.map(m => m.moduleId))]
  const authorizedModules = menuData.modules.filter(mod => 
    authorizedModuleIds.includes(mod.id)
  )

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    modules: authorizedModules.sort((a, b) => a.sortOrder - b.sortOrder),
    menus: authorizedMenus.sort((a, b) => a.sortOrder - b.sortOrder),
  }
}

/**
 * 로그인 (Mock)
 * 실제 백엔드에서는 인증 로직 추가
 */
export async function login(userId, password) {
  // Mock: 비밀번호 체크 없이 사용자 존재 여부만 확인
  const userData = await fetchUsers()
  const user = userData.users.find(u => u.id === userId)
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.')
  }

  // 실제 백엔드: JWT 토큰 발급
  return {
    success: true,
    userId: user.id,
    token: 'mock-jwt-token-' + Date.now(),
  }
}
