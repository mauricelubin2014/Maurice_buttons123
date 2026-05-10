import { useState } from 'react'
import PropTypes from 'prop-types'
import { buildVoiceOptions } from '../utils/voices.js'

/**
 * Collapsible panel that dumps all system voices for debugging.
 */
export default function VoicesDebug({ voices }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: '12px' }}>
      <button
        type="button"
        className="btn-ghost btn-small"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Hide Voices' : 'List Voices'}
      </button>

      {open && (
        <div style={{ marginTop: '10px' }}>
          <label style={{ marginBottom: '6px', display: 'block' }}>
            Available voices (debug)
          </label>
          <pre
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              background: 'rgba(255,255,255,0.02)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#94a3b8',
            }}
            aria-live="polite"
          >
            {voices.length === 0
              ? 'No voices available yet. Try interacting with the page or reloading the browser.'
              : voices
                  .map(v => `${v.lang} | ${v.name} | ${v.voiceURI}${v.default ? ' (default)' : ''}`)
                  .join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}

VoicesDebug.propTypes = {
  voices: PropTypes.array.isRequired,
}
