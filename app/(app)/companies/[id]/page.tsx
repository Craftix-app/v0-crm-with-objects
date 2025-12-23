"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, X } from "lucide-react"
import { Stack, Panel, PageShell, Grid } from "@/components/primitives"
import { DetailPanelBlock } from "@/components/blocks"
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
import type { DbRecord } from "@/lib/dal/records"
import type { DbRelationship } from "@/lib/dal/relationships"
import { fetchRecord, editRecord, fetchRelationshipsTo } from "@/app/(app)/actions"

const OBJECT_KEY = "company"
const UNSUPPORTED_TYPES = ["owner", "company", "file", "richtext"]

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [record, setRecord] = useState<DbRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [relationsTo, setRelationsTo] = useState<DbRelationship[]>([])
  const [relatedRecords, setRelatedRecords] = useState<Record<string, DbRecord>>({})

  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === OBJECT_KEY)!

  useEffect(() => {
    loadRecord()
  }, [id])

  async function loadRecord() {
    setLoading(true)
    try {
      const data = await fetchRecord(id)
      setRecord(data)
      if (data) {
        setFormData(data.properties)
        await loadRelationships(data.id)
      }
    } catch (err) {
      console.error("Failed to load record:", err)
    } finally {
      setLoading(false)
    }
  }

  async function loadRelationships(recordId: string) {
    const to = await fetchRelationshipsTo(recordId)
    setRelationsTo(to)

    const relatedIds = to.map((r) => r.from_record_id)
    const uniqueIds = [...new Set(relatedIds)]
    const records: Record<string, DbRecord> = {}
    for (const rid of uniqueIds) {
      const rec = await fetchRecord(rid)
      if (rec) records[rid] = rec
    }
    setRelatedRecords(records)
  }

  async function handleSave() {
    if (!record) return
    setSubmitting(true)
    setError(null)

    const title = formData.name as string
    const result = await editRecord(record.id, OBJECT_KEY, formData, title)

    if (result.success) {
      setEditing(false)
      await loadRecord()
    } else {
      setError(result.error || "Failed to save")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <PageShell title="Loading...">
        <div className="flex items-center justify-center py-16 text-muted-foreground">Loading...</div>
      </PageShell>
    )
  }

  if (!record) {
    return (
      <PageShell
        title="Not Found"
        actions={
          <Button variant="outline" onClick={() => router.push("/companies")}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        }
      >
        <Panel>
          <p className="text-muted-foreground">Company not found.</p>
        </Panel>
      </PageShell>
    )
  }

  const displayTitle = record.title || (record.properties.name as string) || "Company"

  return (
    <PageShell
      title={displayTitle}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/companies")}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      }
    >
      <Grid cols={2} gap="lg">
        <Stack gap="md">
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{editing ? "Edit Company" : "Details"}</h3>
              {editing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(false)
                    setFormData(record.properties)
                    setError(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {editing ? (
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
                  <Button onClick={handleSave} disabled={submitting}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false)
                      setFormData(record.properties)
                      setError(null)
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Stack>
            ) : (
              <DetailPanelBlock
                fields={objectDef.properties
                  .filter((p) => record.properties[p.key] !== undefined && record.properties[p.key] !== "")
                  .map((p) => ({
                    label: p.label,
                    value: String(record.properties[p.key] ?? ""),
                  }))}
              />
            )}
          </Panel>
        </Stack>

        <Stack gap="md">
          <Panel variant="bordered">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Contacts at this Company</h3>
            {relationsTo.filter((r) => r.relationship_key === "contact_belongs_to_company").length === 0 ? (
              <p className="text-sm text-muted-foreground">No contacts linked.</p>
            ) : (
              relationsTo
                .filter((r) => r.relationship_key === "contact_belongs_to_company")
                .map((rel) => {
                  const related = relatedRecords[rel.from_record_id]
                  return (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span
                        className="text-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => router.push(`/contacts/${rel.from_record_id}`)}
                      >
                        {related?.title ||
                          `${related?.properties.firstName} ${related?.properties.lastName}` ||
                          rel.from_record_id}
                      </span>
                    </div>
                  )
                })
            )}
          </Panel>

          <Panel variant="bordered">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Tasks</h3>
            {relationsTo.filter((r) => r.relationship_key === "task_relates_to_company").length === 0 ? (
              <p className="text-sm text-muted-foreground">No related tasks.</p>
            ) : (
              relationsTo
                .filter((r) => r.relationship_key === "task_relates_to_company")
                .map((rel) => {
                  const related = relatedRecords[rel.from_record_id]
                  return (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span
                        className="text-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => router.push(`/tasks/${rel.from_record_id}`)}
                      >
                        {related?.title || rel.from_record_id}
                      </span>
                    </div>
                  )
                })
            )}
          </Panel>

          <Panel variant="bordered">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Documents</h3>
            {relationsTo.filter((r) => r.relationship_key === "document_relates_to_company").length === 0 ? (
              <p className="text-sm text-muted-foreground">No related documents.</p>
            ) : (
              relationsTo
                .filter((r) => r.relationship_key === "document_relates_to_company")
                .map((rel) => {
                  const related = relatedRecords[rel.from_record_id]
                  return (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span
                        className="text-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => router.push(`/documents/${rel.from_record_id}`)}
                      >
                        {related?.title || rel.from_record_id}
                      </span>
                    </div>
                  )
                })
            )}
          </Panel>
        </Stack>
      </Grid>
    </PageShell>
  )
}

function PropertyField({
  property,
  value,
  onChange,
}: {
  property: PropertyDefinition
  value: unknown
  onChange: (value: unknown) => void
}) {
  const isUnsupported = UNSUPPORTED_TYPES.includes(property.type)

  if (isUnsupported) {
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">{property.label}</Label>
        <Input disabled placeholder="Not available in MVP" className="opacity-50" />
      </div>
    )
  }

  switch (property.type) {
    case "textarea":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
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
              <SelectValue placeholder={`Select...`} />
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
    case "url":
      return (
        <div className="space-y-2">
          <Label>{property.label}</Label>
          <Input
            type="url"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://"
          />
        </div>
      )
    case "phone":
      return (
        <div className="space-y-2">
          <Label>{property.label}</Label>
          <Input type="tel" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    default:
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input type="text" value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
  }
}
