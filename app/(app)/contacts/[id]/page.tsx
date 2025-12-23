"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, X, Plus, Trash2 } from "lucide-react"
import { Stack, Panel, PageShell, Grid } from "@/components/primitives"
import { DetailPanelBlock } from "@/components/blocks"
import {
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/registry/controls"
import { OBJECT_DEFINITIONS } from "@/lib/object-definitions"
import { RELATIONSHIP_DEFINITIONS } from "@/lib/relationships"
import type { PropertyDefinition } from "@/lib/property-types"
import type { DbRecord } from "@/lib/dal/records"
import type { DbRelationship } from "@/lib/dal/relationships"
import {
  fetchRecord,
  editRecord,
  fetchRecords,
  fetchRelationshipsFrom,
  fetchRelationshipsTo,
  addRelationship,
  removeRelationship,
} from "@/app/(app)/actions"

const OBJECT_KEY = "contact"
const UNSUPPORTED_TYPES = ["owner", "company", "file", "richtext"]

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [record, setRecord] = useState<DbRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Relationships state
  const [relationsFrom, setRelationsFrom] = useState<DbRelationship[]>([])
  const [relationsTo, setRelationsTo] = useState<DbRelationship[]>([])
  const [relatedRecords, setRelatedRecords] = useState<Record<string, DbRecord>>({})
  const [companies, setCompanies] = useState<DbRecord[]>([])
  const [addingRelation, setAddingRelation] = useState<string | null>(null)
  const [selectedRelationTarget, setSelectedRelationTarget] = useState<string>("")

  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === OBJECT_KEY)!

  useEffect(() => {
    loadRecord()
    loadCompanies()
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

  async function loadCompanies() {
    const data = await fetchRecords("company")
    setCompanies(data)
  }

  async function loadRelationships(recordId: string) {
    const [from, to] = await Promise.all([fetchRelationshipsFrom(recordId), fetchRelationshipsTo(recordId)])
    setRelationsFrom(from)
    setRelationsTo(to)

    // Load related record details
    const relatedIds = [...from.map((r) => r.to_record_id), ...to.map((r) => r.from_record_id)]
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

    const title = `${formData.firstName || ""} ${formData.lastName || ""}`.trim()
    const result = await editRecord(record.id, OBJECT_KEY, formData, title)

    if (result.success) {
      setEditing(false)
      await loadRecord()
    } else {
      setError(result.error || "Failed to save")
    }
    setSubmitting(false)
  }

  async function handleAddRelation(relationshipKey: string) {
    if (!selectedRelationTarget || !record) return
    const result = await addRelationship(relationshipKey, record.id, selectedRelationTarget)
    if (result.success) {
      setAddingRelation(null)
      setSelectedRelationTarget("")
      await loadRelationships(record.id)
    }
  }

  async function handleRemoveRelation(relationshipId: string) {
    const result = await removeRelationship(relationshipId)
    if (result.success && record) {
      await loadRelationships(record.id)
    }
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
          <Button variant="outline" onClick={() => router.push("/contacts")}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        }
      >
        <Panel>
          <p className="text-muted-foreground">Contact not found.</p>
        </Panel>
      </PageShell>
    )
  }

  const displayTitle = record.title || `${record.properties.firstName || ""} ${record.properties.lastName || ""}`.trim()

  // Available relationship types for contacts
  const availableRelationships = RELATIONSHIP_DEFINITIONS.filter((r) => r.fromObjectKey === OBJECT_KEY)

  return (
    <PageShell
      title={displayTitle}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/contacts")}>
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
        {/* Left column: Details/Edit */}
        <Stack gap="md">
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{editing ? "Edit Contact" : "Details"}</h3>
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

        {/* Right column: Associations */}
        <Stack gap="md">
          <Panel variant="bordered">
            <h3 className="text-lg font-semibold text-foreground mb-4">Associations</h3>

            {/* Company association */}
            <Stack gap="md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Company</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAddingRelation(
                        addingRelation === "contact_belongs_to_company" ? null : "contact_belongs_to_company",
                      )
                    }
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>

                {addingRelation === "contact_belongs_to_company" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Select value={selectedRelationTarget} onValueChange={setSelectedRelationTarget}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select company..." />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title || c.properties.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleAddRelation("contact_belongs_to_company")}>
                      Add
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAddingRelation(null)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {relationsFrom
                  .filter((r) => r.relationship_key === "contact_belongs_to_company")
                  .map((rel) => {
                    const related = relatedRecords[rel.to_record_id]
                    return (
                      <div
                        key={rel.id}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span
                          className="text-sm text-foreground cursor-pointer hover:underline"
                          onClick={() => router.push(`/companies/${rel.to_record_id}`)}
                        >
                          {related?.title || related?.properties.name || rel.to_record_id}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRelation(rel.id)}>
                          <Trash2 className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                    )
                  })}

                {relationsFrom.filter((r) => r.relationship_key === "contact_belongs_to_company").length === 0 &&
                  addingRelation !== "contact_belongs_to_company" && (
                    <p className="text-sm text-muted-foreground">No company linked.</p>
                  )}
              </div>
            </Stack>
          </Panel>

          {/* Related Tasks and Documents (inbound) */}
          <Panel variant="bordered">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Tasks</h3>
            {relationsTo.filter((r) => r.relationship_key === "task_relates_to_contact").length === 0 ? (
              <p className="text-sm text-muted-foreground">No related tasks.</p>
            ) : (
              relationsTo
                .filter((r) => r.relationship_key === "task_relates_to_contact")
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
                        {related?.title || related?.properties.title || rel.from_record_id}
                      </span>
                    </div>
                  )
                })
            )}
          </Panel>

          <Panel variant="bordered">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Documents</h3>
            {relationsTo.filter((r) => r.relationship_key === "document_relates_to_contact").length === 0 ? (
              <p className="text-sm text-muted-foreground">No related documents.</p>
            ) : (
              relationsTo
                .filter((r) => r.relationship_key === "document_relates_to_contact")
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
                        {related?.title || related?.properties.title || rel.from_record_id}
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
        <Label className="text-muted-foreground">
          {property.label}
          {property.required && <span className="text-destructive ml-1">*</span>}
        </Label>
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
    case "boolean":
      return (
        <div className="flex items-center gap-3">
          <Checkbox
            id={property.key}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <Label htmlFor={property.key} className="cursor-pointer">
            {property.label}
          </Label>
        </div>
      )
    case "email":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="email"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${property.label.toLowerCase()}`}
          />
        </div>
      )
    case "phone":
      return (
        <div className="space-y-2">
          <Label>
            {property.label}
            {property.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="tel"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${property.label.toLowerCase()}`}
          />
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
