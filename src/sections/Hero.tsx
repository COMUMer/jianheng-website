import { ArrowDown, ArrowUpRight, ChartNoAxesCombined, Database, LayoutDashboard, Workflow, X } from 'lucide-react'
import { useState } from 'react'
import { scenarios } from '../data'

export const scenarioIcons = [Database, Workflow, ChartNoAxesCombined, LayoutDashboard]

// Percentages on the original scene image, so the pins follow the cover crop.
const pins = [
  { left: '23.5%', top: '34%' },
  { left: '39%', top: '48.5%' },
  { left: '66.5%', top: '36.5%' },
  { left: '80%', top: '58%' },
]

type HeroProps = {
  selected: number
  onSelect: (index: number) => void
}

export default function Hero({ selected, onSelect }: HeroProps) {
  const current = scenarios[selected]
  const [showCard, setShowCard] = useState(false)

  function select(index: number) {
    onSelect(index)
    setShowCard(true)
  }

  return (
    <section className="district-hero" id="home" aria-labelledby="home-heading" onKeyDown={event => {
      if (event.key === 'Escape' && showCard) {
        setShowCard(false)
        document.getElementById(`map-point-${current.id}`)?.focus()
      }
    }}>
      <h1 id="home-heading" className="scene-sr-only">见衡科技 · 企业数字化与 AI 解决方案</h1>
      <div className="district-stage">
        <div className="district-map">
          <img className="district-illustration" src="/images/business-district-hero.jpg" alt="数字业务园区场景示意" fetchPriority="high" />
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              id={`map-point-${scenario.id}`}
              className={`district-point${showCard && index === selected ? ' is-selected' : ''}`}
              type="button"
              style={pins[index]}
              aria-label={`地图热点：${scenario.label}`}
              aria-pressed={showCard && selected === index}
              onClick={() => select(index)}
            >
              <span className="district-point-pin" aria-hidden="true" />
              <span className="district-point-label" aria-hidden="true">{scenario.label}</span>
            </button>
          ))}
        </div>
        <div className="district-top-shade" aria-hidden="true" />

        {showCard && <div className="district-map-card" aria-live="polite">
          <button type="button" className="map-card-close" aria-label="关闭场景介绍" onClick={() => {
            setShowCard(false)
            document.getElementById(`map-point-${current.id}`)?.focus()
          }}><X size={18} /></button>
          <div><small>{current.category}</small><strong>{current.label}</strong></div>
          <a href="#scenarios" onClick={() => setShowCard(false)}>查看方案 <ArrowUpRight size={17} /></a>
        </div>}

        <a className="district-scroll" href="#about" aria-label="向下浏览关于见衡"><ArrowDown size={17} /></a>
        <span className="district-attribution">见衡数字业务园区 · 场景示意</span>
      </div>
      <div className="district-mobile-links" aria-label="选择地图场景">
        {scenarios.map((scenario, index) => {
          const Icon = scenarioIcons[index]
          return <a href="#scenarios" key={scenario.id} onClick={() => onSelect(index)}><Icon size={16} />{scenario.label}</a>
        })}
      </div>
    </section>
  )
}
