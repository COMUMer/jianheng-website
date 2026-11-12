import { Check } from 'lucide-react'

export default function CodeCard() {
  return (
    <div className="code-card">
      <div className="code-bar">
        <span className="code-prompt" aria-hidden="true">{'>_'}</span>
        <span>BUILT WITH PURPOSE</span>
        <span className="code-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <pre className="code-body"><code><span className="c-key">const</span> future = <span className="c-fn">create</span>({'{'}{'\n'}  vision: <span className="c-str">'your idea'</span>,{'\n'}  power: <span className="c-str">'AI + engineering'</span>{'\n'}{'}'});</code></pre>
      <div className="code-foot">
        <span>
          <Check size={12} />
          Ready for what’s next
        </span>
        <i className="code-status" aria-hidden="true" />
      </div>
    </div>
  )
}
