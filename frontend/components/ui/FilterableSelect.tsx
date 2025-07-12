// components/ui/FilterableSelect.tsx
"use client"

import { useState } from "react"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"

type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export function FilterableSelect({ options, value, onChange, label }: Props) {
  const [search, setSearch] = useState("")

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input
        placeholder="Search users or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className="h-48 border rounded-md">
        <ul className="divide-y text-sm">
          {filtered.map((opt) => (
            <li
              key={opt.value}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                value === opt.value ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(opt.value)
                setSearch("") // Reset filter on select
              }}
            >
              {opt.label}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-center text-gray-400 py-2">No match found</li>
          )}
        </ul>
      </ScrollArea>
    </div>
  )
}
