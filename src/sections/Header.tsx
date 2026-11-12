import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { RefObject } from 'react'
import Logo from '../components/Logo'
import { navigation, scenarios } from '../data'

type HeaderProps = {
  active: string
  menuOpen: boolean
  scrolled: boolean
  menuButtonRef: RefObject<HTMLButtonElement | null>
  onToggleMenu: () => void
  onNavigate: () => void
  onContact: () => void
  onScenario: (index: number) => void
}

export default function Header({ active, menuOpen, scrolled, menuButtonRef, onToggleMenu, onNavigate, onContact, onScenario }: HeaderProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const solid = scrolled || menuOpen || expanded !== null

  function navigate() {
    setExpanded(null)
    onNavigate()
  }

  return (
    <header className={`site-header district-header${solid ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="shell header-inner">
        <Logo onClick={navigate} />

        <nav id="site-nav" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="主导航">
          {navigation.map(item => {
            if (item.id !== 'scenarios') {
              return <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={navigate}>{item.label}</a>
            }
            return <div
              key={item.id}
              className="nav-category"
              onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(current => current === item.id ? null : current) }}
              onKeyDown={event => {
                if (event.key === 'Escape' && expanded === item.id) {
                  event.stopPropagation()
                  event.currentTarget.querySelector('button')?.focus()
                  setExpanded(null)
                }
              }}
            >
              <a className="nav-category-mobile" href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={navigate}>{item.label}</a>
              <button className="nav-category-toggle" type="button" data-current={active === item.id || undefined} aria-expanded={expanded === item.id} aria-controls={`nav-${item.id}`} onClick={() => setExpanded(value => value === item.id ? null : item.id)}>
                {item.label}<ChevronDown size={14} />
              </button>
              <div className="nav-dropdown" id={`nav-${item.id}`} hidden={expanded !== item.id}>
                <div className="nav-dropdown-top"><strong>{item.label}</strong><a href={`#${item.id}`} onClick={navigate}>查看全部 <ArrowRight size={13} /></a></div>
                {scenarios.map((scenario, index) => <a key={scenario.id} href="#scenarios" onClick={() => { onScenario(index); navigate() }}>
                  <span><strong>{scenario.label}</strong><small>{scenario.category}</small></span><ArrowUpRight size={16} />
                </a>)}
              </div>
            </div>
          })}
          <button className="button button-primary nav-cta" type="button" onClick={onContact}>
            咨询方案
            <ArrowUpRight size={16} />
          </button>
          <span className="nav-meta">深圳 · 中国</span>
        </nav>

        <div className="header-actions">
          <button className="button button-primary header-cta" type="button" onClick={() => { setExpanded(null); onContact() }}>
            咨询方案
            <ArrowUpRight size={16} />
          </button>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? '关闭导航' : '打开导航'}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => { setExpanded(null); onToggleMenu() }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
