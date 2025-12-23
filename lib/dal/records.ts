import { createClient } from "@/lib/supabase/server"

export interface DbRecord {
  id: string
  user_id: string
  object_key: string
  title: string | null
  properties: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ListRecordsOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDir?: "asc" | "desc"
}

/**
 * List records for a user and object type
 */
export async function listRecords(userId: string, objectKey: string, opts?: ListRecordsOptions): Promise<DbRecord[]> {
  const supabase = await createClient()

  let query = supabase.from("records").select("*").eq("user_id", userId).eq("object_key", objectKey)

  const orderBy = opts?.orderBy ?? "updated_at"
  const orderDir = opts?.orderDir ?? "desc"
  query = query.order(orderBy, { ascending: orderDir === "asc" })

  if (opts?.limit) {
    query = query.limit(opts.limit)
  }
  if (opts?.offset) {
    query = query.range(opts.offset, opts.offset + (opts.limit ?? 50) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data ?? []
}

/**
 * Get a single record by ID
 */
export async function getRecord(userId: string, recordId: string): Promise<DbRecord | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("records").select("*").eq("user_id", userId).eq("id", recordId).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

/**
 * Create a new record
 */
export async function createRecord(
  userId: string,
  objectKey: string,
  properties: Record<string, unknown>,
  title?: string,
): Promise<DbRecord> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("records")
    .insert({
      user_id: userId,
      object_key: objectKey,
      title: title ?? null,
      properties,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing record
 */
export async function updateRecord(
  userId: string,
  recordId: string,
  properties: Record<string, unknown>,
  title?: string,
): Promise<DbRecord> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    properties,
    updated_at: new Date().toISOString(),
  }
  if (title !== undefined) {
    updateData.title = title
  }

  const { data, error } = await supabase
    .from("records")
    .update(updateData)
    .eq("user_id", userId)
    .eq("id", recordId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Count records by object key for a user
 */
export async function countRecordsByObjectKey(userId: string): Promise<Record<string, number>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("records").select("object_key").eq("user_id", userId)

  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.object_key] = (counts[row.object_key] ?? 0) + 1
  }
  return counts
}
