import { useId, useLayoutEffect, useRef } from 'react'
import type { PortfolioContactDraft, PortfolioViewProps } from '../../types'
import { validateContactDraft, visibleContactErrors } from '../../lib/contactValidation'
import { Icon } from '../Icon'
import '../../styles/contact.css'

export function contactDraftMailto(email: string, draft: PortfolioContactDraft, vietnamese: boolean) {
  const name = draft.name.trim().replace(/[\r\n]+/g, ' ')
  const subject = `${vietnamese ? 'Trao đổi dự án' : 'Project brief'} — ${name}`
  const body = [
    `${vietnamese ? 'Họ tên' : 'Name'}: ${draft.name.trim()}`,
    `Email: ${draft.email.trim()}`,
    `${vietnamese ? 'Địa điểm' : 'Location'}: ${draft.location.trim()}`,
    '', draft.message.trim(),
  ].join('\r\n')
  return `mailto:${encodeURIComponent(email).replace(/%40/g, '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactView({ data, contactDraft, onContactDraftChange, contactValidation, onContactValidationChange, onContactFocusField }: PortfolioViewProps) {
  const id = useId()
  const vi = data.ui.language === 'Ngôn ngữ'
  const pendingFocus = useRef<HTMLFormElement | null>(null)
  const errors = visibleContactErrors(contactDraft, contactValidation, vi ? 'vi' : 'en')
  useLayoutEffect(() => {
    if (!pendingFocus.current) return
    const form = pendingFocus.current
    const frame = requestAnimationFrame(() => {
      pendingFocus.current = null
      if (!form.isConnected || form.closest('[inert], [aria-hidden="true"]')) return
      const field = Object.keys(validateContactDraft(contactDraft, vi ? 'vi' : 'en'))[0]
      const element = field ? form.elements.namedItem(field) : null
      if (!(element instanceof HTMLElement) || !element.isConnected) return
      if (onContactFocusField) onContactFocusField(element)
      else element.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  })
  const touch = (field: keyof PortfolioContactDraft) => onContactValidationChange({
    ...contactValidation, touched: { ...contactValidation.touched, [field]: true },
  })
  const accessibility = (field: keyof PortfolioContactDraft) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined,
    onBlur: () => touch(field),
  })
  const copy = vi ? {
    write: 'Viết email', brief: 'Chia sẻ ý tưởng', name: 'Họ tên', email: 'Email của bạn',
    location: 'Địa điểm (không bắt buộc)', message: 'Về dự án',
    placeholder: 'Bạn muốn xây dựng gì, khi nào và cho ai?',
    explanation: 'Biểu mẫu mở ứng dụng email của bạn với bản nháp đã điền. Bạn cần kiểm tra và gửi từ đó; trang này không gửi hay lưu thông tin lên máy chủ.',
    submit: 'Mở bản nháp email',
  } : {
    write: 'Write', brief: 'Brief me', name: 'Your name', email: 'Your email',
    location: 'Location (optional)', message: 'About the project',
    placeholder: 'What are we making, when and for whom?',
    explanation: 'This form opens your mail app with a filled-in draft. Review and send it there; this page does not send or store your details on a server.',
    submit: 'Open email draft',
  }
  const words = data.ui.contactHeading.split(' ')
  const accentWords = vi ? 2 : 1
  return <div className="contact-view" data-ff-section="contact" data-ff-surface>
    <section className="pf-page pf-page--dark contact-view__hero" data-ff-surface>
      <div className="contact-view__statement">
        <header className="pf-header">
          <div data-framer-component-type="RichTextContainer"><h1>{words.slice(0, -accentWords).join(' ')} <span>{words.slice(-accentWords).join(' ')}</span></h1></div>
          <p>{data.ui.contactIntro}</p>
        </header>
        <div className="contact-view__connections">
          <div className="contact-view__email-row">
            <a className="contact-view__email" href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
            <a className="pf-action" href={`mailto:${data.profile.email}`}>{copy.write}<Icon size={15} /></a>
          </div>
          <div className="contact-view__socials">
            {data.links.filter(link => link.icon !== 'mail').map(link => <a key={link.url} className={`contact-view__social contact-view__social--${link.icon}`} href={link.url} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label}>
              <Icon name={link.icon} size={24} />
            </a>)}
          </div>
        </div>
      </div>
    </section>
    <section className="pf-page contact-view__brief" aria-labelledby={`${id}-brief`} data-ff-surface>
      <div data-framer-component-type="RichTextContainer"><h2 id={`${id}-brief`}>{copy.brief}</h2></div>
      <p id={`${id}-explanation`}>{copy.explanation}</p>
      <form noValidate aria-labelledby={`${id}-brief`} aria-describedby={`${id}-explanation`} onSubmit={event => {
        event.preventDefault()
        pendingFocus.current = null
        onContactValidationChange({ ...contactValidation, submitted: true })
        if (Object.keys(validateContactDraft(contactDraft, vi ? 'vi' : 'en')).length) {
          pendingFocus.current = event.currentTarget
          return
        }
        window.location.assign(contactDraftMailto(data.profile.email, contactDraft, vi))
      }}>
        <label htmlFor={`${id}-name`}>{copy.name}</label>
        <input id={`${id}-name`} name="name" autoComplete="name" required {...accessibility('name')} value={contactDraft.name} onChange={event => onContactDraftChange('name', event.currentTarget.value)} />
        {errors.name && <p className="contact-view__error" id={`${id}-name-error`}>{errors.name}</p>}
        <label htmlFor={`${id}-email`}>{copy.email}</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required {...accessibility('email')} value={contactDraft.email} onChange={event => onContactDraftChange('email', event.currentTarget.value)} />
        {errors.email && <p className="contact-view__error" id={`${id}-email-error`}>{errors.email}</p>}
        <label htmlFor={`${id}-location`}>{copy.location}</label>
        <input id={`${id}-location`} name="location" autoComplete="address-level2" value={contactDraft.location} onChange={event => onContactDraftChange('location', event.currentTarget.value)} />
        <label htmlFor={`${id}-message`}>{copy.message}</label>
        <textarea id={`${id}-message`} name="message" required rows={4} placeholder={copy.placeholder} {...accessibility('message')} value={contactDraft.message} onChange={event => onContactDraftChange('message', event.currentTarget.value)} />
        {errors.message && <p className="contact-view__error" id={`${id}-message-error`}>{errors.message}</p>}
        <button className="pf-action" type="submit">{copy.submit}<Icon size={16} /></button>
      </form>
    </section>
  </div>
}
