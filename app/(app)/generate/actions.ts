"use server"

import { generateText } from "ai"
import { OBJECT_DEFINITIONS } from "@/lib/object-definitions"
import { validatePageConfig, type ValidationResult } from "@/lib/page-schema"

const VALID_OBJECTS = OBJECT_DEFINITIONS.filter((o) => o.enabled).map((o) => ({
  key: o.objectKey,
  label: o.label,
  fields: o.properties.map((p) => ({
    key: p.key,
    label: p.label,
    type: p.type,
    required: p.required,
    options: p.options,
  })),
}))

const SYSTEM_PROMPT = `You are a JSON generator for a CRM page configuration system.

CRITICAL RULES:
1. Output ONLY valid JSON. No prose, no markdown, no explanations.
2. The JSON must conform EXACTLY to this schema:

{
  "id": string (unique identifier),
  "title": string (page title),
  "template": "list" | "detail" | "dashboard",
  "objectKey": ${VALID_OBJECTS.map((o) => `"${o.key}"`).join(" | ")},
  "blocks": array of block objects
}

ALLOWED BLOCK TYPES:

1. queryBar (for list template):
   { "blockType": "queryBar", "id": string, "config": { "enabled": true } }

2. dataView (for list/dashboard):
   { 
     "blockType": "dataView", 
     "id": string, 
     "config": { 
       "mode": "table" | "cards",
       "fields": [field keys from the object],
       "sort": { "field": string, "direction": "asc" | "desc" } (optional),
       "filters": [{ "field": string, "op": "eq" | "neq" | "contains" | "gt" | "lt" | "in", "value": any }] (optional)
     }
   }

3. detailPanel (for detail template):
   { "blockType": "detailPanel", "id": string, "config": { "fields": [field keys] } }

4. statSummary (for dashboard):
   { 
     "blockType": "statSummary", 
     "id": string, 
     "config": { 
       "stats": [{ "label": string, "field": string (optional), "op": "count" (optional) }]
     }
   }

5. emptyState:
   { "blockType": "emptyState", "id": string, "config": { "title": string, "description": string (optional) } }

AVAILABLE OBJECTS AND THEIR FIELDS:
${VALID_OBJECTS.map(
  (obj) => `
${obj.label} (key: "${obj.key}"):
${obj.fields.map((f) => `  - ${f.key} (${f.type}${f.required ? ", required" : ""})${f.options ? ` [${f.options.join(", ")}]` : ""}`).join("\n")}`,
).join("\n")}

TEMPLATE CONSTRAINTS:
- "list" template: Should include queryBar + dataView blocks
- "detail" template: Should include detailPanel block
- "dashboard" template: Should include statSummary + dataView blocks

GUARDRAILS:
- You CANNOT invent new objects, fields, templates, or block types
- You CANNOT use fields that don't exist in the object schema
- You CANNOT generate actions (create/update/delete)
- If a request is unsupported, refuse with: { "error": "reason" }

EXAMPLES:

User: "List contacts with email and phone"
Output:
{
  "id": "contacts-list-1",
  "title": "Contacts",
  "template": "list",
  "objectKey": "contact",
  "blocks": [
    { "blockType": "queryBar", "id": "qb-1", "config": { "enabled": true } },
    { 
      "blockType": "dataView", 
      "id": "dv-1", 
      "config": { 
        "mode": "table",
        "fields": ["firstName", "lastName", "email", "phone"]
      }
    }
  ]
}

User: "Dashboard showing task count"
Output:
{
  "id": "task-dashboard-1",
  "title": "Task Dashboard",
  "template": "dashboard",
  "objectKey": "task",
  "blocks": [
    { 
      "blockType": "statSummary", 
      "id": "ss-1", 
      "config": { 
        "stats": [{ "label": "Total Tasks", "op": "count" }]
      }
    }
  ]
}

Now respond ONLY with valid JSON for the user's request.`

export async function generatePageConfig(prompt: string): Promise<ValidationResult> {
  try {
    // First attempt: Generate JSON from prompt
    const { text: jsonText } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
      system: SYSTEM_PROMPT,
      temperature: 0.3,
    })

    // Try to parse JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      return {
        valid: false,
        errors: ["AI output was not valid JSON. Please try rephrasing your request."],
      }
    }

    // Check for error response from AI
    if (parsed && typeof parsed === "object" && "error" in parsed) {
      return {
        valid: false,
        errors: [String((parsed as { error: string }).error)],
      }
    }

    // Validate with schema
    const validation = validatePageConfig(parsed)

    // If invalid, retry ONCE with errors appended
    if (!validation.valid) {
      const retryPrompt = `${SYSTEM_PROMPT}

PREVIOUS ATTEMPT FAILED WITH ERRORS:
${validation.errors.join("\n")}

User request: "${prompt}"

Generate ONLY valid JSON that fixes these errors:`

      const { text: retryJsonText } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: retryPrompt,
        temperature: 0.3,
      })

      try {
        const retryParsed = JSON.parse(retryJsonText)
        const retryValidation = validatePageConfig(retryParsed)
        return retryValidation
      } catch {
        return {
          valid: false,
          errors: ["Retry failed. AI could not generate valid JSON after correction attempt."],
        }
      }
    }

    return validation
  } catch (error) {
    return {
      valid: false,
      errors: [`Generation error: ${error instanceof Error ? error.message : "Unknown error"}`],
    }
  }
}
