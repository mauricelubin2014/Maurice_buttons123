import PropTypes from 'prop-types'
import ButtonCard from './ButtonCard.jsx'

/**
 * Responsive grid of all saved speak buttons.
 */
export default function ButtonsGrid({
  buttons,
  realisticMode,
  realisticIntensity,
  onEdit,
  onDelete,
}) {
  return (
    <div className="panel" style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Your Buttons</strong>
        <span className="muted">
          {buttons.length} button{buttons.length === 1 ? '' : 's'}
        </span>
      </div>

      <div
        id="buttonsGrid"
        className="buttons-grid"
        aria-live="polite"
        style={{ marginTop: '12px' }}
      >
        {buttons.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No buttons yet. Add one above.
          </p>
        ) : (
          buttons.map(btn => (
            <ButtonCard
              key={btn.id}
              button={btn}
              realisticMode={realisticMode}
              realisticIntensity={realisticIntensity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <p className="muted" style={{ marginTop: '10px', fontSize: '0.82rem' }}>
        Longer texts are split into phrases for more natural delivery.
        For professional quality consider cloud TTS (Azure / Google / AWS).
      </p>
    </div>
  )
}

ButtonsGrid.propTypes = {
  buttons:            PropTypes.array.isRequired,
  realisticMode:      PropTypes.bool.isRequired,
  realisticIntensity: PropTypes.string.isRequired,
  onEdit:             PropTypes.func.isRequired,
  onDelete:           PropTypes.func.isRequired,
}
