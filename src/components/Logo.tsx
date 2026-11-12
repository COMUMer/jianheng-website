import BrandMark from './BrandMark'

export default function Logo({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <a className={`brand${compact ? ' brand-compact' : ''}`} href="#home" aria-label="见衡科技，返回首页" onClick={onClick}>
      <BrandMark className="brand-symbol" />
      <span className="brand-type">
        <strong>见衡<span>科技</span></strong>
        <small>JIANHENG TECHNOLOGY</small>
      </span>
    </a>
  )
}
