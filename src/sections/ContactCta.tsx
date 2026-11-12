import { ArrowUpRight } from 'lucide-react'

type ContactCtaProps = {
  onContact: () => void
}

export default function ContactCta({ onContact }: ContactCtaProps) {
  return (
    <section className="cta">
      <div className="shell cta-inner" data-reveal>
        <div>
          <span className="eyebrow eyebrow-light">开始合作</span>
          <h2>
            把你的想法，
            <br />
            变成我们的下一步。
          </h2>
          <p>一个初步的想法，或一个明确的挑战，都值得认真聊聊。</p>
        </div>
        <button className="button button-light button-large" type="button" onClick={onContact}>
          与见衡对话
          <ArrowUpRight size={18} />
        </button>
      </div>
    </section>
  )
}
