import { ArrowRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { scenarios } from '../data'

type ScenariosProps = {
  selected: number
  onSelect: (index: number) => void
  onContact: (service: string) => void
  paused: boolean
}

const sceneImages: Record<string, string> = {
  knowledge: '/images/shenzhen-ai-center.jpg',
  workflow: '/images/workshop-card.jpg',
  analytics: '/images/analytics-scene.jpg',
  platform: '/images/platform-scene.jpg',
}

const rotationDelay = 6000
const rippleDuration = 880

export default function Scenarios({ selected, onSelect, onContact, paused }: ScenariosProps) {
  const scenario = scenarios[selected]
  const nextIndex = (selected + 1) % scenarios.length
  const nextScenario = scenarios[nextIndex]
  const sectionRef = useRef<HTMLElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)
  const lastSlide = useRef(selected)
  const [inView, setInView] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= .45), { threshold: .45 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused || userPaused || hovering || focused) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: number | undefined
    function schedule() {
      window.clearTimeout(timer)
      if (!document.hidden && !motion.matches) {
        timer = window.setTimeout(() => onSelect(nextIndex), rotationDelay)
      }
    }

    schedule()
    document.addEventListener('visibilitychange', schedule)
    motion.addEventListener('change', schedule)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
      motion.removeEventListener('change', schedule)
    }
  }, [focused, hovering, inView, nextIndex, onSelect, paused, userPaused])

  useEffect(() => {
    if (lastSlide.current === selected) return
    lastSlide.current = selected

    const photo = sectionRef.current?.querySelector('.scenario-photo.is-current')
    const displacement = displacementRef.current
    if (!photo || !displacement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const start = performance.now()
    photo.classList.add('is-rippling')
    let frame = window.requestAnimationFrame(animate)

    function animate(now: number) {
      const progress = Math.min((now - start) / rippleDuration, 1)
      displacement?.setAttribute('scale', (Math.sin(Math.PI * progress) * (1 - progress) * 76).toFixed(1))
      if (progress < 1) frame = window.requestAnimationFrame(animate)
      else photo?.classList.remove('is-rippling')
    }

    return () => {
      window.cancelAnimationFrame(frame)
      photo.classList.remove('is-rippling')
      displacement.setAttribute('scale', '0')
    }
  }, [selected])

  function choose(index: number) {
    setUserPaused(true)
    onSelect(index)
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = scenarios.length - 1
    else if (event.key === 'ArrowRight') next = (index + 1) % scenarios.length
    else if (event.key === 'ArrowLeft') next = (index + scenarios.length - 1) % scenarios.length
    else return
    event.preventDefault()
    choose(next)
    document.getElementById(`solution-tab-${scenarios[next].id}`)?.focus()
  }

  return (
    <section
      className="scenario-showcase"
      id="scenarios"
      data-reveal-trigger
      aria-labelledby="solutions-heading"
      ref={sectionRef}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovering(true) }}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    >
      <div className="scenario-stage" data-reveal="wipe">
        <svg className="scenario-filter" width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="scenario-water" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency=".009 .021" numOctaves="1" seed="11" result="ripple" />
              <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="ripple" scale="0" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className="scenario-background" aria-hidden="true">
          {scenarios.map((item, index) => (
            <img
              key={item.id}
              className={`scenario-photo scenario-photo--${item.id}${index === selected ? ' is-current' : ''}`}
              src={sceneImages[item.id]}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        <div className="company-shell scenario-content">
          <div className="scenario-head">
            <div className="company-heading company-heading-light">
              <p>解决方案</p>
              <h2 id="solutions-heading">软件与 AI 的企业应用</h2>
            </div>
            <button className="company-pill company-pill-light" type="button" onClick={() => onContact(scenario.service)}>
              <span>咨询此方案</span><ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="scenario-bottom">
            <div className="scenario-caption" role="tabpanel" id="solution-panel" aria-labelledby={`solution-tab-${scenario.id}`} tabIndex={0}>
              <div key={scenario.id} className="scenario-caption-copy">
                <h3>{scenario.label}</h3>
                <p>{scenario.description}</p>
              </div>
            </div>

            <div className="scenario-controls">
              <div className="scenario-pagination">
                <div className="scenario-dots" role="tablist" aria-label="选择解决方案">
                  {scenarios.map((item, index) => (
                    <button
                      key={item.id}
                      id={`solution-tab-${item.id}`}
                      type="button"
                      role="tab"
                      title={item.label}
                      aria-label={item.label}
                      aria-controls="solution-panel"
                      aria-selected={index === selected}
                      tabIndex={index === selected ? 0 : -1}
                      onClick={() => choose(index)}
                      onKeyDown={event => handleTabKey(event, index)}
                    />
                  ))}
                </div>
                <button
                  className="scenario-autoplay"
                  type="button"
                  aria-label={userPaused ? '播放轮播' : '暂停轮播'}
                  title={userPaused ? '播放轮播' : '暂停轮播'}
                  onClick={() => setUserPaused(value => !value)}
                >
                  {userPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                </button>
              </div>

              <button className="scenario-next" type="button" onClick={() => choose(nextIndex)} aria-label={`下一项方案：${nextScenario.label}`}>
                <span className="scenario-preview" key={nextScenario.id}>
                  <img src={sceneImages[nextScenario.id]} alt="" loading="lazy" decoding="async" />
                  <span>{nextScenario.label}</span>
                </span>
                <span className="scenario-next-arrow">NEXT <ArrowRight size={19} aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
