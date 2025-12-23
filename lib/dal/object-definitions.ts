import { createClient } from "@/lib/supabase/server"

export interface DbObjectDefinition {
  id: string
  user_id: string
  object_key: string
  label: string
  label_plural: string
  object_type_key: string
  enabled: boolean
  properties_schema: Record<string, unknown>[]
  created_at: string
  updated_at: string
}

/**
 * List all object definitions for a user
 */
export async function listObjectDefinitions(userId: string): Promise<DbObjectDefinition[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("object_definitions")
    .select("*")
    .eq("user_id", userId)
    .order("object_key")

  if (error) throw error
  return data ?? []
}

/**
 * Get a single object definition by key
 */
export async function getObjectDefinition(userId: string, objectKey: string): Promise<DbObjectDefinition | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("object_definitions")
    .select("*")
    .eq("user_id", userId)
    .eq("object_key", objectKey)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

/**
 * Upsert an object definition
 */
export async function upsertObjectDefinition(
  userId: string,
  objectDefinition: Omit<DbObjectDefinition, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<DbObjectDefinition> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("object_definitions")
    .upsert(
      {
        user_id: userId,
        object_key: objectDefinition.object_key,
        label: objectDefinition.label,
        label_plural: objectDefinition.label_plural,
        object_type_key: objectDefinition.object_type_key,
        enabled: objectDefinition.enabled,
        properties_schema: objectDefinition.properties_schema,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,object_key" },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
