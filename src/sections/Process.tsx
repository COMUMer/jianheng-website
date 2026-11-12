import { process } from '../data'

export default function Process() {
  return (
    <section className="section section-soft cooperation" id="cooperation">
      <div className="shell">
        <div className="section-head" data-reveal>
          <span className="eyebrow">合作共创</span>
          <h2>从第一次对话，到下一次生长。</h2>
        </div>

        <ol className="process-grid">
          {process.map((item, index) => (
            <li key={item.number} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
              <span className="process-index">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
