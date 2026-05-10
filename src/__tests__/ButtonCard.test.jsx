import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ButtonCard from '../components/ButtonCard.jsx'
import * as speechModule from '../utils/speech.js'

const mockButton = {
  id:         'abc123',
  text:       'Hello',
  lang:       'en-US',
  voiceURI:   '',
  color:      '#7c3aed',
  altText:    'שלום',
  altLang:    'he-IL',
  altVoiceURI:'',
  altColor:   '#0ea5a4',
}

describe('ButtonCard', () => {
  const onEdit   = vi.fn()
  const onDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  function renderCard(overrides = {}) {
    return render(
      <ButtonCard
        button={{ ...mockButton, ...overrides }}
        realisticMode={false}
        realisticIntensity="1.0"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }

  it('renders primary text', () => {
    renderCard()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders alternate text with ⇄ prefix', () => {
    renderCard()
    expect(screen.getByText(/⇄ שלום/)).toBeInTheDocument()
  })

  it('renders language badge EN', () => {
    renderCard()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('calls onEdit with button id when Edit clicked', () => {
    renderCard()
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith('abc123')
  })

  it('calls onDelete after confirmation', () => {
    renderCard()
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('abc123')
  })

  it('does NOT call onDelete when confirmation cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderCard()
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('calls speakText when Play clicked', () => {
    const spy = vi.spyOn(speechModule, 'speakText').mockResolvedValue()
    renderCard()
    fireEvent.click(screen.getByText('🔊 Play'))
    expect(spy).toHaveBeenCalledWith('Hello', 'en-US', '', expect.any(Object))
  })

  it('disables Alt button when no altText', () => {
    renderCard({ altText: '' })
    expect(screen.getByText('🔁 Alt')).toBeDisabled()
  })

  it('does not render ⇄ section when no altText', () => {
    renderCard({ altText: '' })
    expect(screen.queryByText(/⇄/)).not.toBeInTheDocument()
  })
})
