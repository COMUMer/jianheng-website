import { ArrowRight, ArrowUp } from 'lucide-react'
import Logo from '../components/Logo'

export default function Footer({ onPrivacy, onContact }: { onPrivacy: () => void; onContact: () => void }) {
  return (
    <footer className="company-footer">
      <svg className="company-footer-waves" viewBox="0 0 1440 76" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 31C260 88 420 4 720 27S1150 71 1440 18V76H0Z" />
        <path d="M0 47C260 8 450 72 720 50S1190 18 1440 51V76H0Z" />
        <path d="M0 56C320 85 490 31 720 46S1180 80 1440 58V76H0Z" />
      </svg>
      <div className="company-footer-body">
        <div className="company-shell">
          <div className="company-footer-main">
            <div><Logo /><p>见衡（深圳）人工智能科技公司</p></div>
            <nav aria-label="页脚导航"><a href="#about">关于见衡</a><a href="#scenarios">解决方案</a></nav>
            <button type="button" className="company-pill" onClick={onContact}><span>咨询方案</span><ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <div className="company-footer-bottom">
            <p>© {new Date().getFullYear()} 见衡科技 JIANHENG</p>
            <div><button type="button" onClick={onPrivacy}>隐私说明</button><a href="#home">返回顶部 <ArrowUp size={15} aria-hidden="true" /></a></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
