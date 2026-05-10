import { useState } from 'react'
import { nanoid } from 'nanoid'
import { useButtons } from './hooks/useButtons.js'
import { useVoices }  from './hooks/useVoices.js'
import { speakText, speakBothSequential } from './utils/speech.js'
import CreatePanel  from './components/CreatePanel.jsx'
import ButtonsGrid  from './components/ButtonsGrid.jsx'
import EditModal    from './components/EditModal.jsx'

export default function App() {
  const { buttons, addButton, updateButton, deleteButton } = useButtons()
  const voices = useVoices()

  const [realisticMode,      setRealisticMode]      = useState(false)
  const [realisticIntensity, setRealisticIntensity] = useState('1.0')
  const [editingButton,      setEditingButton]      = useState(null)

  function handleAdd(fields) {
    addButton({ id: nanoid(7), ...fields })
  }

  function handlePreview(text, lang, voiceURI, altText, altLang, altVoiceURI, both = false) {
    const opts = { realistic: realisticMode, intensity: parseFloat(realisticIntensity) }
    if (both) {
      speakBothSequential(text, lang, voiceURI, altText, altLang, altVoiceURI, opts)
    } else {
      speakText(text, lang, voiceURI, opts)
    }
  }

  function handleEdit(id) {
    const btn = buttons.find(b => b.id === id)
    if (btn) setEditingButton(btn)
  }

  function handleSave(updated) {
    updateButton(updated.id, updated)
    setEditingButton(null)
  }

  function handleDelete(id) {
    deleteButton(id)
  }

  return (
    <>
      <header>
        <div>
          <h1>Colorful Speak Buttons — More Realistic</h1>
          <div className="sub">
            Full-card color, improved natural speech (split phrases, small pauses, varied pitch).
            Toggle realistic mode below.
          </div>
        </div>
        <div className="muted">Saved locally · Works in modern browsers</div>
      </header>

      <CreatePanel
        voices={voices}
        realisticMode={realisticMode}
        realisticIntensity={realisticIntensity}
        onAdd={handleAdd}
        onPreview={handlePreview}
        onRealisticChange={setRealisticMode}
        onIntensityChange={setRealisticIntensity}
      />

      <ButtonsGrid
        buttons={buttons}
        realisticMode={realisticMode}
        realisticIntensity={realisticIntensity}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <footer>
        Want me to add cloud TTS (high-quality Hebrew/English voices)?
        Tell me which provider and I&apos;ll provide a small server example.
      </footer>

      {editingButton && (
        <EditModal
          key={editingButton.id}
          button={editingButton}
          voices={voices}
          onSave={handleSave}
          onClose={() => setEditingButton(null)}
        />
      )}
    </>
  )
}
