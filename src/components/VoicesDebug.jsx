import PropTypes from 'prop-types'
import { Button, Collapse, ScrollArea, Code, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

/**
 * Collapsible panel listing all system voices for debugging.
 * Uses Mantine Collapse + useDisclosure — no hand-rolled toggle state.
 */
export default function VoicesDebug({ voices }) {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <Stack gap="xs">
      <Button variant="subtle" size="compact-sm" onClick={toggle}>
        {opened ? 'Hide Voices' : 'List Voices'}
      </Button>

      <Collapse in={opened}>
        <Text size="xs" c="dimmed" mb={4}>Available voices (debug)</Text>
        <ScrollArea h={180}>
          <Code block style={{ fontSize: '0.78rem', whiteSpace: 'pre' }}>
            {voices.length === 0
              ? 'No voices available yet.\nTry interacting with the page or reloading.'
              : voices
                  .map(v => `${v.lang} | ${v.name} | ${v.voiceURI}${v.default ? ' (default)' : ''}`)
                  .join('\n')}
          </Code>
        </ScrollArea>
      </Collapse>
    </Stack>
  )
}

VoicesDebug.propTypes = {
  voices: PropTypes.array.isRequired,
}
