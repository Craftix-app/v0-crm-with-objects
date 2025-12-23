import { createClient } from "@/lib/supabase/server"

export interface DbRelationshipDefinition {
  key: string
  from_object_key: string
  to_object_key: string
  label: string
  description: string
}

export interface DbRelationship {
  id: string
  user_id: string
  relationship_key: string
  from_record_id: string
  to_record_id: string
  created_at: string
}

/**
 * List all relationship definitions
 */
export async function listRelationshipDefinitions(): Promise<DbRelationshipDefinition[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("relationship_definitions").select("*").order("key")

  if (error) throw error
  return data ?? []
}

/**
 * Create a relationship between two records
 */
export async function createRelationship(
  userId: string,
  relationshipKey: string,
  fromRecordId: string,
  toRecordId: string,
): Promise<DbRelationship> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("relationships")
    .insert({
      user_id: userId,
      relationship_key: relationshipKey,
      from_record_id: fromRecordId,
      to_record_id: toRecordId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * List relationships from a record
 */
export async function listRelationshipsFrom(userId: string, fromRecordId: string): Promise<DbRelationship[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("relationships")
    .select("*")
    .eq("user_id", userId)
    .eq("from_record_id", fromRecordId)

  if (error) throw error
  return data ?? []
}

/**
 * List relationships to a record
 */
export async function listRelationshipsTo(userId: string, toRecordId: string): Promise<DbRelationship[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("relationships")
    .select("*")
    .eq("user_id", userId)
    .eq("to_record_id", toRecordId)

  if (error) throw error
  return data ?? []
}

/**
 * Delete a relationship
 */
export async function deleteRelationship(userId: string, relationshipId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("relationships").delete().eq("user_id", userId).eq("id", relationshipId)

  if (error) throw error
}

/**
 * Count relationships for a user
 */
export async function countRelationships(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("relationships")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) throw error
  return count ?? 0
}
