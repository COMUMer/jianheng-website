import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { AlertCircle, X, Check, Copy, Download, ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { services } from '../data'

export type ModalView = 'contact' | 'privacy' | null

type Draft = { name: string; company: string; contact: string; description: string }
type Errors = Partial<Record<keyof Draft, string>>
type Web3FormsResponse = { success?: boolean; message?: string }

const emptyDraft: Draft = { name: '', company: '', contact: '', description: '' }
const fallbackEmail = '1203229935@qq.com'
const web3FormsEndpoint = 'https://api.web3forms.com/submit'
const web3FormsCaptchaKey = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'
const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/

function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export default function ContactDialog({ view, initialService, onClose }: { view: ModalView; initialService: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const sentRef = useRef<HTMLHeadingElement>(null)
  const sendErrorRef = useRef<HTMLDivElement>(null)
  const captchaRef = useRef<HCaptcha>(null)
  const captchaBlockRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<AbortController | null>(null)
  const sendingRef = useRef(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [errors, setErrors] = useState<Errors>({})
  const [service, setService] = useState(initialService)
  const [brief, setBrief] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [botField, setBotField] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !view) return
    requestRef.current?.abort()
    requestRef.current = null
    sendingRef.current = false
    setService(initialService)
    setDraft(emptyDraft)
    setErrors({})
    setBrief('')
    setCopied(false)
    setCopyError(false)
    setShowPrivacy(false)
    setSending(false)
    setSent(false)
    setSendError('')
    setConsent(false)
    setConsentError('')
    setBotField('')
    setCaptchaToken('')
    setCaptchaError('')
    const dialogEl = dialog
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const inertTargets = Array.from(document.querySelectorAll<HTMLElement>('.site-header, main, footer, .skip-link'))
    inertTargets.forEach(target => target.setAttribute('inert', ''))
    if (!dialogEl.open) dialogEl.show()
    window.requestAnimationFrame(() => dialogEl.querySelector<HTMLElement>('#dialog-title')?.focus())
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = Array.from(dialogEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
      )).filter(element => element.getClientRects().length > 0)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogEl)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      inertTargets.forEach(target => target.removeAttribute('inert'))
      requestRef.current?.abort()
      document.body.style.overflow = previousOverflow
      if (dialogEl.open) dialogEl.close()
      opener?.focus()
    }
  }, [view, initialService])

  useEffect(() => {
    if (view === 'contact' && brief && !sent) resultRef.current?.focus()
  }, [brief, sent, view])

  useEffect(() => {
    if (view === 'contact' && sent) sentRef.current?.focus()
  }, [sent, view])

  useEffect(() => {
    if (showPrivacy) dialogRef.current?.querySelector<HTMLElement>('#dialog-title')?.focus()
  }, [showPrivacy])

  function closePrivacy() {
    setShowPrivacy(false)
    window.requestAnimationFrame(() => (brief && !sent ? consentRef.current : nameRef.current)?.focus())
  }

  function resetCaptcha() {
    setCaptchaToken('')
    setCaptchaError('')
    captchaRef.current?.resetCaptcha()
  }

  function openPrivacy() {
    resetCaptcha()
    setShowPrivacy(true)
  }

  function updateField<K extends keyof Draft>(key: K, value: string) {
    setDraft(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: undefined }))
    setSendError('')
  }

  function generateBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Errors = {}
    if (!draft.name.trim()) nextErrors.name = '请填写你的称呼。'
    if (draft.contact.trim().length < 5) nextErrors.contact = '请填写有效的联系方式，至少 5 个字符。'
    if (draft.description.trim().length < 10) nextErrors.description = '请简要描述需求，至少 10 个字符。'
    setErrors(nextErrors)

    const firstInvalid = (['name', 'contact', 'description'] as const).find(key => nextErrors[key])
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    const company = draft.company.trim() || '暂未填写'
    setBrief(
      `见衡科技 · 项目需求简报\n\n意向服务：${service}\n称呼：${draft.name.trim()}\n公司 / 团队：${company}\n联系方式：${draft.contact.trim()}\n\n项目需求：\n${draft.description.trim()}\n\n此简报由见衡官网生成。`,
    )
    setSent(false)
    setSendError('')
    setConsent(false)
    setConsentError('')
    setCaptchaToken('')
    setCaptchaError('')
  }

  function editBrief() {
    setBrief('')
    setSent(false)
    setSendError('')
    setConsent(false)
    setConsentError('')
    setCaptchaToken('')
    setCaptchaError('')
    setCopied(false)
    setCopyError(false)
    window.requestAnimationFrame(() => nameRef.current?.focus())
  }

  function startAnother() {
    setDraft(emptyDraft)
    setService(initialService)
    setErrors({})
    setBrief('')
    setCopied(false)
    setCopyError(false)
    setSent(false)
    setSending(false)
    setSendError('')
    setConsent(false)
    setConsentError('')
    setBotField('')
    setCaptchaToken('')
    setCaptchaError('')
    sendingRef.current = false
    window.requestAnimationFrame(() => nameRef.current?.focus())
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + brief], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = '见衡科技-项目需求简报.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function mailtoLink() {
    const subject = singleLine(`[见衡官网] 项目咨询 · ${service} · ${draft.name.trim()}`)
    return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`
  }

  async function sendBrief() {
    if (sendingRef.current || sent) return
    if (!consent) {
      setConsentError('请先阅读并同意隐私说明。')
      window.requestAnimationFrame(() => consentRef.current?.focus())
      return
    }
    setConsentError('')
    setSendError('')

    if (!captchaToken) {
      setCaptchaError('请先完成人机验证。')
      window.requestAnimationFrame(() => captchaBlockRef.current?.focus())
      return
    }
    setCaptchaError('')

    const accessKey = (import.meta.env.VITE_WEB3FORMS_KEY ?? '').trim()
    if (!accessKey) {
      setSendError('发送服务尚未配置，请稍后重试。')
      window.requestAnimationFrame(() => sendErrorRef.current?.focus())
      return
    }

    const contact = draft.contact.trim()
    const email = contact.match(emailPattern)?.[0] ?? ''
    const subject = singleLine(`[见衡官网] 项目咨询 · ${service} · ${draft.name.trim()}`).slice(0, 120)
    const payload = {
      access_key: accessKey,
      subject,
      from_name: '见衡官网',
      name: draft.name.trim(),
      company: draft.company.trim() || '未填写',
      contact,
      service,
      message: draft.description.trim(),
      page: window.location.origin,
      consent: 'yes',
      submitted_at: new Date().toISOString(),
      botcheck: botField,
      'h-captcha-response': captchaToken,
      ...(email ? { email } : {}),
    }

    const controller = new AbortController()
    requestRef.current = controller
    sendingRef.current = true
    setSending(true)
    const timeout = window.setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(web3FormsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      const data = (await response.json().catch(() => null)) as Web3FormsResponse | null
      if (!response.ok || !data?.success) throw new Error(data?.message || 'Web3Forms request failed')
      setSent(true)
      setSendError('')
    } catch {
      setSendError(controller.signal.aborted ? '发送超时，请检查网络后重试。' : '请检查网络后重试。')
      resetCaptcha()
      window.requestAnimationFrame(() => sendErrorRef.current?.focus())
    } finally {
      window.clearTimeout(timeout)
      requestRef.current = null
      sendingRef.current = false
      setSending(false)
    }
  }

  const privacyView = view === 'privacy' || showPrivacy
  const mailtoHref = mailtoLink()

  return (
    <>
      {view && <div className="dialog-backdrop" onClick={onClose} aria-hidden="true" />}
      <dialog
        ref={dialogRef}
        className="contact-dialog"
        onCancel={onClose}
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="dialog-inner">
          <button className="dialog-close" type="button" onClick={onClose} aria-label="关闭弹窗">
            <X size={20} />
          </button>

        {privacyView ? (
          <div className="privacy-content">
            <span className="eyebrow">隐私说明</span>
            <h2 id="dialog-title" tabIndex={-1}>隐私说明</h2>
            <p>本网站为见衡科技的企业介绍页面。</p>
            <h3>关于项目需求表单</h3>
            <p>你填写的称呼、公司、联系方式和需求描述，会在你点击“发送给见衡”后，通过第三方表单服务 Web3Forms 发送到见衡的项目邮箱（{fallbackEmail}），用于回复你的咨询。提交前会请你确认同意。</p>
            <h3>关于第三方服务</h3>
            <p>表单提交由 Web3Forms 处理，人机验证由 hCaptcha 提供；提交记录可能保存在其服务器上，并可能涉及境外处理。具体保留时间和处理方式以 <a href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">Web3Forms 隐私政策</a>及 hCaptcha 的隐私政策为准。我们不会将信息用于营销或出售。</p>
            <h3>关于复制与下载</h3>
            <p>复制或下载由你主动发起，生成的内容由你自行保存与分享。关闭或刷新页面后，未导出的简报将无法恢复。</p>
            <h3>关于访问</h3>
            <p>本页面未接入第三方分析、广告追踪或 Cookie 服务。除表单提交外，不会主动向第三方发送你的信息。</p>
            <p>如需查询或删除提交的信息，请联系 {fallbackEmail}。</p>
            {showPrivacy && (
              <button className="text-button" type="button" onClick={closePrivacy}>
                返回项目咨询
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        ) : sent ? (
          <div className="brief-result brief-success">
            <span className="result-icon">
              <Check size={24} />
            </span>
            <span className="eyebrow">已发送</span>
            <h2 id="dialog-title" ref={sentRef} tabIndex={-1}>
              需求已发送。
            </h2>
            <p>我们已收到你的项目需求，会通过你留下的联系方式回复。</p>
            <p className="form-note">
              <ShieldCheck size={15} />
              已提交到见衡项目邮箱；如需留存，可以下载简报。
            </p>
            <div className="result-actions">
              <button className="button button-outline" type="button" onClick={downloadBrief}>
                <Download size={16} />
                下载简报
              </button>
              <button className="button button-primary" type="button" onClick={onClose}>
                关闭
              </button>
            </div>
            <button className="text-button" type="button" onClick={startAnother}>
              再写一条
              <ArrowRight size={15} />
            </button>
          </div>
        ) : brief ? (
          <div className="brief-result">
            <span className="result-icon">
              <Check size={24} />
            </span>
            <span className="eyebrow">需求已整理</span>
            <h2 id="dialog-title" ref={resultRef} tabIndex={-1}>
              想法，已整理成形。
            </h2>
            <p>确认后发送给见衡；也可以复制或下载留存。</p>
            <pre tabIndex={0}>{brief}</pre>
            <p className="form-note">
              <ShieldCheck size={15} />
              尚未发送。发送后会提交到见衡项目邮箱。
            </p>

            <div className="consent-field">
              <input
                ref={consentRef}
                id="inquiry-consent"
                type="checkbox"
                checked={consent}
                onChange={event => {
                  setConsent(event.target.checked)
                  setConsentError('')
                }}
                required
                aria-invalid={Boolean(consentError)}
                aria-describedby={consentError ? 'consent-error' : undefined}
              />
              <div className="consent-copy">
                <label htmlFor="inquiry-consent">我同意见衡通过上述联系方式与我联系。</label>
                <span>
                  我已阅读并同意
                  <button className="note-link" type="button" onClick={openPrivacy}>
                    隐私说明
                  </button>
                  。
                </span>
              </div>
            </div>
            {consentError && (
              <small className="field-error" id="consent-error">
                {consentError}
              </small>
            )}

            <div className="captcha-block" ref={captchaBlockRef} tabIndex={-1} role="group" aria-label="人机验证">
              <HCaptcha
                ref={captchaRef}
                sitekey={web3FormsCaptchaKey}
                reCaptchaCompat={false}
                theme="light"
                onVerify={token => {
                  setCaptchaToken(token)
                  setCaptchaError('')
                }}
                onExpire={() => {
                  setCaptchaToken('')
                  setCaptchaError('验证码已过期，请重新验证。')
                }}
                onError={() => {
                  setCaptchaToken('')
                  setCaptchaError(`验证码加载失败，请刷新页面，或复制简报发送到 ${fallbackEmail}。`)
                }}
              />
              {captchaError ? (
                <small className="field-error" role="alert">
                  {captchaError}
                </small>
              ) : (
                <small className="captcha-hint">请先完成人机验证，再发送。</small>
              )}
            </div>

            {sendError && (
              <div className="form-alert" role="alert" tabIndex={-1} ref={sendErrorRef}>
                <AlertCircle size={16} aria-hidden="true" />
                <p>
                  <strong>发送没有成功。</strong> {sendError} 也可以直接发邮件到{' '}
                  <a href={mailtoHref}>{fallbackEmail}</a>。
                </p>
              </div>
            )}

            <button className="button button-primary form-submit" type="button" onClick={sendBrief} disabled={sending} aria-busy={sending}>
              {sending ? '正在发送…' : '发送给见衡'}
              {!sending && <ArrowUpRight size={17} aria-hidden="true" />}
            </button>
            <p className="send-status" role="status" aria-live="polite">
              {sending ? '正在提交，请稍候。' : ''}
            </p>

            <div className="result-actions">
              <button className="button button-outline" type="button" onClick={copyBrief}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已复制简报' : '复制简报'}
              </button>
              <button className="button button-outline" type="button" onClick={downloadBrief}>
                <Download size={16} />
                下载简报
              </button>
            </div>
            <p className="copy-status" role="status">
              {copyError ? '浏览器未允许复制，请点击“下载简报”保存，或选中上方文本手动复制。' : copied ? '已复制到剪贴板。' : ''}
            </p>
            <button className="text-button" type="button" onClick={editBrief}>
              返回修改
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">项目咨询</span>
            <h2 id="dialog-title" tabIndex={-1}>从你的想法开始。</h2>
            <p className="dialog-intro">告诉我们你想解决的问题。整理后可以预览，再发送给见衡。</p>

            <form onSubmit={generateBrief} noValidate>
              <input
                className="hp-field"
                type="text"
                name="botcheck"
                value={botField}
                onChange={event => setBotField(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <fieldset className="service-options">
                <legend>你希望了解的服务</legend>
                <div>
                  {services.map(item => (
                    <button
                      className={service === item.title ? 'selected' : ''}
                      key={item.title}
                      type="button"
                      aria-pressed={service === item.title}
                      onClick={() => setService(item.title)}
                    >
                      {item.title}
                      {service === item.title && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="form-row">
                <label className="form-field">
                  <span>
                    你的称呼 <em>*</em>
                  </span>
                  <input
                    ref={nameRef}
                    id="field-name"
                    value={draft.name}
                    onChange={event => updateField('name', event.target.value)}
                    placeholder="怎么称呼你"
                    maxLength={40}
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'error-name' : undefined}
                  />
                  {errors.name && (
                    <small className="field-error" id="error-name">
                      {errors.name}
                    </small>
                  )}
                </label>
                <label className="form-field">
                  <span>公司 / 团队</span>
                  <input
                    id="field-company"
                    value={draft.company}
                    onChange={event => updateField('company', event.target.value)}
                    placeholder="公司或团队名称（选填）"
                    maxLength={100}
                    autoComplete="organization"
                  />
                </label>
              </div>

              <label className="form-field">
                <span>
                  联系方式 <em>*</em>
                </span>
                <input
                  id="field-contact"
                  value={draft.contact}
                  onChange={event => updateField('contact', event.target.value)}
                  placeholder="邮箱、手机或微信"
                  maxLength={100}
                  required
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? 'error-contact' : undefined}
                />
                {errors.contact && (
                  <small className="field-error" id="error-contact">
                    {errors.contact}
                  </small>
                )}
              </label>

              <label className="form-field">
                <span>
                  聊聊你的需求 <em>*</em>
                </span>
                <textarea
                  id="field-description"
                  value={draft.description}
                  onChange={event => updateField('description', event.target.value)}
                  placeholder="例如：希望为团队搭建一个能检索内部文档的 AI 知识助手……"
                  rows={4}
                  maxLength={3000}
                  required
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? 'error-description' : undefined}
                />
                {errors.description && (
                  <small className="field-error" id="error-description">
                    {errors.description}
                  </small>
                )}
              </label>

              <p className="form-note">
                <ShieldCheck size={15} />
                信息仅用于回复你的咨询。下一步会先生成简报，再由你确认发送。
                <button className="note-link" type="button" onClick={openPrivacy}>
                  隐私说明
                </button>
              </p>

              <button className="button button-primary form-submit" type="submit">
                整理项目需求
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </form>
          </>
        )}
      </div>
      </dialog>
    </>
  )
}
