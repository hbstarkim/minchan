/**
 * 삼성전자 로고를 인라인 SVG로 재현한 컴포넌트.
 * (외부 이미지 의존 / CSP 문제를 피하기 위해 파란 타원 + SAMSUNG 워드마크를 직접 그림)
 */
export default function SamsungLogo({ height = 28 }) {
  // 원본 비율(대략 5.2 : 1)에 맞춘 뷰박스
  const width = height * 5.2
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 520 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SAMSUNG"
    >
      {/* 파란 타원 배경 */}
      <ellipse cx="260" cy="50" rx="258" ry="46" fill="#1428A0" />
      {/* SAMSUNG 워드마크 */}
      <text
        x="260"
        y="50"
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="46"
        fontWeight="700"
        letterSpacing="6"
        textAnchor="middle"
        dominantBaseline="central"
      >
        SAMSUNG
      </text>
    </svg>
  )
}
