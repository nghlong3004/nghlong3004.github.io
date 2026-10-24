import type { Language, PortfolioContactDraft, PortfolioContactValidation } from '../types'

export function validateContactDraft(draft: PortfolioContactDraft, language: Language) {
  const vi = language === 'vi'
  const errors: Partial<Record<keyof PortfolioContactDraft, string>> = {}
  if (!draft.name.trim()) errors.name = vi ? 'Vui lòng nhập họ tên.' : 'Please enter your name.'
  if (!draft.email.trim()) errors.email = vi ? 'Vui lòng nhập email.' : 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
    errors.email = vi ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.'
  }
  if (!draft.message.trim()) errors.message = vi ? 'Vui lòng nhập nội dung về dự án.' : 'Please enter a message about your project.'
  return errors
}

export function visibleContactErrors(draft: PortfolioContactDraft, validation: PortfolioContactValidation, language: Language) {
  const errors = validateContactDraft(draft, language)
  for (const field of Object.keys(errors) as (keyof PortfolioContactDraft)[]) {
    if (!validation.submitted && !validation.touched[field]) delete errors[field]
  }
  return errors
}
