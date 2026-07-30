import { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'

/**
 * 좌우 2분할 + 가운데 드래그 리사이저.
 * left / right 는 렌더된 노드.
 */
export default function SplitPane({ left, right, initial = 42, min = 25, max = 75 }) {
  const [leftPct, setLeftPct] = useState(initial)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const onMouseDown = useCallback(() => {
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setLeftPct(Math.min(max, Math.max(min, pct)))
    }
    const onUp = () => {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [min, max])

  return (
    <Flex ref={containerRef} h="100%" w="100%" overflow="hidden">
      <Box w={`${leftPct}%`} h="100%" p={3} pr={1.5} overflow="hidden">
        <PaneCard>{left}</PaneCard>
      </Box>

      {/* 리사이저 */}
      <Flex
        align="center"
        justify="center"
        w="10px"
        cursor="col-resize"
        onMouseDown={onMouseDown}
        role="separator"
        aria-orientation="vertical"
        flexShrink={0}
      >
        <Box
          w="4px"
          h="46px"
          borderRadius="full"
          bg="secondaryGray.400"
          transition="background 0.15s"
          _hover={{ bg: 'brand.500' }}
        />
      </Flex>

      <Box w={`${100 - leftPct}%`} h="100%" p={3} pl={1.5} overflow="hidden">
        <PaneCard>{right}</PaneCard>
      </Box>
    </Flex>
  )
}

function PaneCard({ children }) {
  return (
    <Box
      h="100%"
      w="100%"
      bg="white"
      borderRadius="20px"
      boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)"
      overflow="hidden"
    >
      {children}
    </Box>
  )
}
