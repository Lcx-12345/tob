import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Empty from '@/components/Empty'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: vi.fn()
}))

describe('Empty', () => {
  it('should render Empty text', () => {
    render(<Empty />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('should trigger toast on click', () => {
    render(<Empty />)
    fireEvent.click(screen.getByText('Empty'))
    expect(toast).toHaveBeenCalledWith('Coming soon')
  })
})
