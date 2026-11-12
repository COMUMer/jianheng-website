import { ArrowRight, ArrowUp, ArrowUpRight, MapPin } from 'lucide-react'
import Logo from '../components/Logo'
import { services } from '../data'

const contactEmail = '1203229935@qq.com'

export default function Footer({ onPrivacy, onContact }: { onPrivacy: () => void; onContact: (service?: string) => void }) {
  return (
    <footer className="company-footer">
      <div className="company-footer-waves" aria-hidden="true">
        <span className="footer-wave footer-wave-back" />
        <span className="footer-wave footer-wave-mid" />
        <span className="footer-wave footer-wave-front" />
      </div>
      <div className="company-footer-body">
        <div className="company-shell">
          <div className="company-footer-grid">
            <div className="footer-brand">
              <Logo />
              <p className="footer-legal">见衡（深圳）人工智能科技有限公司</p>
              <p className="footer-about">把软件、大模型与企业现有系统连接起来，让 AI 走进真实业务。</p>
              <p className="footer-location"><MapPin size={14} aria-hidden="true" /> 深圳 · 中国</p>
            </div>

            <nav className="footer-nav" aria-label="页脚导航">
              <h2>快速入口</h2>
              <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#scenarios">解决方案</a></li>
                <li><a href="#about">关于见衡</a></li>
                <li><a href="#delivery">项目合作</a></li>
              </ul>
            </nav>

            <div className="footer-services">
              <h2>服务方向</h2>
              <ul>
                {services.map(service => (
                  <li key={service.id}>
                    <button type="button" onClick={() => onContact(service.title)}>
                      <span>{service.title}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-contact">
              <h2>联系我们</h2>
              <dl>
                <div>
                  <dt>项目邮箱</dt>
                  <dd><a href={`mailto:${contactEmail}?subject=${encodeURIComponent('[见衡官网] 项目咨询')}`}>{contactEmail}</a></dd>
                </div>
                <div>
                  <dt>所在城市</dt>
                  <dd>深圳 · 中国</dd>
                </div>
                <div>
                  <dt>合作方式</dt>
                  <dd>需求沟通 · 方案共创 · 交付迭代</dd>
                </div>
              </dl>
              <button type="button" className="company-pill footer-cta" onClick={() => onContact()}>
                <span>发起项目沟通</span><ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="company-footer-bottom">
            <p>Copyright © {new Date().getFullYear()} 见衡科技 JIANHENG 版权所有 All rights reserved.</p>
            <p className="footer-note">以技术，见未来。</p>
            <div><button type="button" onClick={onPrivacy}>隐私说明</button><a href="#home">返回顶部 <ArrowUp size={15} aria-hidden="true" /></a></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
