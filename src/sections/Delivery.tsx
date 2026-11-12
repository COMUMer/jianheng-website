import { consultingService, process } from '../data'

const routeStops = [11.6, 37.2, 62.8, 88.4]

export default function Delivery({ onContact }: { onContact: (service: string) => void }) {
  function consult() {
    onContact(consultingService.title)
  }

  return (
    <section className="company-delivery" id="delivery" aria-labelledby="delivery-heading">
      <div className="company-shell">
        <div className="delivery-head" data-reveal="up">
          <div className="delivery-title">
            <h2 id="delivery-heading">从需求到上线</h2>
            <p>从第一次沟通开始，把业务想法一步步推进到稳定运行的产品。</p>
          </div>
          <button className="company-pill company-pill-solid delivery-cta" type="button" onClick={consult}>
            沟通项目
          </button>
        </div>

        <figure className="delivery-panorama" data-reveal="route">
          <img src="/images/bridge-hero.jpg" alt="深圳湾大桥横跨海湾" loading="lazy" decoding="async" />
          <span className="delivery-route" aria-hidden="true">
            <span className="delivery-route-line" />
            {routeStops.map((stop, index) => (
              <span
                key={stop}
                className="delivery-route-stop"
                style={{ left: `${stop}%`, transitionDelay: `${0.2 + index * 0.37}s` }}
              />
            ))}
          </span>
          <figcaption>深圳湾大桥</figcaption>
        </figure>

        <ol className="delivery-steps">
          {process.map(step => (
            <li key={step.title} data-reveal="up">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
