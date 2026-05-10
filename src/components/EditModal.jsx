import { useForm, Controller, useWatch } from 'react-hook-form'
import PropTypes from 'prop-types'
import {
  Modal, TextInput, Select, Button, Group, Stack, Divider, Text,
} from '@mantine/core'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { buildVoiceOptions } from '../utils/voices.js'

const LANG_OPTIONS = [
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'he-IL', label: 'Hebrew (he-IL)' },
]
const ALT_LANG_OPTIONS = [{ value: '', label: '(none)' }, ...LANG_OPTIONS]

/**
 * Accessible edit modal — Mantine Modal (focus-trap + Escape built-in)
 * + react-hook-form.  key={button.id} on the parent remounts on each new
 * button so no sync-setState-in-effect is needed.
 */
export default function EditModal({ button, voices, onSave, onClose }) {
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: button,
  })

  const lang     = useWatch({ control, name: 'lang' })
  const altLang  = useWatch({ control, name: 'altLang' }) || ''
  const color    = useWatch({ control, name: 'color' })   || '#7c3aed'
  const altColor = useWatch({ control, name: 'altColor' }) || color

  if (!button) return null

  const primaryVoiceOpts = buildVoiceOptions(voices, lang)
    .filter(o => !o.disabled)
    .map(o => ({ value: o.value, label: o.label }))

  const altVoiceOpts = buildVoiceOptions(voices, altLang)
    .filter(o => !o.disabled)
    .map(o => ({ value: o.value, label: o.label }))

  function onSubmit(data) {
    onSave({ ...data, text: data.text.trim(), altText: (data.altText || '').trim() })
  }

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Edit Button"
      size="lg"
      overlayProps={{ backgroundOpacity: 0.6 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Primary text"
            dir={lang === 'he-IL' ? 'rtl' : 'ltr'}
            {...register('text', { required: true })}
          />

          <Group grow align="flex-start">
            <Select
              label="Primary language"
              data={LANG_OPTIONS}
              value={lang}
              onChange={v => setValue('lang', v)}
            />
            <Controller
              name="voiceURI"
              control={control}
              render={({ field }) => (
                <Select
                  label="Primary voice"
                  data={primaryVoiceOpts}
                  value={field.value}
                  onChange={field.onChange}
                  searchable
                />
              )}
            />
            <Stack gap={4}>
              <Text size="sm">Button color</Text>
              <HexColorPicker
                color={color}
                onChange={v => setValue('color', v)}
                style={{ width: '100%', height: 80 }}
              />
              <HexColorInput
                color={color}
                onChange={v => setValue('color', v)}
                prefixed
                style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'inherit' }}
              />
            </Stack>
          </Group>

          <Divider opacity={0.15} />

          <TextInput
            label="Alternate text (optional)"
            dir={altLang === 'he-IL' ? 'rtl' : 'ltr'}
            {...register('altText')}
          />

          <Group grow align="flex-start">
            <Select
              label="Alternate language"
              data={ALT_LANG_OPTIONS}
              value={altLang}
              onChange={v => setValue('altLang', v)}
            />
            <Controller
              name="altVoiceURI"
              control={control}
              render={({ field }) => (
                <Select
                  label="Alternate voice"
                  data={altVoiceOpts}
                  value={field.value || ''}
                  onChange={field.onChange}
                  searchable
                />
              )}
            />
            <Stack gap={4}>
              <Text size="sm">Alternate color</Text>
              <HexColorPicker
                color={altColor}
                onChange={v => setValue('altColor', v)}
                style={{ width: '100%', height: 80 }}
              />
              <HexColorInput
                color={altColor}
                onChange={v => setValue('altColor', v)}
                prefixed
                style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'inherit' }}
              />
            </Stack>
          </Group>

          <Group justify="flex-end" mt="xs">
            <Button variant="subtle" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: 'violet', to: 'blue' }}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

EditModal.propTypes = {
  button:  PropTypes.object,
  voices:  PropTypes.array.isRequired,
  onSave:  PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
