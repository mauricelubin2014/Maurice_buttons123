import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import App from '../App.jsx'

function renderApp() {
  return render(
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  )
}

beforeEach(() => {
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => [], speak: vi.fn(), cancel: vi.fn(), onvoiceschanged: null,
  })
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    constructor(text) { this.text = text }
  })
  localStorage.clear()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

describe('App integration', () => {
  it('renders the app heading', () => {
    renderApp()
    expect(screen.getByText(/colorful speak buttons/i)).toBeInTheDocument()
  })

  it('shows empty state before any button is added', () => {
    renderApp()
    expect(screen.getByText(/no buttons yet/i)).toBeInTheDocument()
  })

  it('adds a button and shows it in the grid', async () => {
    renderApp()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument())
  })

  it('persists buttons to localStorage', async () => {
    renderApp()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Persist me' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('customSpeakButtons_v1_realistic_color'))
      expect(stored).toHaveLength(1)
      expect(stored[0].text).toBe('Persist me')
    })
  })

  it('deletes a button', async () => {
    renderApp()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'To delete' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(screen.getByText('To delete')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => expect(screen.queryByText('To delete')).not.toBeInTheDocument())
  })

  it('opens edit modal when Edit clicked', async () => {
    renderApp()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Editable' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(screen.getByText('Editable')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Edit'))
    await waitFor(() => expect(screen.getByText('Edit Button')).toBeInTheDocument())
  })

  it('button count updates correctly', async () => {
    renderApp()
    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'One' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(screen.getByText('1 button')).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/primary text/i), { target: { value: 'Two' } })
    fireEvent.click(screen.getByText('+ Add Button'))
    await waitFor(() => expect(screen.getByText('2 buttons')).toBeInTheDocument())
  })
})
