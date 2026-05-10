import PropTypes from 'prop-types'
import { Card, Badge, Button, Group, Text, Tooltip } from '@mantine/core'
import { contrastTextColor } from '../utils/color.js'
import {
  speakText,
  speakBothSequential,
  speakBothSimultaneous,
} from '../utils/speech.js'

/**
 * A single saved speak-button card — Mantine Card with full-card background colour.
 */
export default function ButtonCard({ button, realisticMode, realisticIntensity, onEdit, onDelete }) {
  const { text, lang, voiceURI, color, altText, altLang, altVoiceURI } = button

  const bg         = color || '#7c3aed'
  const textColor  = contrastTextColor(bg)
  const speechOpts = { realistic: realisticMode, intensity: parseFloat(realisticIntensity) }
  const langCode   = (lang || '').split('-')[0].toUpperCase() || '—'
  const isHebPrim  = lang && lang.split('-')[0] === 'he'
  const isHebAlt   = altLang && altLang.split('-')[0] === 'he'

  return (
    <Card
      padding="sm"
      radius="md"
      style={{
        background: bg,
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: '0 8px 24px rgba(2,6,23,0.35)',
      }}
    >
      {/* Header row */}
      <Group justify="space-between" mb={altText ? 4 : 8} wrap="nowrap">
        <Text
          fw={700}
          size="md"
          style={{ color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
          dir={isHebPrim ? 'rtl' : 'ltr'}
        >
          {text || '(empty)'}
        </Text>
        <Badge
          size="sm"
          radius="xl"
          style={{
            background: textColor === '#ffffff' ? '#ffffff' : '#021018',
            color:      textColor === '#ffffff' ? '#021018' : '#ffffff',
            flexShrink: 0,
          }}
        >
          {langCode}
        </Badge>
      </Group>

      {/* Alternate text */}
      {altText && (
        <Text
          size="sm"
          mb={8}
          style={{ color: textColor, opacity: 0.9 }}
          dir={isHebAlt ? 'rtl' : 'ltr'}
        >
          ⇄ {altText}
        </Text>
      )}

      {/* Action buttons */}
      <Group gap={4} wrap="wrap">
        <Tooltip label={`Play: ${text}`} withArrow>
          <Button
            size="compact-xs"
            variant="filled"
            style={{ background: 'rgba(0,0,0,0.28)', color: textColor, border: 'none' }}
            onClick={() => speakText(text, lang, voiceURI, speechOpts)}
          >
            🔊 Play
          </Button>
        </Tooltip>

        <Tooltip label="Play alternate" withArrow>
          <Button
            size="compact-xs"
            variant="subtle"
            style={{ color: textColor }}
            disabled={!altText}
            onClick={() => speakText(altText || '', altLang || '', altVoiceURI || '', speechOpts)}
          >
            🔁 Alt
          </Button>
        </Tooltip>

        <Tooltip label="Play primary then alternate" withArrow>
          <Button
            size="compact-xs"
            variant="subtle"
            style={{ color: textColor }}
            onClick={() =>
              speakBothSequential(text, lang, voiceURI, altText, altLang, altVoiceURI, speechOpts)
            }
          >
            ▶ Both
          </Button>
        </Tooltip>

        <Tooltip label="Attempt simultaneous playback" withArrow>
          <Button
            size="compact-xs"
            variant="subtle"
            style={{ color: textColor }}
            onClick={() =>
              speakBothSimultaneous(text, lang, voiceURI, altText, altLang, altVoiceURI, speechOpts)
            }
          >
            🔊🔊 Sim
          </Button>
        </Tooltip>

        <Button
          size="compact-xs"
          variant="subtle"
          style={{ color: textColor }}
          onClick={() => onEdit(button.id)}
        >
          Edit
        </Button>

        <Button
          size="compact-xs"
          variant="subtle"
          style={{ color: textColor }}
          onClick={() => {
            if (window.confirm('Delete this button?')) onDelete(button.id)
          }}
        >
          Delete
        </Button>

        {/* Colour swatch */}
        <div
          style={{
            width: 16, height: 16, borderRadius: 4,
            background: bg, border: '1px solid rgba(255,255,255,0.2)',
            flexShrink: 0, alignSelf: 'center',
          }}
          aria-hidden="true"
        />
      </Group>
    </Card>
  )
}

ButtonCard.propTypes = {
  button:             PropTypes.object.isRequired,
  realisticMode:      PropTypes.bool.isRequired,
  realisticIntensity: PropTypes.string.isRequired,
  onEdit:             PropTypes.func.isRequired,
  onDelete:           PropTypes.func.isRequired,
}
