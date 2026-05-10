import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'

// Mock speechSynthesis so tests pass without a real browser
beforeEach(() => {
  vi.stubGlobal('speechSynthesis', {
    getVoices:       () => [],
    speak:           vi.fn(),
    cancel:          vi.fn(),
    onvoiceschanged: null,
  })
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    constructor(text) { this.text = text }
  })
  localStorage.clear()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

describe('App integration', () => {
  it('renders the app heading', () => {
    render(<App />)
    expect(screen.getByText(/colorful speak buttons/i)).toBeInTheDocument()
  })

  it('shows empty state message before any button is added', () => {
    render(<App />)
    expect(screen.getByText(/no buttons yet/i)).toBeInTheDocument()
  })

  it('adds a button and shows it in the grid', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('persists buttons to localStorage', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Persist me' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    const stored = JSON.parse(localStorage.getItem('customSpeakButtons_v1_realistic_color'))
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Persist me')
  })

  it('deletes a button', async () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'To delete' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(screen.getByText('To delete')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => expect(screen.queryByText('To delete')).not.toBeInTheDocument())
  })

  it('edits a button via the modal', async () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Original' } })
    fireEvent.click(screen.getByText('+ Add Button'))

    fireEvent.click(screen.getByText('Edit'))

    const modalInput = screen.getByRole('dialog').querySelector('input[type="text"]')
    fireEvent.change(modalInput, { target: { value: 'Updated' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument()
      expect(screen.queryByText('Original')).not.toBeInTheDocument()
    })
  })

  it('button count updates correctly', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'One' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(screen.getByText('1 button')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Two' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    expect(screen.getByText('2 buttons')).toBeInTheDocument()
  })
})
