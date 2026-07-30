/**
 * 엑셀/스프레드시트에서 복사한 클립보드 텍스트를 2차원 배열로 파싱.
 * - 행 구분: \r\n 또는 \n
 * - 열 구분: \t (탭)
 */
export function parseClipboard(text) {
  if (text == null) return [[]]
  // 마지막에 붙는 개행 하나는 제거(엑셀 복사 시 흔함)
  const normalized = text.replace(/\r\n/g, '\n').replace(/\n$/, '')
  const rows = normalized.split('\n')
  return rows.map((row) => row.split('\t'))
}

function colLabel(index) {
  let n = index
  let label = ''
  do {
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return label
}

export { colLabel }

/**
 * data(2차원 배열)의 (startR, startC) 위치부터 pasted 블록을 써넣음.
 * 필요 시 행/열을 자동으로 확장한 새 배열을 반환.
 */
export function applyPaste(data, startR, startC, pasted) {
  const neededRows = startR + pasted.length
  const neededCols = startC + Math.max(...pasted.map((r) => r.length))

  const curRows = data.length
  const curCols = data[0]?.length ?? 0
  const rows = Math.max(curRows, neededRows)
  const cols = Math.max(curCols, neededCols)

  // 확장된 크기로 새 그리드 생성 후 기존 값 복사
  const next = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => data[r]?.[c] ?? ''),
  )

  for (let r = 0; r < pasted.length; r += 1) {
    for (let c = 0; c < pasted[r].length; c += 1) {
      next[startR + r][startC + c] = pasted[r][c]
    }
  }
  return next
}
