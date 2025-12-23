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
import {
  fetchRecord,
  editRecord,
  fetchRecords,
  fetchRelationshipsFrom,
  addRelationship,
  removeRelationship,
} from "@/app/(app)/actions"

const OBJECT_KEY = "document"
const UNSUPPORTED_TYPES = ["owner", "company", "file", "richtext"]

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [record, setRecord] = useState<DbRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [relationsFrom, setRelationsFrom] = useState<DbRelationship[]>([])
  const [relatedRecords, setRelatedRecords] = useState<Record<string, DbRecord>>({})
  const [contacts, setContacts] = useState<DbRecord[]>([])
  const [companies, setCompanies] = useState<DbRecord[]>([])
  const [tasks, setTasks] = useState<DbRecord[]>([])
  const [addingRelation, setAddingRelation] = useState<string | null>(null)
  const [selectedRelationTarget, setSelectedRelationTarget] = useState<string>("")

  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === OBJECT_KEY)!

  useEffect(() => {
    loadRecord()
    loadRelatedOptions()
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

  async function loadRelatedOptions() {
    const [c, co, t] = await Promise.all([fetchRecords("contact"), fetchRecords("company"), fetchRecords("task")])
    setContacts(c)
    setCompanies(co)
    setTasks(t)
  }

  async function loadRelationships(recordId: string) {
    const from = await fetchRelationshipsFrom(recordId)
    setRelationsFrom(from)

    const relatedIds = from.map((r) => r.to_record_id)
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

    const title = formData.title as string
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
          <Button variant="outline" onClick={() => router.push("/documents")}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        }
      >
        <Panel>
          <p className="text-muted-foreground">Document not found.</p>
        </Panel>
      </PageShell>
    )
  }

  const displayTitle = record.title || (record.properties.title as string) || "Document"

  return (
    <PageShell
      title={displayTitle}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/documents")}>
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
              <h3 className="text-lg font-semibold text-foreground">{editing ? "Edit Document" : "Details"}</h3>
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
                  .filter(
                    (p) =>
                      record.properties[p.key] !== undefined &&
                      record.properties[p.key] !== "" &&
                      !UNSUPPORTED_TYPES.includes(p.type),
                  )
                  .map((p) => ({ label: p.label, value: String(record.properties[p.key] ?? "") }))}
              />
            )}
          </Panel>
        </Stack>

        <Stack gap="md">
          {/* Related Contact */}
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Related Contact</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAddingRelation(
                    addingRelation === "document_relates_to_contact" ? null : "document_relates_to_contact",
                  )
                }
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            {addingRelation === "document_relates_to_contact" && (
              <div className="flex items-center gap-2 mb-2">
                <Select value={selectedRelationTarget} onValueChange={setSelectedRelationTarget}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select contact..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title || `${c.properties.firstName} ${c.properties.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={() => handleAddRelation("document_relates_to_contact")}>
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingRelation(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {relationsFrom
              .filter((r) => r.relationship_key === "document_relates_to_contact")
              .map((rel) => {
                const related = relatedRecords[rel.to_record_id]
                return (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span
                      className="text-sm text-foreground cursor-pointer hover:underline"
                      onClick={() => router.push(`/contacts/${rel.to_record_id}`)}
                    >
                      {related?.title ||
                        `${related?.properties.firstName} ${related?.properties.lastName}` ||
                        rel.to_record_id}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRelation(rel.id)}>
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                )
              })}
            {relationsFrom.filter((r) => r.relationship_key === "document_relates_to_contact").length === 0 &&
              addingRelation !== "document_relates_to_contact" && (
                <p className="text-sm text-muted-foreground">No contact linked.</p>
              )}
          </Panel>

          {/* Related Company */}
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Related Company</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAddingRelation(
                    addingRelation === "document_relates_to_company" ? null : "document_relates_to_company",
                  )
                }
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            {addingRelation === "document_relates_to_company" && (
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
                <Button size="sm" onClick={() => handleAddRelation("document_relates_to_company")}>
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingRelation(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {relationsFrom
              .filter((r) => r.relationship_key === "document_relates_to_company")
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
            {relationsFrom.filter((r) => r.relationship_key === "document_relates_to_company").length === 0 &&
              addingRelation !== "document_relates_to_company" && (
                <p className="text-sm text-muted-foreground">No company linked.</p>
              )}
          </Panel>

          {/* Linked Task */}
          <Panel variant="bordered">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Linked Task</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAddingRelation(addingRelation === "document_links_to_task" ? null : "document_links_to_task")
                }
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            {addingRelation === "document_links_to_task" && (
              <div className="flex items-center gap-2 mb-2">
                <Select value={selectedRelationTarget} onValueChange={setSelectedRelationTarget}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select task..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title || t.properties.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={() => handleAddRelation("document_links_to_task")}>
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingRelation(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {relationsFrom
              .filter((r) => r.relationship_key === "document_links_to_task")
              .map((rel) => {
                const related = relatedRecords[rel.to_record_id]
                return (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span
                      className="text-sm text-foreground cursor-pointer hover:underline"
                      onClick={() => router.push(`/tasks/${rel.to_record_id}`)}
                    >
                      {related?.title || related?.properties.title || rel.to_record_id}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRelation(rel.id)}>
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                )
              })}
            {relationsFrom.filter((r) => r.relationship_key === "document_links_to_task").length === 0 &&
              addingRelation !== "document_links_to_task" && (
                <p className="text-sm text-muted-foreground">No task linked.</p>
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
}: { property: PropertyDefinition; value: unknown; onChange: (value: unknown) => void }) {
  const isUnsupported = UNSUPPORTED_TYPES.includes(property.type)
  if (isUnsupported)
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">{property.label}</Label>
        <Input disabled placeholder="Not available in MVP" className="opacity-50" />
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
              <SelectValue placeholder="Select..." />
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
