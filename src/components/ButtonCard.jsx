import PropTypes from 'prop-types'
import { contrastTextColor } from '../utils/color.js'
import {
  speakText,
  speakBothSequential,
  speakBothSimultaneous,
} from '../utils/speech.js'

/**
 * A single saved speak-button card with full-card background colour.
 */
export default function ButtonCard({ button, realisticMode, realisticIntensity, onEdit, onDelete }) {
  const {
    text, lang, voiceURI, color,
    altText, altLang, altVoiceURI,
  } = button

  const bg         = color || '#7c3aed'
  const textColor  = contrastTextColor(bg)
  const speechOpts = { realistic: realisticMode, intensity: parseFloat(realisticIntensity) }
  const langCode   = (lang || '').split('-')[0].toUpperCase() || '—'
  const isHebPrim  = lang && lang.split('-')[0] === 'he'
  const isHebAlt   = altLang && altLang.split('-')[0] === 'he'

  const chipBg = textColor === '#ffffff' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const badgeBg   = textColor === '#ffffff' ? '#ffffff' : '#021018'
  const badgeText = textColor === '#ffffff' ? '#021018' : '#ffffff'
  const playBg    = textColor === '#ffffff' ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.08)'

  return (
    <div
      className="btn-card"
      style={{
        background: bg,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02), 0 8px 24px rgba(2,6,23,0.35)',
      }}
    >
      {/* Top row: label + language badge */}
      <div className="btn-top">
        <div
          className="label"
          style={{ color: textColor }}
          dir={isHebPrim ? 'rtl' : 'ltr'}
        >
          {text || '(empty)'}
        </div>
        <div className="chip" style={{ background: chipBg }}>
          <div
            className="lang-badge"
            style={{ background: badgeBg, color: badgeText }}
          >
            {langCode}
          </div>
        </div>
      </div>

      {/* Alternate text */}
      {altText && (
        <div
          className="alt"
          style={{ color: textColor }}
          dir={isHebAlt ? 'rtl' : 'ltr'}
        >
          ⇄ {altText}
        </div>
      )}

      {/* Action buttons */}
      <div className="btn-actions">
        <button
          type="button"
          className="btn-small"
          style={{ background: playBg, color: textColor, border: 'none' }}
          onClick={() => speakText(text, lang, voiceURI, speechOpts)}
          aria-label={`Play: ${text}`}
        >
          🔊 Play
        </button>

        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() => speakText(altText || '', altLang || '', altVoiceURI || '', speechOpts)}
          aria-label={`Play alternate: ${altText}`}
          disabled={!altText}
        >
          🔁 Alt
        </button>

        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() =>
            speakBothSequential(text, lang, voiceURI, altText, altLang, altVoiceURI, speechOpts)
          }
          aria-label="Play both sequentially"
          title="Play primary then alternate"
        >
          ▶ Both
        </button>

        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() =>
            speakBothSimultaneous(text, lang, voiceURI, altText, altLang, altVoiceURI, speechOpts)
          }
          aria-label="Play both simultaneously"
          title="Attempt simultaneous playback"
        >
          🔊🔊 Sim
        </button>

        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() => onEdit(button.id)}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn-ghost btn-small"
          onClick={() => {
            if (window.confirm('Delete this button?')) onDelete(button.id)
          }}
        >
          Delete
        </button>

        {/* Colour swatch */}
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '6px',
            background: bg,
            border: '1px solid rgba(255,255,255,0.15)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

ButtonCard.propTypes = {
  button:             PropTypes.object.isRequired,
  realisticMode:      PropTypes.bool.isRequired,
  realisticIntensity: PropTypes.string.isRequired,
  onEdit:             PropTypes.func.isRequired,
  onDelete:           PropTypes.func.isRequired,
}
