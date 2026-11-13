import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
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
  const solid = scrolled || menuOpen

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
              className={`nav-category${expanded === item.id ? ' is-expanded' : ''}`}
              onPointerEnter={event => {
                if (event.pointerType !== 'mouse') return
                setExpanded(item.id)
              }}
              onPointerLeave={event => {
                if (event.pointerType === 'mouse') setExpanded(current => current === item.id ? null : current)
              }}
              onBlur={event => {
                if (event.currentTarget.contains(event.relatedTarget)) return
                setExpanded(current => current === item.id ? null : current)
              }}
              onKeyDown={event => {
                if (event.key === 'Escape' && expanded === item.id) {
                  event.stopPropagation()
                  event.currentTarget.querySelector('button')?.focus()
                  setExpanded(null)
                }
              }}
            >
              <a className="nav-category-mobile" href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={navigate}>{item.label}</a>
              <button
                className="nav-category-toggle"
                type="button"
                data-current={active === item.id || undefined}
                aria-haspopup="true"
                aria-expanded={expanded === item.id}
                aria-controls={`nav-${item.id}`}
                onClick={event => {
                  if (event.detail === 0) setExpanded(value => value === item.id ? null : item.id)
                  else setExpanded(item.id)
                }}
              >
                {item.label}<ChevronDown size={14} />
              </button>
              <div
                className="nav-dropdown"
                id={`nav-${item.id}`}
                onPointerEnter={() => setExpanded(item.id)}
                onPointerLeave={event => {
                  if (event.pointerType === 'mouse') setExpanded(current => current === item.id ? null : current)
                }}
              >
                <div className="nav-dropdown-grid">
                  {scenarios.map((scenario, index) => (
                    <a key={scenario.id} href="#scenarios" onClick={() => { onScenario(index); navigate() }}>
                      <span>{scenario.label}</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
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
