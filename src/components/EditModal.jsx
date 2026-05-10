import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import PropTypes from 'prop-types'
import { buildVoiceOptions } from '../utils/voices.js'

const LANG_OPTIONS = [
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'he-IL', label: 'Hebrew (he-IL)' },
]

const ALT_LANG_OPTIONS = [
  { value: '',      label: '(none)' },
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'he-IL', label: 'Hebrew (he-IL)' },
]

/**
 * Accessible modal dialog for editing a speak button.
 * Uses @headlessui/react Dialog — focus-trap, Escape-close, and ARIA handled automatically.
 * Key prop on the parent ensures form state resets when a different button is opened.
 */
export default function EditModal({ button, voices, onSave, onClose }) {
  // Initial state comes from the button prop; key={button.id} on the parent remounts
  // this component when a different button is opened, so no sync useEffect needed.
  const [form, setForm] = useState(button)

  if (!button) return null

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const primaryVoiceOpts = buildVoiceOptions(voices, form.lang)
  const altVoiceOpts     = buildVoiceOptions(voices, form.altLang)
  const isHebPrimary     = form.lang === 'he-IL'
  const isHebAlt         = form.altLang === 'he-IL'

  function handleSave(e) {
    e.preventDefault()
    onSave({ ...form, text: form.text.trim(), altText: (form.altText || '').trim() })
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      style={{ position: 'relative', zIndex: 1000 }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(2,6,23,0.75)',
        }}
        aria-hidden="true"
      />

      {/* Centring wrapper */}
      <div
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <DialogPanel
          className="panel"
          style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <DialogTitle style={{ marginTop: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Edit Button
          </DialogTitle>

          <form onSubmit={handleSave}>
            {/* Primary */}
            <label htmlFor="editText">Primary text</label>
            <input
              id="editText"
              type="text"
              dir={isHebPrimary ? 'rtl' : 'ltr'}
              value={form.text}
              onChange={e => set('text', e.target.value)}
              required
            />

            <div className="row" style={{ marginTop: '10px' }}>
              <div>
                <label htmlFor="editLang">Primary language</label>
                <select id="editLang" value={form.lang} onChange={e => set('lang', e.target.value)}>
                  {LANG_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editVoice">Primary voice</label>
                <select id="editVoice" value={form.voiceURI} onChange={e => set('voiceURI', e.target.value)}>
                  {primaryVoiceOpts.map(o => (
                    <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editColor">Button color</label>
                <input id="editColor" type="color" value={form.color} onChange={e => set('color', e.target.value)} />
              </div>
            </div>

            <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed rgba(255,255,255,0.04)' }} />

            {/* Alternate */}
            <label htmlFor="editAltText">Alternate text (optional)</label>
            <input
              id="editAltText"
              type="text"
              dir={isHebAlt ? 'rtl' : 'ltr'}
              value={form.altText || ''}
              onChange={e => set('altText', e.target.value)}
            />

            <div className="row" style={{ marginTop: '10px' }}>
              <div>
                <label htmlFor="editAltLang">Alternate language</label>
                <select id="editAltLang" value={form.altLang || ''} onChange={e => set('altLang', e.target.value)}>
                  {ALT_LANG_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editAltVoice">Alternate voice</label>
                <select id="editAltVoice" value={form.altVoiceURI || ''} onChange={e => set('altVoiceURI', e.target.value)}>
                  {altVoiceOpts.map(o => (
                    <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editAltColor">Alternate color</label>
                <input
                  id="editAltColor"
                  type="color"
                  value={form.altColor || form.color || '#0ea5a4'}
                  onChange={e => set('altColor', e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '14px' }}>
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

EditModal.propTypes = {
  button:  PropTypes.object,
  voices:  PropTypes.array.isRequired,
  onSave:  PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
