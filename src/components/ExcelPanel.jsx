import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import {
  MdAdd,
  MdMoreVert,
  MdDeleteOutline,
  MdDriveFileRenameOutline,
  MdTableChart,
  MdPlaylistAdd,
  MdViewColumn,
  MdCleaningServices,
} from 'react-icons/md'
import Grid from './Grid'
import {
  loadSheets,
  saveSheets,
  makeSheet,
  emptyData,
  DEFAULT_COLS,
} from '../lib/storage'

export default function ExcelPanel() {
  const [sheets, setSheets] = useState(() => loadSheets() || [makeSheet('Sheet 1')])
  const [activeId, setActiveId] = useState(() => (loadSheets()?.[0]?.id) || null)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const toast = useToast()

  // activeId 초기화 보정
  useEffect(() => {
    if (!activeId && sheets.length > 0) setActiveId(sheets[0].id)
  }, [activeId, sheets])

  // 변경 시 localStorage 자동 저장
  useEffect(() => {
    saveSheets(sheets)
  }, [sheets])

  const active = sheets.find((s) => s.id === activeId) || sheets[0]

  const updateActiveData = useCallback(
    (newData) => {
      setSheets((prev) =>
        prev.map((s) => (s.id === active.id ? { ...s, data: newData } : s)),
      )
    },
    [active?.id],
  )

  const addSheet = () => {
    const n = sheets.length + 1
    const sheet = makeSheet(`Sheet ${n}`)
    setSheets((prev) => [...prev, sheet])
    setActiveId(sheet.id)
  }

  const deleteSheet = (id) => {
    if (sheets.length === 1) {
      toast({
        title: '최소 1개의 시트가 필요합니다.',
        status: 'warning',
        duration: 2000,
        position: 'top',
      })
      return
    }
    setSheets((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  const startRename = (sheet) => {
    setRenamingId(sheet.id)
    setRenameValue(sheet.name)
  }

  const commitRename = () => {
    const name = renameValue.trim() || 'Sheet'
    setSheets((prev) =>
      prev.map((s) => (s.id === renamingId ? { ...s, name } : s)),
    )
    setRenamingId(null)
  }

  const addRows = (count = 10) => {
    const cols = active.data[0]?.length ?? DEFAULT_COLS
    const extra = Array.from({ length: count }, () =>
      Array.from({ length: cols }, () => ''),
    )
    updateActiveData([...active.data.map((r) => r.slice()), ...extra])
  }

  const addCols = (count = 4) => {
    updateActiveData(
      active.data.map((r) => [...r, ...Array.from({ length: count }, () => '')]),
    )
  }

  const clearSheet = () => {
    updateActiveData(emptyData())
  }

  if (!active) return null

  return (
    <Flex direction="column" h="100%" bg="white" overflow="hidden">
      {/* 헤더 */}
      <Flex
        align="center"
        justify="space-between"
        px={5}
        py={3}
        borderBottom="1px solid"
        borderColor="secondaryGray.100"
        flexShrink={0}
      >
        <HStack spacing={3}>
          <Flex
            align="center"
            justify="center"
            boxSize="34px"
            borderRadius="12px"
            bg="brand.50"
          >
            <Icon as={MdTableChart} color="brand.600" boxSize={5} />
          </Flex>
          <Box>
            <Text fontWeight="700" color="navy.700" lineHeight="1.1">
              데이터 시트
            </Text>
            <Text fontSize="xs" color="secondaryGray.600">
              엑셀에서 복사해 붙여넣기(Ctrl+V) 하세요
            </Text>
          </Box>
        </HStack>
        <HStack spacing={2}>
          <Tooltip label="행 10개 추가">
            <Button size="sm" variant="ghost" leftIcon={<MdPlaylistAdd />} onClick={() => addRows(10)}>
              행
            </Button>
          </Tooltip>
          <Tooltip label="열 4개 추가">
            <Button size="sm" variant="ghost" leftIcon={<MdViewColumn />} onClick={() => addCols(4)}>
              열
            </Button>
          </Tooltip>
          <Tooltip label="현재 시트 비우기">
            <IconButton
              aria-label="시트 비우기"
              size="sm"
              variant="ghost"
              icon={<MdCleaningServices />}
              onClick={clearSheet}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* 그리드 */}
      <Box flex="1" overflow="hidden" px={2} py={2}>
        <Grid key={active.id} data={active.data} onChange={updateActiveData} />
      </Box>

      {/* 시트 탭 바 */}
      <HStack
        spacing={1}
        px={3}
        py={2}
        borderTop="1px solid"
        borderColor="secondaryGray.100"
        bg="secondaryGray.300"
        overflowX="auto"
        flexShrink={0}
      >
        {sheets.map((s) => {
          const selected = s.id === active.id
          if (renamingId === s.id) {
            return (
              <Input
                key={s.id}
                autoFocus
                size="sm"
                w="120px"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename()
                  if (e.key === 'Escape') setRenamingId(null)
                }}
                bg="white"
                borderRadius="10px"
              />
            )
          }
          return (
            <HStack
              key={s.id}
              spacing={1}
              pl={3}
              pr={1}
              py={1}
              borderRadius="12px"
              bg={selected ? 'white' : 'transparent'}
              boxShadow={selected ? '0px 8px 18px rgba(112,144,176,0.14)' : 'none'}
              cursor="pointer"
              onClick={() => setActiveId(s.id)}
              onDoubleClick={() => startRename(s)}
              flexShrink={0}
              transition="all 0.15s"
              _hover={{ bg: selected ? 'white' : 'secondaryGray.400' }}
            >
              <Text
                fontSize="sm"
                fontWeight={selected ? '700' : '500'}
                color={selected ? 'brand.600' : 'secondaryGray.700'}
                maxW="140px"
                noOfLines={1}
              >
                {s.name}
              </Text>
              <Menu placement="top">
                <MenuButton
                  as={IconButton}
                  aria-label="시트 메뉴"
                  icon={<MdMoreVert />}
                  size="xs"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList minW="150px" onClick={(e) => e.stopPropagation()}>
                  <MenuItem
                    icon={<MdDriveFileRenameOutline />}
                    onClick={() => startRename(s)}
                  >
                    이름 변경
                  </MenuItem>
                  <MenuItem
                    icon={<MdDeleteOutline />}
                    color="red.500"
                    onClick={() => deleteSheet(s.id)}
                  >
                    삭제
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )
        })}
        <Tooltip label="시트 추가">
          <IconButton
            aria-label="시트 추가"
            icon={<MdAdd />}
            size="sm"
            variant="ghost"
            borderRadius="12px"
            onClick={addSheet}
            flexShrink={0}
          />
        </Tooltip>
      </HStack>
    </Flex>
  )
}
