"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Stack, Panel, PageShell } from "@/components/primitives"
import { QueryBar, DataViewBlock } from "@/components/blocks"
import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/registry/controls"
import { OBJECT_DEFINITIONS } from "@/lib/object-definitions"
import type { PropertyDefinition } from "@/lib/property-types"
import { fetchRecords, addRecord } from "@/app/(app)/actions"
import type { DbRecord } from "@/lib/dal/records"

const OBJECT_KEY = "task"
const DISPLAY_FIELDS = ["title", "status", "priority", "dueDate"]
const UNSUPPORTED_TYPES = ["owner", "company", "file", "richtext"]

export default function TasksPage() {
  const router = useRouter()
  const [records, setRecords] = useState<DbRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === OBJECT_KEY)!

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    setLoading(true)
    try {
      const data = await fetchRecords(OBJECT_KEY)
      setRecords(data)
    } catch (err) {
      console.error("Failed to load records:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    const missingRequired = objectDef.properties
      .filter((p) => p.required && !UNSUPPORTED_TYPES.includes(p.type))
      .filter((p) => !formData[p.key] || formData[p.key] === "")

    if (missingRequired.length > 0) {
      setError(`Required fields missing: ${missingRequired.map((p) => p.label).join(", ")}`)
      return
    }

    setSubmitting(true)
    setError(null)

    const title = formData.title as string
    const result = await addRecord(OBJECT_KEY, formData, title)

    if (result.success) {
      setShowCreate(false)
      setFormData({})
      await loadRecords()
    } else {
      setError(result.error || "Failed to create record")
    }
    setSubmitting(false)
  }

  function handleRowClick(row: Record<string, unknown>) {
    router.push(`/tasks/${row.id}`)
  }

  const columns = DISPLAY_FIELDS.map((fieldKey) => {
    const prop = objectDef.properties.find((p) => p.key === fieldKey)
    return {
      key: fieldKey,
      label: prop?.label || fieldKey,
      type: prop?.type || ("text" as const),
      width: 180,
      options: prop?.options,
    }
  })

  const rows = records.map((record) => {
    const row: Record<string, unknown> = { id: record.id }
    DISPLAY_FIELDS.forEach((fieldKey) => {
      row[fieldKey] = record.properties[fieldKey] ?? ""
    })
    return row
  })

  return (
    <PageShell
      title="Tasks"
      actions={
        <Button onClick={() => setShowCreate(true)} disabled={showCreate}>
          <Plus className="w-4 h-4" />
          New {objectDef.label}
        </Button>
      }
    >
      <Stack gap="md">
        {showCreate && (
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">New {objectDef.label}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowCreate(false)
                  setFormData({})
                  setError(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Stack gap="md">
              {objectDef.properties.map((prop) => (
                <PropertyField
                  key={prop.key}
                  property={prop}
                  value={formData[prop.key]}
                  onChange={(value) => setFormData((prev) => ({ ...prev, [prop.key]: value }))}
                />
              ))}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Creating..." : `Create ${objectDef.label}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreate(false)
                    setFormData({})
                    setError(null)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </Stack>
          </Panel>
        )}

        <QueryBar />

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">Loading...</div>
        ) : (
          <DataViewBlock mode="table" columns={columns} rows={rows} onRowClick={handleRowClick} />
        )}
      </Stack>
    </PageShell>
  )
}

function PropertyField({
  property,
  value,
  onChange,
}: { property: PropertyDefinition; value: unknown; onChange: (value: unknown) => void }) {
  const isUnsupported = UNSUPPORTED_TYPES.includes(property.type)
  if (isUnsupported)
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">
          {property.label}
          {property.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input disabled placeholder="Not available in MVP" className="opacity-50" />
        <p className="text-xs text-muted-foreground">{property.type} fields are not yet supported.</p>
      </div>
    )

  switch (property.type) {
    case "textarea":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${property.label.toLowerCase()}`}
          />
        </div>
      )
    case "select":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select value={(value as string) || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${property.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    case "date":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input type="date" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case "datetime":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input type="datetime-local" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    default:
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${property.label.toLowerCase()}`}
          />
        </div>
      )
  }
}
