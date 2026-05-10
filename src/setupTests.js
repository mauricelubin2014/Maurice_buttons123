import '@testing-library/jest-dom'

// Mantine requires window.matchMedia — jsdom doesn't provide it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener:         vi.fn(),
    removeListener:      vi.fn(),
    addEventListener:    vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent:       vi.fn(),
  })),
})

// Mantine ScrollArea requires ResizeObserver — jsdom doesn't provide it
global.ResizeObserver = class ResizeObserver {
  observe()   {}
  unobserve() {}
  disconnect(){}
}

// Mantine Popover / Tooltip requires IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe()   {}
  unobserve() {}
  disconnect(){}
}
