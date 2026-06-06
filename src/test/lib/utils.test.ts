import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('should merge multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional class names with clsx', () => {
    const isActive = true
    const isDisabled = false
    expect(
      cn('base', isActive && 'active', isDisabled && 'disabled')
    ).toBe('base active')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle empty arguments', () => {
    expect(cn()).toBe('')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })

  it('should handle object syntax from clsx', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('should handle array syntax from clsx', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
  })
})
