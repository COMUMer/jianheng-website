import { useEffect, useRef, useState } from 'react'
import ContactDialog from './components/ContactDialog'
import type { ModalView } from './components/ContactDialog'
import { defaultService, navigation } from './data'
import Header from './sections/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Scenarios from './sections/Scenarios'
import Delivery from './sections/Delivery'
import Footer from './sections/Footer'

function App() {
  const [scenario, setScenario] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [modal, setModal] = useState<ModalView>(null)
  const [initialService, setInitialService] = useState(defaultService)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    let lastDrift = -1
    const stage = document.querySelector<HTMLElement>('.district-stage')
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    function updatePosition() {
      setScrolled(window.scrollY > 8)
      let current = 'home'
      let nearest = Number.NEGATIVE_INFINITY
      const readingLine = Math.min(180, window.innerHeight * 0.28)
      for (const item of navigation) {
        const top = document.getElementById(item.id)?.getBoundingClientRect().top
        if (top !== undefined && top <= readingLine && top > nearest) {
          current = item.id
          nearest = top
        }
      }
      setActive(current)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
      if (stage) {
        const { top, height } = stage.getBoundingClientRect()
        // Keep the map and its interactive hotspots on one moving layer.
        const drift = motionPreference.matches ? 0 : Math.min(Math.max(0, -top) * .23, height * .23)
        if (drift !== lastDrift) {
          stage.style.setProperty('--scene-drift', `${drift.toFixed(1)}px`)
          lastDrift = drift
        }
      }
      frame = 0
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updatePosition)
    }

    updatePosition()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', scheduleUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    const main = document.querySelector<HTMLElement>('main')
    const footer = document.querySelector<HTMLElement>('footer')
    document.body.style.overflow = 'hidden'
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    document.querySelector<HTMLElement>('.site-nav.is-open a, .site-nav.is-open button')?.focus()

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    function handleResize() {
      if (window.innerWidth > 900) setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.body.style.overflow = previousOverflow
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('resize', handleResize)
      menuButtonRef.current?.focus()
    }
  }, [menuOpen])

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-inview'))
      return
    }
    const inset = Math.min(window.innerWidth >= 1000 ? 100 : 50, Math.round(window.innerHeight * .18))
    // The reveal mask clips the stage, so observe its unclipped wrapper.
    const targets = new Map<Element, HTMLElement>()
    for (const node of nodes) {
      const wrapper = node.parentElement?.closest('[data-reveal-trigger]')
      targets.set(wrapper ?? node, node)
    }
    // Enter with a reading inset; reset only once the element is fully offscreen,
    // so scrolling back up replays the reveal instead of leaving it spent.
    const enterObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) targets.get(entry.target)?.classList.add('is-inview')
        }
      },
      { rootMargin: `0px 0px -${inset}px 0px`, threshold: 0.08 },
    )
    const exitObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) targets.get(entry.target)?.classList.remove('is-inview')
        }
      },
      { threshold: 0 },
    )
    targets.forEach((_, target) => {
      enterObserver.observe(target)
      exitObserver.observe(target)
    })
    return () => {
      enterObserver.disconnect()
      exitObserver.disconnect()
    }
  }, [])

  function openContact(service = defaultService) {
    setInitialService(service)
    setModal('contact')
    setMenuOpen(false)
  }

  return (
    <>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <a className="skip-link" href="#main">
        跳转到主要内容
      </a>

      <Header
        active={active}
        menuOpen={menuOpen}
        scrolled={scrolled}
        menuButtonRef={menuButtonRef}
        onToggleMenu={() => setMenuOpen(value => !value)}
        onNavigate={() => setMenuOpen(false)}
        onContact={() => openContact()}
        onScenario={setScenario}
      />

      <main id="main" tabIndex={-1}>
        <Hero selected={scenario} onSelect={setScenario} />
        <About onContact={openContact} />
        <Scenarios selected={scenario} onSelect={setScenario} onContact={openContact} paused={modal !== null || menuOpen} />
        <Delivery onContact={openContact} />
      </main>

      <Footer onPrivacy={() => setModal('privacy')} onContact={() => openContact()} />

      <ContactDialog view={modal} initialService={initialService} onClose={() => setModal(null)} />
    </>
  )
}

export default App
