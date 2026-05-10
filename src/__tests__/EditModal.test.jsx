import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EditModal from '../components/EditModal.jsx'

const mockButton = {
  id:          'xyz',
  text:        'Hello',
  lang:        'en-US',
  voiceURI:    '',
  color:       '#7c3aed',
  altText:     '',
  altLang:     '',
  altVoiceURI: '',
  altColor:    '#0ea5a4',
}

function renderModal(overrides = {}) {
  const props = {
    button:  mockButton,
    voices:  [],
    onSave:  vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  }
  return { ...render(<EditModal {...props} />), ...props }
}

describe('EditModal', () => {
  it('renders the dialog', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('pre-fills primary text from button', () => {
    renderModal()
    expect(screen.getByLabelText(/primary text/i).value).toBe('Hello')
  })

  it('calls onSave with updated text when Save clicked', () => {
    const { onSave } = renderModal()
    const input = screen.getByLabelText(/primary text/i)
    fireEvent.change(input, { target: { value: 'Updated' } })
    fireEvent.click(screen.getByText('Save'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ text: 'Updated' }))
  })

  it('calls onClose when Cancel clicked', () => {
    const { onClose } = renderModal()
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape pressed', () => {
    const { onClose } = renderModal()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('returns null when button is null', () => {
    const { container } = renderModal({ button: null })
    expect(container.firstChild).toBeNull()
  })
})
