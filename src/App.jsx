import { useState } from 'react'
import { nanoid } from 'nanoid'
import { Title, Text, Group, Container, Image } from '@mantine/core'
import { useButtons }  from './hooks/useButtons.js'
import { useVoices }   from './hooks/useVoices.js'
import CreatePanel     from './components/CreatePanel.jsx'
import ButtonsGrid     from './components/ButtonsGrid.jsx'
import EditModal       from './components/EditModal.jsx'

export default function App() {
  const { buttons, addButton, updateButton, deleteButton } = useButtons()
  const voices = useVoices()

  const [realisticMode,      setRealisticMode]      = useState(false)
  const [realisticIntensity, setRealisticIntensity] = useState('1.0')
  const [editingButton,      setEditingButton]      = useState(null)

  function handleAdd(fields) {
    addButton({ id: nanoid(7), ...fields })
  }

  function handleEdit(id) {
    const btn = buttons.find(b => b.id === id)
    if (btn) setEditingButton(btn)
  }

  function handleSave(updated) {
    updateButton(updated.id, updated)
    setEditingButton(null)
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg" wrap="wrap">
        <Group gap="sm" align="center">
          <Image src="logo.svg" alt="VoxTiles logo" w={44} h={44} />
          <div>
            <Title order={1} size="h2" style={{ letterSpacing: '-0.5px' }}>
              Vox<span style={{ color: '#7c3aed' }}>Tiles</span>
            </Title>
            <Text size="sm" c="dimmed" mt={2}>
              Bilingual speak-buttons — English &amp; Hebrew, full-card colour,
              realistic natural speech.
            </Text>
          </div>
        </Group>
        <Text size="sm" c="dimmed">Saved locally · Works in modern browsers</Text>
      </Group>

      <CreatePanel
        voices={voices}
        realisticMode={realisticMode}
        realisticIntensity={realisticIntensity}
        onAdd={handleAdd}
        onRealisticChange={setRealisticMode}
        onIntensityChange={setRealisticIntensity}
      />

      <ButtonsGrid
        buttons={buttons}
        realisticMode={realisticMode}
        realisticIntensity={realisticIntensity}
        onEdit={handleEdit}
        onDelete={deleteButton}
      />

      <Text size="xs" c="dimmed" mt="xl">
        Want to add cloud TTS (high-quality Hebrew/English voices)?
        Tell me which provider and I&apos;ll provide a small server example.
      </Text>

      {editingButton && (
        <EditModal
          key={editingButton.id}
          button={editingButton}
          voices={voices}
          onSave={handleSave}
          onClose={() => setEditingButton(null)}
        />
      )}
    </Container>
  )
}
