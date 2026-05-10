import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import EditModal from '../components/EditModal.jsx'

const mockButton = {
  id: 'xyz', text: 'Hello', lang: 'en-US', voiceURI: '', color: '#7c3aed',
  altText: '', altLang: '', altVoiceURI: '', altColor: '#0ea5a4',
}

function renderModal(overrides = {}) {
  const props = {
    button: mockButton, voices: [],
    onSave: vi.fn(), onClose: vi.fn(),
    ...overrides,
  }
  render(
    <MantineProvider defaultColorScheme="dark">
      <EditModal {...props} />
    </MantineProvider>
  )
  return props
}

describe('EditModal', () => {
  it('renders the dialog with title', () => {
    renderModal()
    expect(screen.getByText('Edit Button')).toBeInTheDocument()
  })

  it('pre-fills primary text from button', () => {
    renderModal()
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument()
  })

  it('calls onSave with updated text when Save clicked', async () => {
    const { onSave } = renderModal()
    const input = screen.getByDisplayValue('Hello')
    fireEvent.change(input, { target: { value: 'Updated' } })
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ text: 'Updated' }))
    )
  })

  it('calls onClose when Cancel clicked', () => {
    const { onClose } = renderModal()
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('returns null when button is null', () => {
    const { container } = render(
      <MantineProvider defaultColorScheme="dark">
        <EditModal button={null} voices={[]} onSave={vi.fn()} onClose={vi.fn()} />
      </MantineProvider>
    )
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })
})
