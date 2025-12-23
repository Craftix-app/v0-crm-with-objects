/**
 * Generated Page JSON Schema
 * Defines the structure for AI-generated page configurations
 */

import { z } from "zod"
import { OBJECT_DEFINITIONS } from "./object-definitions"

// Valid object keys from enabled CRM objects
const VALID_OBJECT_KEYS = OBJECT_DEFINITIONS.filter((o) => o.enabled).map((o) => o.objectKey) as [string, ...string[]]

// Get valid property keys for an object
export function getValidPropertyKeys(objectKey: string): string[] {
  const def = OBJECT_DEFINITIONS.find((o) => o.objectKey === objectKey)
  return def ? def.properties.map((p) => p.key) : []
}

// Block types
const BlockTypeSchema = z.enum(["queryBar", "dataView", "detailPanel", "statSummary", "emptyState"])

// Filter operators
const FilterOpSchema = z.enum(["eq", "neq", "contains", "gt", "lt", "in"])

// Sort direction
const SortDirectionSchema = z.enum(["asc", "desc"])

// Block configs
const QueryBarConfigSchema = z.object({
  enabled: z.boolean(),
})

const DataViewConfigSchema = z.object({
  mode: z.enum(["table", "cards"]),
  fields: z.array(z.string()).min(1, "At least one field required"),
  sort: z
    .object({
      field: z.string(),
      direction: SortDirectionSchema,
    })
    .optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        op: FilterOpSchema,
        value: z.any(),
      }),
    )
    .optional(),
})

const DetailPanelConfigSchema = z.object({
  fields: z.array(z.string()).min(1, "At least one field required"),
})

const StatSummaryConfigSchema = z.object({
  stats: z
    .array(
      z.object({
        label: z.string(),
        field: z.string().optional(),
        op: z.enum(["count"]).optional(),
      }),
    )
    .min(1, "At least one stat required")
    .max(4, "Maximum 4 stats"),
})

const EmptyStateConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

// Block schema with discriminated union
const BlockSchema = z.discriminatedUnion("blockType", [
  z.object({
    blockType: z.literal("queryBar"),
    id: z.string(),
    config: QueryBarConfigSchema,
  }),
  z.object({
    blockType: z.literal("dataView"),
    id: z.string(),
    config: DataViewConfigSchema,
  }),
  z.object({
    blockType: z.literal("detailPanel"),
    id: z.string(),
    config: DetailPanelConfigSchema,
  }),
  z.object({
    blockType: z.literal("statSummary"),
    id: z.string(),
    config: StatSummaryConfigSchema,
  }),
  z.object({
    blockType: z.literal("emptyState"),
    id: z.string(),
    config: EmptyStateConfigSchema,
  }),
])

// Page template types
const TemplateSchema = z.enum(["list", "detail", "dashboard"])

// Main page schema
export const PageConfigSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    template: TemplateSchema,
    objectKey: z.enum(VALID_OBJECT_KEYS as [string, ...string[]]),
    blocks: z.array(BlockSchema).min(1, "At least one block required"),
  })
  .strict() // Reject unknown keys

// TypeScript types inferred from Zod schemas
export type PageConfig = z.infer<typeof PageConfigSchema>
export type Block = z.infer<typeof BlockSchema>
export type BlockType = z.infer<typeof BlockTypeSchema>
export type Template = z.infer<typeof TemplateSchema>
export type DataViewConfig = z.infer<typeof DataViewConfigSchema>
export type DetailPanelConfig = z.infer<typeof DetailPanelConfigSchema>
export type StatSummaryConfig = z.infer<typeof StatSummaryConfigSchema>
export type EmptyStateConfig = z.infer<typeof EmptyStateConfigSchema>
export type QueryBarConfig = z.infer<typeof QueryBarConfigSchema>

// Validation result type
export type ValidationResult = { valid: true; config: PageConfig } | { valid: false; errors: string[] }

// Validate page config with field existence checks
export function validatePageConfig(input: unknown): ValidationResult {
  // First, parse with Zod
  const result = PageConfigSchema.safeParse(input)

  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
    return { valid: false, errors }
  }

  const config = result.data
  const validFields = getValidPropertyKeys(config.objectKey)
  const fieldErrors: string[] = []

  // Validate fields in each block
  for (const block of config.blocks) {
    if (block.blockType === "dataView") {
      for (const field of block.config.fields) {
        if (!validFields.includes(field)) {
          fieldErrors.push(`Block "${block.id}": Unknown field "${field}" for object "${config.objectKey}"`)
        }
      }
      if (block.config.sort && !validFields.includes(block.config.sort.field)) {
        fieldErrors.push(
          `Block "${block.id}": Unknown sort field "${block.config.sort.field}" for object "${config.objectKey}"`,
        )
      }
      if (block.config.filters) {
        for (const filter of block.config.filters) {
          if (!validFields.includes(filter.field)) {
            fieldErrors.push(
              `Block "${block.id}": Unknown filter field "${filter.field}" for object "${config.objectKey}"`,
            )
          }
        }
      }
    }

    if (block.blockType === "detailPanel") {
      for (const field of block.config.fields) {
        if (!validFields.includes(field)) {
          fieldErrors.push(`Block "${block.id}": Unknown field "${field}" for object "${config.objectKey}"`)
        }
      }
    }

    if (block.blockType === "statSummary") {
      for (const stat of block.config.stats) {
        if (stat.field && !validFields.includes(stat.field)) {
          fieldErrors.push(`Block "${block.id}": Unknown stat field "${stat.field}" for object "${config.objectKey}"`)
        }
      }
    }
  }

  if (fieldErrors.length > 0) {
    return { valid: false, errors: fieldErrors }
  }

  return { valid: true, config }
}
