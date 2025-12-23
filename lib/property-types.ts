/**
 * Property Types (HubSpot-like)
 * Defines the available property field types for object definitions
 */

export type PropertyType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "boolean"
  | "select"
  | "multiselect"
  | "url"
  | "email"
  | "phone"
  | "owner"
  | "company"
  | "file"
  | "richtext"

export interface PropertyDefinition {
  key: string
  label: string
  type: PropertyType
  required?: boolean
  options?: string[]
  description?: string
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  text: "Single-line Text",
  textarea: "Multi-line Text",
  number: "Number",
  currency: "Currency",
  date: "Date",
  datetime: "Date & Time",
  boolean: "Yes/No",
  select: "Dropdown Select",
  multiselect: "Multi-select",
  url: "URL",
  email: "Email",
  phone: "Phone Number",
  owner: "Owner (User)",
  company: "Company Reference",
  file: "File Attachment",
  richtext: "Rich Text",
}
