"use client"

import type React from "react"

import { Panel } from "@/components/primitives"
import { cn } from "@/lib/utils"
import { useState, useRef, useCallback } from "react"

export type PropertyType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "boolean"
  | "select"
  | "multiselect"
  | "url"
  | "email"
  | "phone"
  | "owner"
  | "company"
  | "file"
  | "richtext"

type SortDirection = "asc" | "desc" | null

type TableColumn = {
  key: string
  label: string
  type?: PropertyType
  width?: number // explicit width in px
  options?: string[] // for select/multiselect
}

type TableRow = Record<string, any>

type CardItem = {
  id: string
  title: string
  subtitle?: string
  metadata?: string
}

interface DataViewBlockProps {
  mode: "table" | "cards"
  columns?: TableColumn[]
  rows?: TableRow[]
  items?: CardItem[]
  className?: string
  onRowClick?: (row: TableRow) => void
}

export function DataViewBlock({
  mode,
  columns = [],
  rows = [],
  items = [],
  className,
  onRowClick,
}: DataViewBlockProps) {
  const isEmpty = mode === "table" ? rows.length === 0 : items.length === 0

  if (isEmpty) {
    return (
      <Panel className={cn("flex flex-col items-center justify-center py-16", className)}>
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl text-muted-foreground">∅</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No data available</h3>
        <p className="text-sm text-muted-foreground">There are no records to display.</p>
      </Panel>
    )
  }

  if (mode === "table") {
    return <DataTable columns={columns} rows={rows} className={className} onRowClick={onRowClick} />
  }

  // Cards mode
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item) => (
        <Panel key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
          {item.subtitle && <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>}
          {item.metadata && <p className="text-xs text-muted-foreground">{item.metadata}</p>}
        </Panel>
      ))}
    </div>
  )
}

function DataTable({
  columns,
  rows,
  className,
  onRowClick,
}: {
  columns: TableColumn[]
  rows: TableRow[]
  className?: string
  onRowClick?: (row: TableRow) => void
}) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {}
    columns.forEach((col) => {
      widths[col.key] = col.width || 200 // default 200px
    })
    return widths
  })
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [activeCell, setActiveCell] = useState<{ rowIdx: number; colKey: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; colKey: string } | null>(null)
  const [tableData, setTableData] = useState<TableRow[]>(rows)
  const [editValue, setEditValue] = useState<string>("")

  const resizingRef = useRef<{ colKey: string; startX: number; startWidth: number } | null>(null)

  const sortedRows = [...tableData].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal == null) return 1
    if (bVal == null) return -1
    const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDirection === "asc" ? compare : -compare
  })

  const handleHeaderClick = (colKey: string) => {
    if (sortKey === colKey) {
      if (sortDirection === "asc") setSortDirection("desc")
      else if (sortDirection === "desc") {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(colKey)
      setSortDirection("asc")
    }
  }

  const handleResizeStart = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault()
    e.stopPropagation()
    resizingRef.current = {
      colKey,
      startX: e.clientX,
      startWidth: columnWidths[colKey],
    }
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return
    const { colKey, startX, startWidth } = resizingRef.current
    const diff = e.clientX - startX
    const newWidth = Math.max(80, startWidth + diff)
    setColumnWidths((prev) => ({ ...prev, [colKey]: newWidth }))
  }, [])

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = null
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }, [handleResizeMove])

  const handleCellClick = (rowIdx: number, colKey: string) => {
    setActiveCell({ rowIdx, colKey })
  }

  const handleCellDoubleClick = (rowIdx: number, colKey: string, col: TableColumn) => {
    const editableTypes: PropertyType[] = ["text", "number", "select", "boolean"]
    if (!editableTypes.includes(col.type || "text")) return
    setEditingCell({ rowIdx, colKey })
    setEditValue(String(sortedRows[rowIdx][colKey] || ""))
  }

  const saveEdit = () => {
    if (!editingCell) return
    const { rowIdx, colKey } = editingCell
    const col = columns.find((c) => c.key === colKey)
    let finalValue: any = editValue

    if (col?.type === "number" || col?.type === "currency") {
      finalValue = Number.parseFloat(editValue) || 0
    } else if (col?.type === "boolean") {
      finalValue = editValue === "true"
    }

    setTableData((prev) => prev.map((row, idx) => (idx === rowIdx ? { ...row, [colKey]: finalValue } : row)))
    setEditingCell(null)
    setEditValue("")
  }

  const formatCellValue = (value: any, col: TableColumn) => {
    if (value == null) return "—"
    switch (col.type) {
      case "date":
        return new Date(value).toLocaleDateString()
      case "datetime":
        return new Date(value).toLocaleString()
      case "boolean":
        return value ? "✓" : "✗"
      case "currency":
        return `$${Number(value).toLocaleString()}`
      case "number":
        return Number(value).toLocaleString()
      case "multiselect":
        return Array.isArray(value) ? value.join(", ") : value
      case "url":
        return (
          <a href={value} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        )
      case "email":
        return (
          <a href={`mailto:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        )
      case "phone":
        return (
          <a href={`tel:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        )
      default:
        return String(value)
    }
  }

  const renderEditor = (rowIdx: number, colKey: string, col: TableColumn) => {
    if (col.type === "select" && col.options) {
      return (
        <select
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit()
            if (e.key === "Escape") {
              setEditingCell(null)
              setEditValue("")
            }
          }}
          className="w-full bg-background border border-ring rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {col.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }

    if (col.type === "boolean") {
      return (
        <select
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit()
            if (e.key === "Escape") {
              setEditingCell(null)
              setEditValue("")
            }
          }}
          className="w-full bg-background border border-ring rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="true">✓</option>
          <option value="false">✗</option>
        </select>
      )
    }

    return (
      <input
        autoFocus
        type={col.type === "number" || col.type === "currency" ? "number" : "text"}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={saveEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") saveEdit()
          if (e.key === "Escape") {
            setEditingCell(null)
            setEditValue("")
          }
        }}
        className="w-full bg-background border border-ring rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    )
  }

  return (
    <Panel className={cn("overflow-hidden p-0", className)}>
      <div className="w-full max-w-full overflow-x-auto">
        <table className="min-w-max border-collapse">
          <thead className="border-b border-border bg-muted/50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: columnWidths[col.key] }}
                  className="relative px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors select-none"
                  onClick={() => handleHeaderClick(col.key)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{col.label}</span>
                    {sortKey === col.key && (
                      <span className="text-foreground">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                  <div
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-ring/50 active:bg-ring"
                    onMouseDown={(e) => handleResizeStart(e, col.key)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {sortedRows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn("hover:bg-muted/30 transition-colors", onRowClick && "cursor-pointer")}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => {
                  const isActive = activeCell?.rowIdx === rowIdx && activeCell?.colKey === col.key
                  const isEditing = editingCell?.rowIdx === rowIdx && editingCell?.colKey === col.key

                  return (
                    <td
                      key={col.key}
                      style={{ width: columnWidths[col.key] }}
                      className={cn(
                        "px-4 py-3 text-sm text-foreground relative",
                        isActive && "ring-2 ring-ring ring-inset",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCellClick(rowIdx, col.key)
                      }}
                      onDoubleClick={() => handleCellDoubleClick(rowIdx, col.key, col)}
                    >
                      {isEditing ? renderEditor(rowIdx, col.key, col) : formatCellValue(row[col.key], col)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
