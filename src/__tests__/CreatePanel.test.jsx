import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CreatePanel from '../components/CreatePanel.jsx'

const noopVoices = []

function renderPanel(overrides = {}) {
  const props = {
    voices:             noopVoices,
    realisticMode:      false,
    realisticIntensity: '1.0',
    onAdd:              vi.fn(),
    onPreview:          vi.fn(),
    onRealisticChange:  vi.fn(),
    onIntensityChange:  vi.fn(),
    ...overrides,
  }
  return { ...render(<CreatePanel {...props} />), ...props }
}

describe('CreatePanel', () => {
  it('renders the primary text input', () => {
    renderPanel()
    expect(screen.getByLabelText(/primary text/i)).toBeInTheDocument()
  })

  it('renders + Add Button', () => {
    renderPanel()
    expect(screen.getByText('+ Add Button')).toBeInTheDocument()
  })

  it('calls onAdd with correct fields when Add clicked', () => {
    const { onAdd } = renderPanel()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Hello', lang: 'en-US' })
    )
  })

  it('does NOT call onAdd when primary text is empty', () => {
    const { onAdd } = renderPanel()
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onAdd on Enter key in primary text', () => {
    const { onAdd } = renderPanel()
    const input = screen.getByLabelText(/primary text/i)
    fireEvent.change(input, { target: { value: 'Testing' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onAdd).toHaveBeenCalled()
  })

  it('clears primary text after successful add', () => {
    renderPanel()
    const input = screen.getByLabelText(/primary text/i)
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(input.value).toBe('')
  })

  it('calls onPreview when Play Preview (primary) clicked with text', () => {
    const { onPreview } = renderPanel()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByText(/play preview \(primary\)/i))
    expect(onPreview).toHaveBeenCalled()
  })

  it('calls onRealisticChange when realistic checkbox toggled', () => {
    const { onRealisticChange } = renderPanel()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onRealisticChange).toHaveBeenCalledWith(true)
  })
})
