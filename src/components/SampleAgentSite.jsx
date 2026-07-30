import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Textarea,
  IconButton,
  Icon,
  Badge,
  Divider,
} from '@chakra-ui/react'
import {
  MdSend,
  MdWorkOutline,
  MdCode,
  MdCampaign,
  MdAccountBalance,
  MdGavel,
  MdSupportAgent,
  MdInsights,
  MdSmartToy,
  MdPerson,
} from 'react-icons/md'
import SamsungLogo from './SamsungLogo'

const CATEGORIES = [
  { key: 'hr', label: '인사 · 총무', icon: MdWorkOutline },
  { key: 'dev', label: '개발 · 기술', icon: MdCode },
  { key: 'mkt', label: '마케팅', icon: MdCampaign },
  { key: 'fin', label: '재무 · 회계', icon: MdAccountBalance },
  { key: 'legal', label: '법무 · 특허', icon: MdGavel },
  { key: 'cs', label: '고객지원', icon: MdSupportAgent },
  { key: 'data', label: '데이터 분석', icon: MdInsights },
]

const SAMPLE_REPLY = (q) =>
  `"${q}" 에 대한 예시 답변입니다.\n\n· 이 화면은 사내 AI Agent가 연결되지 않았을 때 표시되는 샘플 목업입니다.\n· 실제 사내 사이트를 연결하려면 환경변수 VITE_AGENT_URL 에 사내 URL을 입력하세요.`

export default function SampleAgentSite() {
  const [active, setActive] = useState('hr')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const send = () => {
    const q = input.trim()
    if (!q) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'bot', text: SAMPLE_REPLY(q) },
    ])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const activeLabel = CATEGORIES.find((c) => c.key === active)?.label

  return (
    <Flex direction="column" h="100%" bg="white" overflow="hidden">
      {/* 상단 헤더: 로고 */}
      <Flex
        align="center"
        justify="space-between"
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="secondaryGray.100"
        flexShrink={0}
      >
        <HStack spacing={4}>
          <SamsungLogo height={24} />
          <Divider orientation="vertical" h="24px" />
          <Text fontWeight="700" fontSize="lg" color="navy.700">
            사내 AI Agent
          </Text>
        </HStack>
        <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
          SAMPLE
        </Badge>
      </Flex>

      <Flex flex="1" overflow="hidden">
        {/* 좌측 업무 분류 */}
        <VStack
          align="stretch"
          spacing={1}
          w="220px"
          flexShrink={0}
          bg="secondaryGray.300"
          p={3}
          overflowY="auto"
        >
          <Text
            fontSize="xs"
            fontWeight="700"
            color="secondaryGray.600"
            px={3}
            py={2}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            업무 분류
          </Text>
          {CATEGORIES.map((c) => {
            const selected = c.key === active
            return (
              <HStack
                key={c.key}
                as="button"
                onClick={() => setActive(c.key)}
                spacing={3}
                px={3}
                py={2.5}
                borderRadius="14px"
                bg={selected ? 'white' : 'transparent'}
                boxShadow={selected ? '0px 10px 22px rgba(112,144,176,0.12)' : 'none'}
                _hover={{ bg: selected ? 'white' : 'secondaryGray.400' }}
                transition="all 0.15s"
                textAlign="left"
              >
                <Icon
                  as={c.icon}
                  boxSize={5}
                  color={selected ? 'brand.600' : 'secondaryGray.600'}
                />
                <Text
                  fontSize="sm"
                  fontWeight={selected ? '700' : '500'}
                  color={selected ? 'navy.700' : 'secondaryGray.700'}
                >
                  {c.label}
                </Text>
              </HStack>
            )
          })}
        </VStack>

        {/* 가운데 대화 영역 */}
        <Flex direction="column" flex="1" overflow="hidden">
          <Box ref={scrollRef} flex="1" overflowY="auto" px={{ base: 5, md: 10 }} py={6}>
            {messages.length === 0 ? (
              <Flex direction="column" align="center" justify="center" h="100%" textAlign="center">
                <Flex
                  align="center"
                  justify="center"
                  boxSize="64px"
                  borderRadius="20px"
                  bg="brand.50"
                  mb={5}
                >
                  <Icon as={MdSmartToy} boxSize={8} color="brand.600" />
                </Flex>
                <Text fontSize="2xl" fontWeight="700" color="navy.700" mb={2}>
                  무엇을 도와드릴까요?
                </Text>
                <Text color="secondaryGray.700" maxW="440px">
                  선택된 업무 분류: <b>{activeLabel}</b>
                  <br />
                  아래 입력창에 질문을 입력해 보세요. (샘플 목업 응답)
                </Text>
              </Flex>
            ) : (
              <VStack align="stretch" spacing={4} maxW="760px" mx="auto">
                {messages.map((m, i) => (
                  <HStack
                    key={i}
                    align="flex-start"
                    spacing={3}
                    flexDir={m.role === 'user' ? 'row-reverse' : 'row'}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      boxSize="36px"
                      flexShrink={0}
                      borderRadius="12px"
                      bg={m.role === 'user' ? 'navy.700' : 'brand.50'}
                    >
                      <Icon
                        as={m.role === 'user' ? MdPerson : MdSmartToy}
                        boxSize={5}
                        color={m.role === 'user' ? 'white' : 'brand.600'}
                      />
                    </Flex>
                    <Box
                      bg={m.role === 'user' ? 'brand.600' : 'secondaryGray.300'}
                      color={m.role === 'user' ? 'white' : 'navy.700'}
                      px={4}
                      py={3}
                      borderRadius="16px"
                      maxW="80%"
                      whiteSpace="pre-wrap"
                      fontSize="sm"
                      lineHeight="1.6"
                    >
                      {m.text}
                    </Box>
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>

          {/* 입력창 */}
          <Box px={{ base: 5, md: 10 }} py={4} borderTop="1px solid" borderColor="secondaryGray.100">
            <Flex
              maxW="760px"
              mx="auto"
              align="flex-end"
              bg="secondaryGray.300"
              borderRadius="18px"
              px={4}
              py={2}
              gap={2}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="프롬프트를 입력하세요… (Enter 전송 / Shift+Enter 줄바꿈)"
                variant="unstyled"
                resize="none"
                rows={1}
                maxH="120px"
                py={2}
                fontSize="sm"
              />
              <IconButton
                aria-label="전송"
                icon={<MdSend />}
                colorScheme="brand"
                borderRadius="14px"
                onClick={send}
                isDisabled={!input.trim()}
              />
            </Flex>
            <Text textAlign="center" fontSize="xs" color="secondaryGray.600" mt={2}>
              샘플 사내 사이트 · 실제 연결 시 VITE_AGENT_URL 환경변수를 설정하세요
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
