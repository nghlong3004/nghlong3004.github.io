import assert from 'node:assert/strict'
import test from 'node:test'
import { validateContactDraft, visibleContactErrors } from '../src/features/portfolio/lib/contactValidation.ts'

test('typed contact validator requires trimmed name/email/message and accepts optional location in VI/EN', () => {
  for (const language of ['vi', 'en']) {
    const empty = { name: ' \t', email: ' \n', location: '', message: '\n\t' }
    const errors = validateContactDraft(empty, language)
    assert.deepEqual(Object.keys(errors), ['name', 'email', 'message'], 'first invalid follows form order')
    assert.equal(errors.name, language === 'vi' ? 'Vui lòng nhập họ tên.' : 'Please enter your name.')
    assert.equal(errors.email, language === 'vi' ? 'Vui lòng nhập email.' : 'Please enter your email.')
    assert.equal(errors.message, language === 'vi' ? 'Vui lòng nhập nội dung về dự án.' : 'Please enter a message about your project.')
    const valid = { name: ' Visitor ', email: ' visitor+brief@example.com ', location: '', message: ' Hello\nworld ' }
    assert.deepEqual(validateContactDraft(valid, language), {})
    for (const email of ['invalid', 'a@', '@example.com', 'a b@example.com', 'a@example', 'a@@example.com', 'a@example.com\r\nBcc: other@example.com']) {
      assert.deepEqual(Object.keys(validateContactDraft({ ...valid, email }, language)), ['email'])
    }
    assert.deepEqual(visibleContactErrors(empty, { touched: {}, submitted: false }, language), {})
    assert.deepEqual(Object.keys(visibleContactErrors(empty, { touched: { email: true }, submitted: false }, language)), ['email'])
    assert.deepEqual(visibleContactErrors(empty, { touched: {}, submitted: true }, language), errors)
    assert.deepEqual(visibleContactErrors(valid, { touched: { name: true, email: true, message: true }, submitted: true }, language), {})
    const state = { touched: { email: true }, submitted: false }
    assert.equal(visibleContactErrors({ ...valid, email: 'bad' }, state, language).email, language === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.')
    assert.deepEqual(state, { touched: { email: true }, submitted: false }, 'validation does not mutate shared state')
    assert.equal(empty.name, ' \t', 'validation does not mutate draft')
  }
})
