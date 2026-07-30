import { memo, useCallback } from 'react'
import { Box } from '@chakra-ui/react'
import { colLabel, parseClipboard, applyPaste } from '../lib/paste'

/**
 * 엑셀 느낌의 편집 가능한 그리드.
 * - 각 셀은 input. 값 변경 시 onChange(newData) 호출
 * - 여러 셀 붙여넣기(탭/개행 포함) 시 자동 파싱 & 확장
 */
function Grid({ data, onChange }) {
  const rows = data.length
  const cols = data[0]?.length ?? 0

  const handleCellChange = useCallback(
    (r, c, value) => {
      const next = data.map((row) => row.slice())
      next[r][c] = value
      onChange(next)
    },
    [data, onChange],
  )

  const handlePaste = useCallback(
    (e, r, c) => {
      const text = e.clipboardData?.getData('text/plain') ?? ''
      // 다중 셀(탭 또는 개행 포함)일 때만 가로채서 분배
      if (text.includes('\t') || text.includes('\n')) {
        e.preventDefault()
        const pasted = parseClipboard(text)
        onChange(applyPaste(data, r, c, pasted))
      }
      // 단일 값이면 기본 붙여넣기 동작에 맡김
    },
    [data, onChange],
  )

  const handleKeyDown = useCallback(
    (e, r, c) => {
      const focusCell = (nr, nc) => {
        const el = document.querySelector(
          `[data-cell="${nr}-${nc}"]`,
        )
        if (el) {
          el.focus()
          el.select?.()
        }
      }
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        focusCell(Math.min(r + 1, rows - 1), c)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusCell(Math.max(r - 1, 0), c)
      } else if (e.key === 'ArrowRight') {
        if (e.target.selectionStart === e.target.value.length) {
          e.preventDefault()
          focusCell(r, Math.min(c + 1, cols - 1))
        }
      } else if (e.key === 'ArrowLeft') {
        if (e.target.selectionStart === 0) {
          e.preventDefault()
          focusCell(r, Math.max(c - 1, 0))
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const nc = e.shiftKey ? c - 1 : c + 1
        if (nc >= 0 && nc < cols) focusCell(r, nc)
        else if (!e.shiftKey && r < rows - 1) focusCell(r + 1, 0)
      }
    },
    [rows, cols],
  )

  return (
    <Box overflow="auto" h="100%" w="100%">
      <table
        style={{
          borderCollapse: 'separate',
          borderSpacing: 0,
          tableLayout: 'fixed',
          minWidth: 'max-content',
        }}
      >
        <thead>
          <tr>
            <th style={cornerStyle}></th>
            {Array.from({ length: cols }, (_, c) => (
              <th key={c} style={headStyle}>
                {colLabel(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, r) => (
            <tr key={r}>
              <td style={rowHeadStyle}>{r + 1}</td>
              {row.map((cell, c) => (
                <td key={c} style={cellTdStyle}>
                  <input
                    data-cell={`${r}-${c}`}
                    value={cell}
                    onChange={(e) => handleCellChange(r, c, e.target.value)}
                    onPaste={(e) => handlePaste(e, r, c)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    style={inputStyle}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

const CELL_W = 128
const CELL_H = 30

const headStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 2,
  width: CELL_W,
  minWidth: CELL_W,
  maxWidth: CELL_W,
  height: CELL_H,
  background: '#F4F7FE',
  color: '#707EAE',
  fontSize: 12,
  fontWeight: 700,
  border: '1px solid #E0E5F2',
  borderLeft: 'none',
  textAlign: 'center',
}

const cornerStyle = {
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 3,
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  height: CELL_H,
  background: '#E9EDF7',
  border: '1px solid #E0E5F2',
}

const rowHeadStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 1,
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  height: CELL_H,
  background: '#F4F7FE',
  color: '#707EAE',
  fontSize: 12,
  fontWeight: 600,
  textAlign: 'center',
  border: '1px solid #E0E5F2',
  borderTop: 'none',
}

const cellTdStyle = {
  padding: 0,
  border: '1px solid #E0E5F2',
  borderTop: 'none',
  borderLeft: 'none',
  width: CELL_W,
  minWidth: CELL_W,
  maxWidth: CELL_W,
  height: CELL_H,
}

const inputStyle = {
  width: '100%',
  height: CELL_H - 1,
  border: 'none',
  outline: 'none',
  padding: '0 8px',
  fontSize: 13,
  color: '#1B2559',
  background: 'transparent',
  fontFamily: 'inherit',
}

export default memo(Grid)
