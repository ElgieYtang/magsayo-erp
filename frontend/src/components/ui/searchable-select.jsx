import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Type to search...',
  emptyMessage = 'No matches found',
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const selected = options.find((option) => option.value === value)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options

    return options.filter((option) => {
      const haystack = (option.searchText ?? option.label).toLowerCase()
      return haystack.includes(needle)
    })
  }, [options, query])

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleSelect = (nextValue) => {
    onChange(nextValue)
    setOpen(false)
    setQuery('')
  }

  const displayValue = open ? query : selected?.label ?? ''

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-border-input bg-surface text-sm',
          open && 'border-maroon ring-2 ring-maroon-light',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-1 text-sm text-text-primary outline-none placeholder:text-text-secondary"
        />
        {value && !open ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setQuery('')
              setOpen(true)
              inputRef.current?.focus()
            }}
            className="rounded-md p-1 text-text-secondary hover:bg-maroon-light hover:text-maroon"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen((current) => !current)
            inputRef.current?.focus()
          }}
          className="rounded-md p-1 text-text-secondary hover:bg-maroon-light hover:text-maroon disabled:cursor-not-allowed"
          aria-label={open ? 'Close item list' : 'Open item list'}
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-[60] mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-text-secondary">{emptyMessage}</li>
          ) : (
            filtered.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-maroon-light/60',
                    option.value === value && 'bg-maroon-light font-medium text-maroon',
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
