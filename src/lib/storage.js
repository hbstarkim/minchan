const STORAGE_KEY = 'excel-agent-workspace:sheets:v1'

export const DEFAULT_ROWS = 30
export const DEFAULT_COLS = 8

function emptyData(rows = DEFAULT_ROWS, cols = DEFAULT_COLS) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''))
}

let idCounter = 0
export function makeSheet(name) {
  idCounter += 1
  return {
    id: `sheet-${Date.now()}-${idCounter}`,
    name: name || 'Sheet 1',
    data: emptyData(),
  }
}

export function loadSheets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed?.sheets) && parsed.sheets.length > 0) {
      return parsed.sheets
    }
    return null
  } catch {
    return null
  }
}

export function saveSheets(sheets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sheets }))
  } catch {
    // 저장 실패(용량 초과 등)는 조용히 무시
  }
}

export { emptyData }
