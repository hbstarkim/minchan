import { useState, useEffect } from 'react'
import { Box, Flex, HStack, Text, Button, Icon, Input, Tooltip } from '@chakra-ui/react'
import { MdOpenInNew, MdRefresh, MdLanguage, MdWarningAmber } from 'react-icons/md'
import SampleAgentSite from './SampleAgentSite'

const AGENT_URL = import.meta.env.VITE_AGENT_URL?.trim()

export default function AgentPanel() {
  // env에 URL이 없으면 샘플 사이트를 렌더
  if (!AGENT_URL) {
    return (
      <Flex direction="column" h="100%" overflow="hidden">
        <SampleAgentSite />
      </Flex>
    )
  }

  return <AgentIframe url={AGENT_URL} />
}

function AgentIframe({ url }) {
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [maybeBlocked, setMaybeBlocked] = useState(false)

  // iframe이 로드 이벤트를 발생시키지 않으면(X-Frame-Options 등) 안내 표시
  useEffect(() => {
    setLoaded(false)
    setMaybeBlocked(false)
    const t = setTimeout(() => {
      setMaybeBlocked((prev) => (loaded ? false : true))
    }, 4000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  return (
    <Flex direction="column" h="100%" bg="white" overflow="hidden">
      {/* 툴바 */}
      <HStack
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="secondaryGray.100"
        spacing={3}
        flexShrink={0}
      >
        <Icon as={MdLanguage} color="brand.600" boxSize={5} />
        <Input
          value={url}
          isReadOnly
          variant="filled"
          bg="secondaryGray.300"
          size="sm"
          borderRadius="12px"
          fontSize="xs"
          color="secondaryGray.700"
        />
        <Tooltip label="새로고침">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReloadKey((k) => k + 1)}
            leftIcon={<MdRefresh />}
          >
            새로고침
          </Button>
        </Tooltip>
        <Tooltip label="새 창에서 열기">
          <Button
            size="sm"
            variant="ghost"
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<MdOpenInNew />}
          >
            새 창
          </Button>
        </Tooltip>
      </HStack>

      {/* iframe */}
      <Box position="relative" flex="1" overflow="hidden">
        <iframe
          key={reloadKey}
          src={url}
          title="사내 AI Agent"
          onLoad={() => {
            setLoaded(true)
            setMaybeBlocked(false)
          }}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />

        {/* iframe이 막혔을 수 있을 때 안내 오버레이 */}
        {maybeBlocked && (
          <Flex
            position="absolute"
            inset="0"
            direction="column"
            align="center"
            justify="center"
            bg="rgba(244,247,254,0.96)"
            textAlign="center"
            px={8}
            gap={3}
          >
            <Icon as={MdWarningAmber} boxSize={10} color="orange.400" />
            <Text fontWeight="700" color="navy.700">
              화면이 표시되지 않나요?
            </Text>
            <Text fontSize="sm" color="secondaryGray.700" maxW="420px">
              사내 사이트가 iframe 삽입을 허용하지 않을 수 있습니다
              (X-Frame-Options / CSP). 아래 버튼으로 새 창에서 열어 사용하세요.
            </Text>
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="brand"
              leftIcon={<MdOpenInNew />}
            >
              새 창에서 열기
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
