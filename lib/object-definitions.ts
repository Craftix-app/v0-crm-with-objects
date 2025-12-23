/**
 * Enabled CRM Object Definitions
 * Defines the 4 enabled objects for MVP: contact, company, task, document
 */

import type { ObjectTypeKey } from "./object-types"
import type { PropertyDefinition } from "./property-types"

export interface ObjectDefinition {
  objectKey: string
  label: string
  labelPlural: string
  objectTypeKey: ObjectTypeKey
  enabled: boolean
  properties: PropertyDefinition[]
}

export const OBJECT_DEFINITIONS: ObjectDefinition[] = [
  {
    objectKey: "contact",
    label: "Contact",
    labelPlural: "Contacts",
    objectTypeKey: "entity",
    enabled: true,
    properties: [
      { key: "firstName", label: "First Name", type: "text", required: true },
      { key: "lastName", label: "Last Name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "phone" },
      { key: "company", label: "Company", type: "company" },
      { key: "jobTitle", label: "Job Title", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Lead", "Active", "Churned"] },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  {
    objectKey: "company",
    label: "Company",
    labelPlural: "Companies",
    objectTypeKey: "entity",
    enabled: true,
    properties: [
      { key: "name", label: "Company Name", type: "text", required: true },
      { key: "domain", label: "Website", type: "url" },
      {
        key: "industry",
        label: "Industry",
        type: "select",
        options: ["Technology", "Finance", "Healthcare", "Retail", "Other"],
      },
      { key: "size", label: "Company Size", type: "select", options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
      { key: "phone", label: "Phone", type: "phone" },
      { key: "address", label: "Address", type: "textarea" },
    ],
  },
  {
    objectKey: "task",
    label: "Task",
    labelPlural: "Tasks",
    objectTypeKey: "task",
    enabled: true,
    properties: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Todo", "In Progress", "Done", "Blocked"],
        required: true,
      },
      { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Urgent"] },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "assignee", label: "Assignee", type: "owner" },
    ],
  },
  {
    objectKey: "document",
    label: "Document",
    labelPlural: "Documents",
    objectTypeKey: "document",
    enabled: true,
    properties: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "content", label: "Content", type: "richtext" },
      {
        key: "type",
        label: "Document Type",
        type: "select",
        options: ["Note", "Proposal", "Contract", "Report", "Other"],
      },
      { key: "status", label: "Status", type: "select", options: ["Draft", "In Review", "Final", "Archived"] },
      { key: "file", label: "Attachment", type: "file" },
    ],
  },
]
