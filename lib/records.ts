/**
 * Unified Record Model
 * Base record type for all CRM objects
 */

export interface BaseRecord {
  id: string
  userId: string
  objectKey: string
  title?: string
  properties: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Helper type for creating records with specific property types
 */
export type TypedRecord<T extends Record<string, unknown>> = Omit<BaseRecord, "properties"> & {
  properties: T
}
