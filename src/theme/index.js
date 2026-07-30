import { extendTheme } from '@chakra-ui/react'

/**
 * Horizon UI 스타일을 참고한 Chakra 테마.
 * - 브랜드 퍼플(#4318FF) 계열
 * - 밝은 배경(secondaryGray) + 둥근 카드 + 소프트 섀도우
 */

const colors = {
  brand: {
    50: '#EBEFFF',
    100: '#E9E3FF',
    200: '#C0B8FE',
    300: '#A195FD',
    400: '#8171FC',
    500: '#7551FF',
    600: '#4318FF',
    700: '#3311DB',
    800: '#2111A5',
    900: '#190793',
  },
  brandScheme: {
    100: '#E9E3FF',
    500: '#7551FF',
    600: '#4318FF',
    900: '#190793',
  },
  secondaryGray: {
    100: '#E0E5F2',
    200: '#E1E9F8',
    300: '#F4F7FE',
    400: '#E9EDF7',
    500: '#8F9BBA',
    600: '#A3AED0',
    700: '#707EAE',
    800: '#707EAE',
    900: '#1B2559',
  },
  navy: {
    50: '#d0dcfb',
    100: '#aac0fe',
    200: '#a3b9f8',
    300: '#728fea',
    400: '#3652ba',
    500: '#1b3bbb',
    600: '#24388a',
    700: '#1B254B',
    800: '#111c44',
    900: '#0b1437',
  },
}

const styles = {
  global: {
    body: {
      bg: 'secondaryGray.300',
      color: 'navy.700',
      fontFamily: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      overflow: 'hidden',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    html: {
      fontFamily: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      borderRadius: '16px',
      fontWeight: '600',
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
}

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({ colors, styles, components, config })

export default theme

// 편의를 위한 카드 공통 스타일
export const cardStyle = {
  bg: 'white',
  borderRadius: '20px',
  boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
}
