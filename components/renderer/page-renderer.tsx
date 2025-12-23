"use client"

import { useEffect, useState } from "react"
import { PageShell, Stack, Panel, EmptyState } from "@/components/primitives"
import { QueryBar } from "@/components/blocks/query-bar"
import { DataViewBlock } from "@/components/blocks/data-view-block"
import { DetailPanelBlock } from "@/components/blocks/detail-panel-block"
import { StatSummaryRow } from "@/components/blocks/stat-summary-row"
import { AlertTriangle, FileWarning } from "lucide-react"
import { validatePageConfig, type PageConfig, type ValidationResult, type Block } from "@/lib/page-schema"
import { OBJECT_DEFINITIONS } from "@/lib/object-definitions"
import { fetchRecords, fetchRecord } from "@/app/(app)/actions"
import type { DbRecord } from "@/lib/dal/records"

interface PageRendererProps {
  config: unknown
  recordId?: string // For detail template
}

function isValidUUID(id?: string): boolean {
  if (!id) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export function PageRenderer({ config, recordId }: PageRendererProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [records, setRecords] = useState<DbRecord[]>([])
  const [record, setRecord] = useState<DbRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validate on mount
  useEffect(() => {
    const result = validatePageConfig(config)
    setValidation(result)
  }, [config])

  // Fetch data when validation passes
  useEffect(() => {
    if (!validation || !validation.valid) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        const cfg = validation.config

        if (cfg.template === "detail") {
          if (!recordId || !isValidUUID(recordId)) {
            // Show preview state with mock data instead of fetching
            setRecord({
              id: "preview",
              object_key: cfg.objectKey,
              user_id: "00000000-0000-0000-0000-000000000001",
              properties: Object.fromEntries(
                cfg.blocks
                  .filter((b) => b.blockType === "detailPanel")
                  .flatMap((b) => b.config.fields || [])
                  .map((field) => [field, `[Preview: ${field}]`]),
              ),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            setLoading(false)
            return
          }

          const rec = await fetchRecord(recordId)
          if (!rec) {
            setError(`Record not found: ${recordId}`)
          } else {
            setRecord(rec)
          }
        } else {
          const recs = await fetchRecords(cfg.objectKey)
          setRecords(recs)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [validation, recordId])

  // Render error state for invalid config
  if (validation && !validation.valid) {
    return (
      <Panel className="bg-destructive/10 border-destructive">
        <Stack gap="md">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Invalid Page Configuration</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
            {validation.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </Stack>
      </Panel>
    )
  }

  // Loading state
  if (loading || !validation) {
    return (
      <Panel className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading...</p>
      </Panel>
    )
  }

  // Data error state
  if (error) {
    return (
      <Panel className="bg-destructive/10 border-destructive">
        <Stack gap="md">
          <div className="flex items-center gap-2 text-destructive">
            <FileWarning className="w-5 h-5" />
            <h3 className="font-semibold">Data Error</h3>
          </div>
          <p className="text-sm text-destructive">{error}</p>
        </Stack>
      </Panel>
    )
  }

  const cfg = validation.config

  // Render based on template
  return (
    <PageShell title={cfg.title}>
      <Stack gap="lg">
        {cfg.template === "list" && <ListTemplate config={cfg} records={records} />}
        {cfg.template === "detail" && <DetailTemplate config={cfg} record={record} />}
        {cfg.template === "dashboard" && <DashboardTemplate config={cfg} records={records} />}
      </Stack>
    </PageShell>
  )
}

// List template: QueryBar + DataViewBlock
function ListTemplate({ config, records }: { config: PageConfig; records: DbRecord[] }) {
  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === config.objectKey)

  return (
    <>
      {config.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} records={records} objectDef={objectDef} />
      ))}
    </>
  )
}

// Detail template: DetailPanelBlock
function DetailTemplate({ config, record }: { config: PageConfig; record: DbRecord | null }) {
  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === config.objectKey)

  if (!record) {
    return (
      <EmptyState icon={FileWarning} title="Record not found" description="The requested record could not be found." />
    )
  }

  return (
    <>
      {config.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} record={record} objectDef={objectDef} />
      ))}
    </>
  )
}

// Dashboard template: StatSummaryRow + DataViewBlock
function DashboardTemplate({ config, records }: { config: PageConfig; records: DbRecord[] }) {
  const objectDef = OBJECT_DEFINITIONS.find((o) => o.objectKey === config.objectKey)

  return (
    <>
      {config.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} records={records} objectDef={objectDef} />
      ))}
    </>
  )
}

// Block renderer - renders individual blocks based on type
function BlockRenderer({
  block,
  records = [],
  record,
  objectDef,
}: {
  block: Block
  records?: DbRecord[]
  record?: DbRecord | null
  objectDef?: (typeof OBJECT_DEFINITIONS)[number]
}) {
  switch (block.blockType) {
    case "queryBar":
      return block.config.enabled ? <QueryBar /> : null

    case "dataView": {
      const { mode, fields, sort } = block.config

      // Build columns from fields
      const columns = fields.map((fieldKey) => {
        const propDef = objectDef?.properties.find((p) => p.key === fieldKey)
        return {
          key: fieldKey,
          label: propDef?.label || fieldKey,
          type: propDef?.type,
          options: propDef?.options,
        }
      })

      // Build rows from records
      let rows = records.map((rec) => ({
        id: rec.id,
        ...Object.fromEntries(fields.map((f) => [f, rec.properties?.[f] ?? "—"])),
      }))

      // Apply sort if specified
      if (sort) {
        rows = [...rows].sort((a, b) => {
          const aVal = a[sort.field]
          const bVal = b[sort.field]
          if (aVal == null) return 1
          if (bVal == null) return -1
          const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          return sort.direction === "asc" ? compare : -compare
        })
      }

      return <DataViewBlock mode={mode} columns={columns} rows={rows} />
    }

    case "detailPanel": {
      if (!record) return null

      const fields = block.config.fields.map((fieldKey) => {
        const propDef = objectDef?.properties.find((p) => p.key === fieldKey)
        return {
          label: propDef?.label || fieldKey,
          value: record.properties?.[fieldKey] ?? "—",
        }
      })

      return <DetailPanelBlock fields={fields} />
    }

    case "statSummary": {
      const stats = block.config.stats.map((stat) => {
        let value: string | number = "—"

        if (stat.op === "count") {
          value = records.length
        } else if (stat.field) {
          // For MVP, just show count of non-null values
          value = records.filter((r) => r.properties?.[stat.field!] != null).length
        }

        return { label: stat.label, value }
      })

      return <StatSummaryRow stats={stats} />
    }

    case "emptyState":
      return <EmptyState icon={FileWarning} title={block.config.title} description={block.config.description || ""} />

    default:
      return null
  }
}
