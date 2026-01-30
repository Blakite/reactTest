/**
 * IBSheet 전역 관리자
 * MDI 탭 환경에서 시트를 안전하게 관리
 */

// 등록된 시트 정보 { sheetId: { tabKey, sheetId } }
const registeredSheets = new Map()

// 시트가 실제로 제거되었는지 확인 (최대 500ms 대기)
const waitForDispose = async (id, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const sheet = window.IBSheet.getSheetById(id)
      if (!sheet) {
        return true // 제거됨
      }
      // 다시 시도
      window.IBSheet.disposeById(id)
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (e) {
      return true // 에러 = 시트 없음
    }
  }
  console.warn(`[IBSheetManager] Failed to dispose after ${maxAttempts} attempts: ${id}`)
  return false
}

const ibsheetManager = {
  /**
   * 시트 등록 (탭 키와 함께)
   */
  register(sheetId, tabKey = null) {
    registeredSheets.set(sheetId, { sheetId, tabKey })
    console.log(`[IBSheetManager] Registered: ${sheetId} (tab: ${tabKey})`, this.getRegisteredSheets())
  },

  /**
   * 시트 해제
   */
  unregister(sheetId) {
    registeredSheets.delete(sheetId)
    console.log(`[IBSheetManager] Unregistered: ${sheetId}`)
  },

  /**
   * 특정 시트 dispose (비동기, 완료 대기)
   */
  async dispose(sheetId) {
    if (!window.IBSheet) return

    try {
      const sheet = window.IBSheet.getSheetById(sheetId)
      if (sheet) {
        window.IBSheet.disposeById(sheetId)
        await waitForDispose(sheetId)
        console.log(`[IBSheetManager] Disposed: ${sheetId}`)
      }
    } catch (e) {
      // 무시
    }
    registeredSheets.delete(sheetId)
  },

  /**
   * 특정 탭의 모든 시트 dispose
   */
  async disposeByTab(tabKey) {
    if (!window.IBSheet) return

    const sheetsToDispose = []
    registeredSheets.forEach((info, sheetId) => {
      if (info.tabKey === tabKey) {
        sheetsToDispose.push(sheetId)
      }
    })

    console.log(`[IBSheetManager] Disposing sheets for tab ${tabKey}:`, sheetsToDispose)

    const disposePromises = sheetsToDispose.map(async (sheetId) => {
      try {
        const sheet = window.IBSheet.getSheetById(sheetId)
        if (sheet) {
          window.IBSheet.disposeById(sheetId)
          await waitForDispose(sheetId)
          console.log(`[IBSheetManager] Disposed: ${sheetId}`)
        }
      } catch (e) {
        // 무시
      }
      registeredSheets.delete(sheetId)
    })

    await Promise.all(disposePromises)
  },

  /**
   * 모든 등록된 시트 dispose (비동기, 완료 대기)
   */
  async disposeAll() {
    if (!window.IBSheet) return

    const sheets = Array.from(registeredSheets.keys())
    console.log(`[IBSheetManager] Disposing all sheets:`, sheets)

    const disposePromises = sheets.map(async (sheetId) => {
      try {
        const sheet = window.IBSheet.getSheetById(sheetId)
        if (sheet) {
          window.IBSheet.disposeById(sheetId)
          await waitForDispose(sheetId)
          console.log(`[IBSheetManager] Disposed: ${sheetId}`)
        }
      } catch (e) {
        // 무시
      }
    })

    await Promise.all(disposePromises)
    registeredSheets.clear()
    
    console.log(`[IBSheetManager] All sheets disposed`)
  },

  /**
   * 시트 존재 여부 확인
   */
  exists(sheetId) {
    if (!window.IBSheet) return false
    try {
      return !!window.IBSheet.getSheetById(sheetId)
    } catch (e) {
      return false
    }
  },

  /**
   * 등록된 시트 목록 반환
   */
  getRegisteredSheets() {
    return Array.from(registeredSheets.keys())
  },

  /**
   * 특정 탭의 시트 목록 반환
   */
  getSheetsByTab(tabKey) {
    const sheets = []
    registeredSheets.forEach((info, sheetId) => {
      if (info.tabKey === tabKey) {
        sheets.push(sheetId)
      }
    })
    return sheets
  }
}

export default ibsheetManager
