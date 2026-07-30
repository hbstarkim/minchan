import { Flex, HStack, Text, Icon, Badge, Spacer } from '@chakra-ui/react'
import { MdGridView } from 'react-icons/md'
import SplitPane from './components/SplitPane'
import ExcelPanel from './components/ExcelPanel'
import AgentPanel from './components/AgentPanel'

export default function App() {
  const hasAgentUrl = !!import.meta.env.VITE_AGENT_URL?.trim()

  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden">
      {/* 상단 앱 바 */}
      <HStack
        px={6}
        py={3}
        spacing={3}
        bg="white"
        borderBottom="1px solid"
        borderColor="secondaryGray.100"
        flexShrink={0}
      >
        <Flex
          align="center"
          justify="center"
          boxSize="36px"
          borderRadius="12px"
          bgGradient="linear(to-br, brand.500, brand.700)"
        >
          <Icon as={MdGridView} color="white" boxSize={5} />
        </Flex>
        <Text fontWeight="800" fontSize="lg" color="navy.700">
          Excel × AI Agent Workspace
        </Text>
        <Spacer />
        <Badge
          colorScheme={hasAgentUrl ? 'green' : 'purple'}
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
        >
          {hasAgentUrl ? 'AGENT 연결됨' : '샘플 사이트'}
        </Badge>
      </HStack>

      {/* 좌우 분할 */}
      <Flex flex="1" overflow="hidden">
        <SplitPane left={<ExcelPanel />} right={<AgentPanel />} />
      </Flex>
    </Flex>
  )
}
