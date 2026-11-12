import { ArrowUpRight } from 'lucide-react'
import { consultingService, services } from '../data'

type ServicesProps = {
  onContact: (service?: string) => void
}

export default function Services({ onContact }: ServicesProps) {
  const cards = services.filter(service => service.id !== 'consulting')

  return (
    <section className="section section-soft services" id="services">
      <div className="shell">
        <div className="section-head section-head-row" data-reveal>
          <div>
            <span className="eyebrow">技术服务</span>
            <h2>从构想到交付的技术服务</h2>
          </div>
          <p className="section-note">覆盖软件开发、AI 应用、系统集成与持续迭代。</p>
        </div>

        <div className="service-grid">
          {cards.map((service, index) => (
            <div className="service-item" key={service.id} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
              <article className="service-card" id={`service-${service.id}`}>
                <div className="service-media">
                  {service.image ? <img src={service.image} alt="" loading="lazy" decoding="async" /> : null}
                </div>
                <div className="service-body">
                  <span className="service-index">{service.index}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-tags">
                    {service.tags.map(tag => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <button className="text-link" type="button" onClick={() => onContact(service.title)}>
                    交流项目需求
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="consulting-row" id="service-consulting" data-reveal>
          <div>
            <h3>好的开始，来自清晰的技术方向。</h3>
            <p>产品规划、技术架构与持续迭代，一起找到适合你的路径。</p>
          </div>
          <button className="text-link" type="button" onClick={() => onContact(consultingService.title)}>
            技术咨询与共创
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
