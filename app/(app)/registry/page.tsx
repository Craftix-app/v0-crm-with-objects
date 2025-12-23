import { Section, Stack, Grid, Panel, PageShell, EmptyState } from "@/components/primitives"
import { QueryBar, DataViewBlock, DetailPanelBlock, StatSummaryRow } from "@/components/blocks"
import {
  Button,
  Input,
  Textarea,
  Label,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/registry/controls"
import { OBJECT_TYPES } from "@/lib/object-types"
import { PROPERTY_TYPE_LABELS, type PropertyType } from "@/lib/property-types"
import { OBJECT_DEFINITIONS } from "@/lib/object-definitions"
import { RELATIONSHIP_DEFINITIONS } from "@/lib/relationships"
import { countRecordsByObjectKey } from "@/lib/dal/records"
import { countRelationships } from "@/lib/dal/relationships"
import { Inbox } from "lucide-react"

export default async function RegistryPage() {
  const MVP_USER_ID = "00000000-0000-0000-0000-000000000001"
  let recordCounts: Record<string, number> = {}
  let relationshipCount = 0
  let dbError: string | null = null

  try {
    recordCounts = await countRecordsByObjectKey(MVP_USER_ID)
    relationshipCount = await countRelationships(MVP_USER_ID)
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown error"
  }

  // Mock data for blocks
  const mockTableColumns = [
    { key: "name", label: "Name", type: "text" as const, width: 180 },
    { key: "email", label: "Email", type: "email" as const, width: 220 },
    { key: "role", label: "Role", type: "select" as const, width: 150, options: ["Admin", "User", "Manager"] },
    { key: "status", label: "Status", type: "select" as const, width: 120, options: ["Active", "Inactive"] },
  ]

  const mockTableRows = [
    { name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
    { name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active" },
    { name: "Carol White", email: "carol@example.com", role: "Manager", status: "Inactive" },
  ]

  const mockCardItems = [
    { id: "1", title: "Project Alpha", subtitle: "High priority", metadata: "Due: Dec 31" },
    { id: "2", title: "Client Onboarding", subtitle: "New customer", metadata: "Due: Jan 15" },
  ]

  const mockDetailFields = [
    { label: "Full Name", value: "Alice Johnson" },
    { label: "Email", value: "alice@example.com" },
    { label: "Role", value: "Administrator" },
  ]

  const mockStats = [
    { label: "Total Contacts", value: "1,234" },
    { label: "Active Tasks", value: "87" },
    { label: "Open Documents", value: "42" },
  ]

  return (
    <PageShell title="Component Registry">
      <Stack gap="xl">
        <Section>
          <h1 className="text-3xl font-bold">Component Registry</h1>
          <p className="text-muted-foreground">
            Base primitives, blocks, and approved controls using semantic design tokens.
          </p>
        </Section>

        {/* DB Debug */}
        <Section>
          <h2 className="text-2xl font-semibold border-b border-border pb-2">DB Debug</h2>
          <p className="text-sm text-muted-foreground">
            Live record counts from the database (read-only verification).
          </p>
          {dbError ? (
            <Panel variant="bordered">
              <p className="text-destructive text-sm">Error connecting to database: {dbError}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Run the migration scripts in /scripts to set up the database tables.
              </p>
            </Panel>
          ) : (
            <Grid cols={4}>
              {OBJECT_DEFINITIONS.filter((obj) => obj.enabled).map((obj) => (
                <Panel key={obj.objectKey} variant="bordered">
                  <div className="text-2xl font-bold">{recordCounts[obj.objectKey] ?? 0}</div>
                  <div className="text-sm text-muted-foreground">{obj.labelPlural}</div>
                </Panel>
              ))}
              <Panel variant="bordered">
                <div className="text-2xl font-bold">{relationshipCount}</div>
                <div className="text-sm text-muted-foreground">Relationships</div>
              </Panel>
            </Grid>
          )}
        </Section>

        <Section>
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Approved Controls</h2>
          <p className="text-sm text-muted-foreground mb-4">
            UI controls approved for use in CRUD pages. Import from{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">@/components/registry/controls</code>.
          </p>
          <Grid cols={3}>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Button</h4>
              <Stack gap="sm">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </Stack>
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Input</h4>
              <Stack gap="sm">
                <Input placeholder="Text input" />
                <Input type="email" placeholder="Email input" />
                <Input type="date" />
              </Stack>
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Textarea</h4>
              <Textarea placeholder="Multi-line text input..." />
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Label</h4>
              <Stack gap="sm">
                <Label>Standard Label</Label>
                <Label className="text-muted-foreground">Muted Label</Label>
              </Stack>
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Checkbox</h4>
              <div className="flex items-center gap-2">
                <Checkbox id="demo-check" />
                <Label htmlFor="demo-check">Check me</Label>
              </div>
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-3">Select</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                  <SelectItem value="c">Option C</SelectItem>
                </SelectContent>
              </Select>
            </Panel>
          </Grid>
        </Section>

        {/* Primitives Section */}
        <Section>
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Primitives</h2>
          <p className="text-sm text-muted-foreground">Base layout and container components.</p>
        </Section>

        {/* PageShell */}
        <Section>
          <h3 className="text-xl font-semibold">PageShell</h3>
          <p className="text-sm text-muted-foreground">
            Page wrapper with title and optional actions slot. Used by all CRUD pages.
          </p>
          <Panel>
            <code className="text-sm font-mono">{`<PageShell title="Page Title" actions={<Button>Action</Button>}>{children}</PageShell>`}</code>
          </Panel>
        </Section>

        {/* Section */}
        <Section>
          <h3 className="text-xl font-semibold">Section</h3>
          <p className="text-sm text-muted-foreground">Semantic container with vertical spacing.</p>
          <Panel>
            <code className="text-sm font-mono">{`<Section>{children}</Section>`}</code>
          </Panel>
        </Section>

        {/* Stack */}
        <Section>
          <h3 className="text-xl font-semibold">Stack</h3>
          <p className="text-sm text-muted-foreground">Vertical flexbox with configurable gap.</p>
          <Panel>
            <code className="text-sm font-mono">{`<Stack gap="md">{children}</Stack>`}</code>
          </Panel>
          <Grid cols={3}>
            {(["sm", "md", "lg"] as const).map((gap) => (
              <Panel key={gap} variant="elevated">
                <Stack gap={gap}>
                  <div className="text-xs font-mono text-muted-foreground">gap="{gap}"</div>
                  <div className="h-6 bg-primary/20 rounded" />
                  <div className="h-6 bg-primary/20 rounded" />
                </Stack>
              </Panel>
            ))}
          </Grid>
        </Section>

        {/* Grid */}
        <Section>
          <h3 className="text-xl font-semibold">Grid</h3>
          <p className="text-sm text-muted-foreground">Responsive grid container.</p>
          <Panel>
            <code className="text-sm font-mono">{`<Grid cols={3}>{children}</Grid>`}</code>
          </Panel>
        </Section>

        {/* Panel */}
        <Section>
          <h3 className="text-xl font-semibold">Panel</h3>
          <p className="text-sm text-muted-foreground">Content container with variants.</p>
          <Grid cols={3}>
            <Panel variant="default">
              <h4 className="font-semibold mb-2">Default</h4>
              <p className="text-sm text-muted-foreground">No border</p>
            </Panel>
            <Panel variant="bordered">
              <h4 className="font-semibold mb-2">Bordered</h4>
              <p className="text-sm text-muted-foreground">With border</p>
            </Panel>
            <Panel variant="elevated">
              <h4 className="font-semibold mb-2">Elevated</h4>
              <p className="text-sm text-muted-foreground">With shadow</p>
            </Panel>
          </Grid>
        </Section>

        {/* EmptyState */}
        <Section>
          <h3 className="text-xl font-semibold">EmptyState</h3>
          <p className="text-sm text-muted-foreground">Centered empty state with icon, title, and description.</p>
          <Panel variant="bordered" className="h-64">
            <EmptyState icon={Inbox} title="No items yet" description="Create your first item to get started." />
          </Panel>
        </Section>

        {/* Blocks Section */}
        <Section>
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Blocks</h2>
          <p className="text-sm text-muted-foreground">Data-aware UI components.</p>
        </Section>

        {/* QueryBar */}
        <Section>
          <h3 className="text-xl font-semibold">QueryBar</h3>
          <QueryBar />
        </Section>

        {/* DataViewBlock Table */}
        <Section>
          <h3 className="text-xl font-semibold">DataViewBlock - Table</h3>
          <DataViewBlock mode="table" columns={mockTableColumns} rows={mockTableRows} />
        </Section>

        {/* DataViewBlock Cards */}
        <Section>
          <h3 className="text-xl font-semibold">DataViewBlock - Cards</h3>
          <DataViewBlock mode="cards" items={mockCardItems} />
        </Section>

        {/* DetailPanelBlock */}
        <Section>
          <h3 className="text-xl font-semibold">DetailPanelBlock</h3>
          <DetailPanelBlock fields={mockDetailFields} />
        </Section>

        {/* StatSummaryRow */}
        <Section>
          <h3 className="text-xl font-semibold">StatSummaryRow</h3>
          <StatSummaryRow stats={mockStats} />
        </Section>

        {/* Schema Section */}
        <Section>
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Schema</h2>
        </Section>

        {/* Object Types */}
        <Section>
          <h3 className="text-xl font-semibold">Object Types</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Key</th>
                  <th className="px-4 py-3 text-left font-medium">Label</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {OBJECT_TYPES.map((type) => (
                  <tr key={type.key} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{type.key}</td>
                    <td className="px-4 py-3">{type.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{type.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Property Types */}
        <Section>
          <h3 className="text-xl font-semibold">Property Types</h3>
          <Grid cols={4}>
            {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(([key, label]) => (
              <Panel key={key} variant="bordered">
                <div className="font-mono text-xs text-muted-foreground">{key}</div>
                <div className="font-medium">{label}</div>
              </Panel>
            ))}
          </Grid>
        </Section>

        {/* Object Definitions */}
        <Section>
          <h3 className="text-xl font-semibold">Object Definitions</h3>
          <Stack gap="lg">
            {OBJECT_DEFINITIONS.filter((obj) => obj.enabled).map((obj) => (
              <Panel key={obj.objectKey} variant="bordered">
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="font-semibold text-lg">{obj.label}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-mono">{obj.objectKey}</span>
                </div>
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium">Property</th>
                        <th className="px-3 py-2 text-left font-medium">Type</th>
                        <th className="px-3 py-2 text-left font-medium">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {obj.properties.map((prop) => (
                        <tr key={prop.key} className="border-b border-border last:border-0">
                          <td className="px-3 py-2">
                            <span className="font-medium">{prop.label}</span>
                            <span className="ml-2 font-mono text-xs text-muted-foreground">{prop.key}</span>
                          </td>
                          <td className="px-3 py-2 font-mono text-xs">{prop.type}</td>
                          <td className="px-3 py-2">{prop.required ? "Yes" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}
          </Stack>
        </Section>

        {/* Relationship Definitions */}
        <Section>
          <h3 className="text-xl font-semibold">Relationship Definitions</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Key</th>
                  <th className="px-4 py-3 text-left font-medium">From → To</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {RELATIONSHIP_DEFINITIONS.map((rel) => (
                  <tr key={rel.key} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{rel.key}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-muted text-xs font-mono">{rel.fromObjectKey}</span>
                      <span className="mx-2 text-muted-foreground">→</span>
                      <span className="px-2 py-0.5 rounded bg-muted text-xs font-mono">{rel.toObjectKey}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{rel.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </Stack>
    </PageShell>
  )
}
