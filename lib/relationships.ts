/**
 * Relationship Vocabulary + Generic Relationship Model
 * Defines how records can be connected
 */

export type RelationshipKey =
  | "contact_belongs_to_company"
  | "task_relates_to_contact"
  | "task_relates_to_company"
  | "document_relates_to_contact"
  | "document_relates_to_company"
  | "document_links_to_task"
  | "task_links_to_document"

export interface RelationshipDefinition {
  key: RelationshipKey
  fromObjectKey: string
  toObjectKey: string
  label: string
  description: string
}

export const RELATIONSHIP_DEFINITIONS: RelationshipDefinition[] = [
  {
    key: "contact_belongs_to_company",
    fromObjectKey: "contact",
    toObjectKey: "company",
    label: "Contact → Company",
    description: "A contact belongs to or works at a company.",
  },
  {
    key: "task_relates_to_contact",
    fromObjectKey: "task",
    toObjectKey: "contact",
    label: "Task → Contact",
    description: "A task is related to or assigned for a contact.",
  },
  {
    key: "task_relates_to_company",
    fromObjectKey: "task",
    toObjectKey: "company",
    label: "Task → Company",
    description: "A task is related to or assigned for a company.",
  },
  {
    key: "document_relates_to_contact",
    fromObjectKey: "document",
    toObjectKey: "contact",
    label: "Document → Contact",
    description: "A document is associated with a contact.",
  },
  {
    key: "document_relates_to_company",
    fromObjectKey: "document",
    toObjectKey: "company",
    label: "Document → Company",
    description: "A document is associated with a company.",
  },
  {
    key: "document_links_to_task",
    fromObjectKey: "document",
    toObjectKey: "task",
    label: "Document → Task",
    description: "A document is linked to or produced by a task.",
  },
  {
    key: "task_links_to_document",
    fromObjectKey: "task",
    toObjectKey: "document",
    label: "Task → Document",
    description: "A task references or produces a document.",
  },
]

export interface RelationshipRecord {
  id: string
  userId: string
  relationshipKey: RelationshipKey
  fromRecordId: string
  toRecordId: string
  createdAt: string
}
