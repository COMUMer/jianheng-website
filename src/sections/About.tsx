import { ArrowRight, BrainCircuit, CodeXml, Network, PanelsTopLeft } from 'lucide-react'
import { services } from '../data'

const serviceIcons = [CodeXml, BrainCircuit, Network, PanelsTopLeft]

export default function About({ onContact }: { onContact: (service: string) => void }) {
  return (
    <section className="company-overview" id="about" aria-labelledby="about-heading">
      <div className="company-shell">
        <div className="company-intro" data-reveal="up">
          <div className="company-heading">
            <p>关于见衡</p>
            <h2 id="about-heading">让软件与 AI 走进企业日常</h2>
          </div>
          <div className="company-intro-copy">
            <p>见衡（深圳）人工智能科技公司，专注于定制软件开发、AI 应用开发和企业数字化。我们把软件、大模型和企业现有系统连接起来，解决知识检索、流程协作和数据分析中的具体问题。</p>
            <a className="company-pill" href="#delivery">
              <span>了解合作流程</span><ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="company-services">
          {services.map((service, index) => {
            const Icon = serviceIcons[index]
            return (
              <li key={service.id} data-reveal="up">
                <button type="button" onClick={() => onContact(service.title)}>
                  <span className="company-service-icon"><Icon size={42} strokeWidth={1.4} aria-hidden="true" /></span>
                  <strong>{service.title}</strong>
                  <span>{service.tags.slice(0, 2).join(' · ')}</span>
                  <ArrowRight className="company-service-arrow" size={19} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
