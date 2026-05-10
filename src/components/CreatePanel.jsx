import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { toast } from 'sonner'
import {
  TextInput, Select, Checkbox, Button, Group, Stack, Divider, Text,
} from '@mantine/core'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { buildVoiceOptions } from '../utils/voices.js'
import { speakText, speakBothSequential } from '../utils/speech.js'
import VoicesDebug from './VoicesDebug.jsx'

const LANG_OPTIONS     = [{ value: 'en-US', label: 'English (en-US)' }, { value: 'he-IL', label: 'Hebrew (he-IL)' }]
const ALT_LANG_OPTIONS = [{ value: '', label: '(none)' }, ...LANG_OPTIONS]
const INTENSITY_OPTIONS = [{ value: '0.6', label: 'Low' }, { value: '1.0', label: 'Normal' }, { value: '1.4', label: 'High' }]

const DEFAULTS = {
  text: '', lang: 'en-US', voiceURI: '', color: '#7c3aed',
  altText: '', altLang: '', altVoiceURI: '', altColor: '#0ea5a4',
}

export default function CreatePanel({
  voices, realisticMode, realisticIntensity,
  onAdd, onRealisticChange, onIntensityChange,
}) {
  const { register, handleSubmit, watch, setValue, reset, control } = useForm({ defaultValues: DEFAULTS })
  const lang    = watch('lang')
  const altLang = watch('altLang')
  const color    = watch('color')
  const altColor = watch('altColor')

  // Auto-select first matching voice when language changes
  useEffect(() => {
    const opts = buildVoiceOptions(voices, lang)
    const first = opts.find(o => !o.disabled && o.value !== '__sep__')
    if (first) setValue('voiceURI', first.value)
  }, [lang, voices, setValue])

  useEffect(() => {
    if (!altLang) { setValue('altVoiceURI', ''); return }
    const opts = buildVoiceOptions(voices, altLang)
    const first = opts.find(o => !o.disabled && o.value !== '__sep__')
    if (first) setValue('altVoiceURI', first.value)
  }, [altLang, voices, setValue])

  function onSubmit(data) {
    if (!data.text.trim()) { toast.error('Please enter primary text.'); return }
    onAdd({ ...data, text: data.text.trim(), altText: data.altText.trim() })
    reset({ ...DEFAULTS })
    toast.success('Button added!')
  }

  function handlePreview() {
    const { text, lang: l, voiceURI } = watch()
    if (!text.trim()) { toast.warning('Enter primary text to preview.'); return }
    const opts = { realistic: realisticMode, intensity: parseFloat(realisticIntensity) }
    speakText(text.trim(), l, voiceURI, opts)
    toast.info(`Preview: ${l}`)
  }

  function handlePreviewBoth() {
    const { text, lang: l, voiceURI, altText, altLang: al, altVoiceURI } = watch()
    if (!text.trim() && !altText.trim()) { toast.warning('Enter primary or alternate text to preview.'); return }
    const opts = { realistic: realisticMode, intensity: parseFloat(realisticIntensity) }
    speakBothSequential(text.trim(), l, voiceURI, altText.trim(), al, altVoiceURI, opts)
    toast.info('Preview both (sequential)')
  }

  const primaryVoiceOpts = buildVoiceOptions(voices, lang).filter(o => !o.disabled).map(o => ({ value: o.value, label: o.label }))
  const altVoiceOpts     = buildVoiceOptions(voices, altLang).filter(o => !o.disabled).map(o => ({ value: o.value, label: o.label }))

  return (
    <div className="panel">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Primary text"
            placeholder={lang === 'he-IL' ? 'כתוב משהו בעברית' : 'Type primary text (e.g., Hello / שלום)'}
            dir={lang === 'he-IL' ? 'rtl' : 'ltr'}
            {...register('text')}
          />

          <Group grow>
            <Select label="Primary language" data={LANG_OPTIONS} {...register('lang')}
              value={lang} onChange={v => setValue('lang', v)} />
            <Controller name="voiceURI" control={control}
              render={({ field }) => (
                <Select label="Primary voice" data={primaryVoiceOpts}
                  value={field.value} onChange={field.onChange} searchable />
              )} />
            <Stack gap={4}>
              <Text size="sm" c="var(--mantine-color-text)">Button color</Text>
              <HexColorPicker color={color} onChange={v => setValue('color', v)} style={{ width: '100%', height: 80 }} />
              <HexColorInput color={color} onChange={v => setValue('color', v)} prefixed style={{ width: '100%' }} />
            </Stack>
          </Group>

          <Divider opacity={0.15} />

          <TextInput
            label="Alternate text (optional)"
            placeholder={altLang === 'he-IL' ? 'כתוב טקסט חלופי בעברית' : 'Alternate text / translation (optional)'}
            dir={altLang === 'he-IL' ? 'rtl' : 'ltr'}
            {...register('altText')}
          />

          <Group grow>
            <Select label="Alternate language" data={ALT_LANG_OPTIONS} value={altLang} onChange={v => setValue('altLang', v)} />
            <Controller name="altVoiceURI" control={control}
              render={({ field }) => (
                <Select label="Alternate voice" data={altVoiceOpts}
                  value={field.value} onChange={field.onChange} searchable />
              )} />
            <Stack gap={4}>
              <Text size="sm" c="var(--mantine-color-text)">Alternate color</Text>
              <HexColorPicker color={altColor} onChange={v => setValue('altColor', v)} style={{ width: '100%', height: 80 }} />
              <HexColorInput color={altColor} onChange={v => setValue('altColor', v)} prefixed style={{ width: '100%' }} />
            </Stack>
          </Group>

          <Group>
            <Checkbox
              label="Realistic speech (split phrases, varied pitch)"
              checked={realisticMode}
              onChange={e => onRealisticChange(e.currentTarget.checked)}
            />
            <Select
              label="Intensity"
              data={INTENSITY_OPTIONS}
              value={realisticIntensity}
              onChange={onIntensityChange}
              w={160}
            />
          </Group>

          <Group>
            <Button type="submit" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
              + Add Button
            </Button>
            <Button type="button" variant="subtle" onClick={handlePreview}>
              Play Preview (primary)
            </Button>
            <Button type="button" variant="subtle" onClick={handlePreviewBoth}>
              Play Preview (both)
            </Button>
          </Group>

          <VoicesDebug voices={voices} />
        </Stack>
      </form>
    </div>
  )
}

CreatePanel.propTypes = {
  voices:             PropTypes.array.isRequired,
  realisticMode:      PropTypes.bool.isRequired,
  realisticIntensity: PropTypes.string.isRequired,
  onAdd:              PropTypes.func.isRequired,
  onRealisticChange:  PropTypes.func.isRequired,
  onIntensityChange:  PropTypes.func.isRequired,
}
