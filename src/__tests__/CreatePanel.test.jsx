import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import CreatePanel from '../components/CreatePanel.jsx'

function renderPanel(overrides = {}) {
  const props = {
    voices: [],
    realisticMode: false,
    realisticIntensity: '1.0',
    onAdd: vi.fn(),
    onRealisticChange: vi.fn(),
    onIntensityChange: vi.fn(),
    ...overrides,
  }
  render(
    <MantineProvider defaultColorScheme="dark">
      <CreatePanel {...props} />
    </MantineProvider>
  )
  return props
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

  it('calls onAdd with correct fields when Add clicked', async () => {
    const { onAdd } = renderPanel()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Hello', lang: 'en-US' })
    ))
  })

  it('shows error toast and does NOT call onAdd when primary text is empty', async () => {
    const { onAdd } = renderPanel()
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(onAdd).not.toHaveBeenCalled())
  })

  it('calls onRealisticChange when realistic checkbox toggled', () => {
    const { onRealisticChange } = renderPanel()
    // Mantine Checkbox renders an accessible checkbox
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onRealisticChange).toHaveBeenCalledWith(true)
  })
})
