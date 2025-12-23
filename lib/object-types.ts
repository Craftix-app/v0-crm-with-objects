/**
 * Object Type Taxonomy
 * Defines the 9 system object type categories
 */

export type ObjectTypeKey =
  | "entity"
  | "occurrence"
  | "event"
  | "activity"
  | "task"
  | "document"
  | "file"
  | "metric"
  | "relationship"

export interface ObjectTypeDefinition {
  key: ObjectTypeKey
  label: string
  description: string
}

export const OBJECT_TYPES: ObjectTypeDefinition[] = [
  {
    key: "entity",
    label: "Entity",
    description: "A persistent, identifiable object such as a person, company, or organization.",
  },
  {
    key: "occurrence",
    label: "Occurrence",
    description: "An instance of an event or activity that happened at a specific time.",
  },
  {
    key: "event",
    label: "Event",
    description: "A scheduled or recorded happening with a defined start and optional end time.",
  },
  {
    key: "activity",
    label: "Activity",
    description: "An action or set of actions performed by a user or system.",
  },
  {
    key: "task",
    label: "Task",
    description: "A unit of work to be completed, often with a due date and status.",
  },
  {
    key: "document",
    label: "Document",
    description: "A structured or unstructured content item such as a note, proposal, or contract.",
  },
  {
    key: "file",
    label: "File",
    description: "A binary or text file attachment, such as an image, PDF, or spreadsheet.",
  },
  {
    key: "metric",
    label: "Metric",
    description: "A quantitative measurement or KPI tracked over time.",
  },
  {
    key: "relationship",
    label: "Relationship",
    description: "A connection or association between two records.",
  },
]
