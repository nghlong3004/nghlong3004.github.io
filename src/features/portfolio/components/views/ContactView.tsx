import { useId } from 'react'
import type { PortfolioContactDraft, PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import { Portrait } from '../Portrait'
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

export function ContactView({ data, contactDraft, onContactDraftChange }: PortfolioViewProps) {
  const id = useId()
  const vi = data.ui.language === 'Ngôn ngữ'
  const copy = vi ? {
    write: 'Viết email', brief: 'Chia sẻ ý tưởng', name: 'Họ tên', email: 'Email của bạn',
    location: 'Địa điểm (không bắt buộc)', message: 'Về dự án',
    placeholder: 'Bạn muốn xây dựng gì, khi nào và cho ai?',
    explanation: 'Biểu mẫu mở ứng dụng email của bạn với bản nháp đã điền. Bạn cần kiểm tra và gửi từ đó; trang này không gửi hay lưu thông tin lên máy chủ.',
    submit: 'Mở bản nháp email', required: 'Vui lòng nhập nội dung về dự án.',
  } : {
    write: 'Write', brief: 'Brief me', name: 'Your name', email: 'Your email',
    location: 'Location (optional)', message: 'About the project',
    placeholder: 'What are we making, when and for whom?',
    explanation: 'This form opens your mail app with a filled-in draft. Review and send it there; this page does not send or store your details on a server.',
    submit: 'Open email draft', required: 'Please enter a message about your project.',
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
            {data.links.filter(link => link.icon !== 'mail').map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              {link.label}<Icon size={15} />
            </a>)}
          </div>
        </div>
      </div>
      <div style={{ overflow: 'hidden' }} data-ff-surface><div data-framer-background-image-wrapper="true">
        <Portrait portrait={data.profile.portrait} className="contact-view__portrait" />
      </div></div>
    </section>
    <section className="pf-page contact-view__brief" aria-labelledby={`${id}-brief`} data-ff-surface>
      <div data-framer-component-type="RichTextContainer"><h2 id={`${id}-brief`}>{copy.brief}</h2></div>
      <p id={`${id}-explanation`}>{copy.explanation}</p>
      <form aria-labelledby={`${id}-brief`} aria-describedby={`${id}-explanation`} onSubmit={event => {
        event.preventDefault()
        const message = event.currentTarget.elements.namedItem('message') as HTMLTextAreaElement
        message.setCustomValidity(contactDraft.message.trim() ? '' : copy.required)
        const valid = event.currentTarget.reportValidity()
        // Validation must not leave stale local state when the other hardware copy edits the draft.
        message.setCustomValidity('')
        if (valid) window.location.assign(contactDraftMailto(data.profile.email, contactDraft, vi))
      }}>
        <label htmlFor={`${id}-name`}>{copy.name}</label>
        <input id={`${id}-name`} name="name" autoComplete="name" required pattern=".*\S.*" value={contactDraft.name} onChange={event => onContactDraftChange('name', event.currentTarget.value)} />
        <label htmlFor={`${id}-email`}>{copy.email}</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required value={contactDraft.email} onChange={event => onContactDraftChange('email', event.currentTarget.value)} />
        <label htmlFor={`${id}-location`}>{copy.location}</label>
        <input id={`${id}-location`} name="location" autoComplete="address-level2" value={contactDraft.location} onChange={event => onContactDraftChange('location', event.currentTarget.value)} />
        <label htmlFor={`${id}-message`}>{copy.message}</label>
        <textarea id={`${id}-message`} name="message" required rows={4} placeholder={copy.placeholder} value={contactDraft.message} onChange={event => {
          event.currentTarget.setCustomValidity('')
          onContactDraftChange('message', event.currentTarget.value)
        }} />
        <button className="pf-action" type="submit">{copy.submit}<Icon size={16} /></button>
      </form>
    </section>
  </div>
}
