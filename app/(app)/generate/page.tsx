"use client"

import { useState, useEffect } from "react"
import { PageShell, Stack, Panel } from "@/components/primitives"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Textarea,
  Button,
} from "@/components/registry/controls"
import { PageRenderer } from "@/components/renderer/page-renderer"
import { generatePageConfig } from "./actions"
import type { PageConfig } from "@/lib/page-schema"
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react"

// Sample configs imported statically
import contactsListConfig from "@/config/generated-pages/contacts-list.json"
import taskDetailConfig from "@/config/generated-pages/task-detail.json"
import dashboardConfig from "@/config/generated-pages/dashboard-sample.json"
import invalidConfig from "@/config/generated-pages/invalid-sample.json"

const SAMPLE_CONFIGS = [
  { id: "contacts-list", label: "Contacts List (list template)", config: contactsListConfig },
  { id: "task-detail", label: "Task Detail (detail template)", config: taskDetailConfig, recordId: "placeholder" },
  { id: "dashboard", label: "Contacts Dashboard (dashboard template)", config: dashboardConfig },
  { id: "invalid", label: "Invalid Sample (validation error)", config: invalidConfig },
] as const

const EXAMPLE_PROMPTS = [
  "List contacts with email and phone",
  "Dashboard showing task count",
  "Detail page for a document",
  "List companies with name and industry",
  "Dashboard with contact count and company count stats",
]

export default function GeneratePage() {
  const [mode, setMode] = useState<"samples" | "ai">("samples")
  const [selectedId, setSelectedId] = useState<string>("contacts-list")
  const [currentConfig, setCurrentConfig] = useState<unknown>(contactsListConfig)
  const [recordId, setRecordId] = useState<string | undefined>(undefined)

  // AI mode state
  const [prompt, setPrompt] = useState("")
  const [generatedConfig, setGeneratedConfig] = useState<PageConfig | null>(null)
  const [generationError, setGenerationError] = useState<string[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [jsonExpanded, setJsonExpanded] = useState(false)

  // Update config when sample selection changes
  useEffect(() => {
    if (mode === "samples") {
      const sample = SAMPLE_CONFIGS.find((s) => s.id === selectedId)
      if (sample) {
        setCurrentConfig(sample.config)
        setRecordId("recordId" in sample ? sample.recordId : undefined)
      }
    }
  }, [selectedId, mode])

  // Update config when AI generates new config
  useEffect(() => {
    if (mode === "ai" && generatedConfig) {
      setCurrentConfig(generatedConfig)
      setRecordId(generatedConfig.template === "detail" ? "placeholder" : undefined)
    }
  }, [generatedConfig, mode])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedConfig(null)

    const result = await generatePageConfig(prompt)

    if (result.valid) {
      setGeneratedConfig(result.config)
      setGenerationError(null)
    } else {
      setGenerationError(result.errors)
      setGeneratedConfig(null)
    }

    setIsGenerating(false)
  }

  const displayConfig = mode === "samples" ? currentConfig : generatedConfig

  return (
    <PageShell title="Generate">
      <Stack gap="lg">
        {/* Mode selector */}
        <Panel>
          <Stack gap="md">
            <Label>Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={mode === "samples" ? "default" : "outline"}
                onClick={() => setMode("samples")}
                className="flex-1"
              >
                Sample Configs
              </Button>
              <Button variant={mode === "ai" ? "default" : "outline"} onClick={() => setMode("ai")} className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
            </div>
          </Stack>
        </Panel>

        {/* Sample mode: Config selector */}
        {mode === "samples" && (
          <Panel>
            <Stack gap="md">
              <Label htmlFor="config-select">Select Sample Configuration</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="config-select" className="w-full">
                  <SelectValue placeholder="Choose a sample..." />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_CONFIGS.map((sample) => (
                    <SelectItem key={sample.id} value={sample.id}>
                      {sample.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Stack>
          </Panel>
        )}

        {/* AI mode: Prompt input */}
        {mode === "ai" && (
          <Panel>
            <Stack gap="md">
              <Label htmlFor="prompt">Describe the page you want to generate</Label>
              <Textarea
                id="prompt"
                placeholder="Example: List contacts with email and phone"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
              <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? "Generating..." : "Generate Page"}
              </Button>

              {generationError && (
                <div className="bg-destructive/10 border border-destructive rounded-md p-4">
                  <p className="font-semibold text-destructive mb-2">Generation Failed</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {generationError.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Stack>
          </Panel>
        )}

        {/* JSON preview (collapsible) */}
        {displayConfig && (
          <Panel>
            <Stack gap="sm">
              <button
                onClick={() => setJsonExpanded(!jsonExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-medium text-muted-foreground">Configuration JSON</h3>
                {jsonExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {jsonExpanded && (
                <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto max-h-96">
                  {JSON.stringify(displayConfig, null, 2)}
                </pre>
              )}
            </Stack>
          </Panel>
        )}

        {/* Rendered output */}
        {displayConfig && (
          <Panel variant="bordered">
            <Stack gap="sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Rendered Output</h3>
              <PageRenderer config={displayConfig} recordId={recordId} />
            </Stack>
          </Panel>
        )}
      </Stack>
    </PageShell>
  )
}
