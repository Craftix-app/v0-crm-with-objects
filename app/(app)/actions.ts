"use server"

import { createRecord, listRecords, getRecord, updateRecord, type DbRecord } from "@/lib/dal/records"
import {
  createRelationship,
  listRelationshipsFrom,
  listRelationshipsTo,
  deleteRelationship,
  type DbRelationship,
} from "@/lib/dal/relationships"
import { revalidatePath } from "next/cache"

const MVP_USER_ID = "00000000-0000-0000-0000-000000000001"

export async function fetchRecords(objectKey: string): Promise<DbRecord[]> {
  return listRecords(MVP_USER_ID, objectKey)
}

export async function fetchRecord(recordId: string): Promise<DbRecord | null> {
  return getRecord(MVP_USER_ID, recordId)
}

export async function addRecord(
  objectKey: string,
  properties: Record<string, unknown>,
  title?: string,
): Promise<{ success: boolean; error?: string; record?: DbRecord }> {
  try {
    const record = await createRecord(MVP_USER_ID, objectKey, properties, title)
    revalidatePath(`/${objectKey}s`)
    return { success: true, record }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function editRecord(
  recordId: string,
  objectKey: string,
  properties: Record<string, unknown>,
  title?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateRecord(MVP_USER_ID, recordId, properties, title)
    revalidatePath(`/${objectKey}s`)
    revalidatePath(`/${objectKey}s/${recordId}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}

// Relationship actions
export async function fetchRelationshipsFrom(recordId: string): Promise<DbRelationship[]> {
  return listRelationshipsFrom(MVP_USER_ID, recordId)
}

export async function fetchRelationshipsTo(recordId: string): Promise<DbRelationship[]> {
  return listRelationshipsTo(MVP_USER_ID, recordId)
}

export async function addRelationship(
  relationshipKey: string,
  fromRecordId: string,
  toRecordId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await createRelationship(MVP_USER_ID, relationshipKey, fromRecordId, toRecordId)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}

export async function removeRelationship(relationshipId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteRelationship(MVP_USER_ID, relationshipId)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}
