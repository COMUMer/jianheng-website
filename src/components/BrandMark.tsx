export default function BrandMark({ className = '', draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <path
        d="M6 5v22c0 11 10 11 16 1L36 5M21 5v34M21 22h16v17"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="square"
        pathLength={draw ? 100 : undefined}
      />
    </svg>
  )
}
