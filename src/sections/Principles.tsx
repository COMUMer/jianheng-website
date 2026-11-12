import { principles } from '../data'

export default function Principles() {
  return (
    <section className="section principles" id="philosophy">
      <div className="shell principles-grid">
        <div className="principles-head" data-reveal>
          <span className="eyebrow">见衡的坚持</span>
          <h2>
            看得更远，
            <br />
            也脚踏实地。
          </h2>
          <p>
            “见”，是看见需求，也看见可能。
            <br />
            “衡”，是衡量价值，也把握分寸。
          </p>
          <span className="motto">见微知著 · 衡以致远</span>
        </div>

        <div className="principle-list">
          {principles.map((item, index) => (
            <article className="principle-row" key={item.word} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
              <span className="principle-index">{item.number}</span>
              <div>
                <h3>
                  {item.word}
                  <span>{item.title}</span>
                </h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
