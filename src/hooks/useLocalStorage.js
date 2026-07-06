import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }

    const stored = window.localStorage.getItem(key)
    if (stored != null) {
      try {
        return JSON.parse(stored)
      } catch {
        return stored
      }
    }

    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
