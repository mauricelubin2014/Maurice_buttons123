import PropTypes from 'prop-types'
import { SimpleGrid, Text, Group, Paper } from '@mantine/core'
import ButtonCard from './ButtonCard.jsx'

/**
 * Responsive grid of all saved speak buttons — Mantine SimpleGrid.
 */
export default function ButtonsGrid({
  buttons, realisticMode, realisticIntensity, onEdit, onDelete,
}) {
  return (
    <Paper className="panel" mt="md" p="sm" radius="md">
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Your Buttons</Text>
        <Text size="sm" c="dimmed">
          {buttons.length} button{buttons.length === 1 ? '' : 's'}
        </Text>
      </Group>

      <div aria-live="polite">
        {buttons.length === 0 ? (
          <Text c="dimmed" size="sm">No buttons yet. Add one above.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
            {buttons.map(btn => (
              <ButtonCard
                key={btn.id}
                button={btn}
                realisticMode={realisticMode}
                realisticIntensity={realisticIntensity}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SimpleGrid>
        )}
      </div>

      <Text c="dimmed" size="xs" mt="sm">
        Longer texts are split into phrases for more natural delivery.
        For professional quality consider cloud TTS (Azure / Google / AWS).
      </Text>
    </Paper>
  )
}

ButtonsGrid.propTypes = {
  buttons:            PropTypes.array.isRequired,
  realisticMode:      PropTypes.bool.isRequired,
  realisticIntensity: PropTypes.string.isRequired,
  onEdit:             PropTypes.func.isRequired,
  onDelete:           PropTypes.func.isRequired,
}
