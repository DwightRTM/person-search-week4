'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  getAllPeople,
  testMCPTool,
} from '@/app/actions/mcp-tester'

interface RequestHistory {
  id: string
  tool: string
  input: Record<string, unknown>
  result: unknown
  error?: string
  timestamp: Date
}

const TOOLS = [
  {
    name: 'create_person',
    description: 'Create a new person',
    inputs: [
      { name: 'name', type: 'text', required: true, placeholder: 'Full name' },
      { name: 'email', type: 'email', required: true, placeholder: 'Email address' },
      { name: 'phoneNumber', type: 'tel', required: false, placeholder: 'Phone number (optional)' },
    ],
  },
  {
    name: 'read_person',
    description: 'Get a person by ID',
    inputs: [{ name: 'id', type: 'text', required: true, placeholder: 'Person ID' }],
  },
  {
    name: 'read_all_people',
    description: 'Get all people in the database',
    inputs: [],
  },
  {
    name: 'update_person',
    description: 'Update a person',
    inputs: [
      { name: 'id', type: 'text', required: true, placeholder: 'Person ID' },
      { name: 'name', type: 'text', required: false, placeholder: 'Name (optional)' },
      { name: 'email', type: 'email', required: false, placeholder: 'Email (optional)' },
      { name: 'phoneNumber', type: 'tel', required: false, placeholder: 'Phone (optional)' },
    ],
  },
  {
    name: 'delete_person',
    description: 'Delete a person',
    inputs: [{ name: 'id', type: 'text', required: true, placeholder: 'Person ID' }],
  },
  {
    name: 'search_people',
    description: 'Search for people by name',
    inputs: [{ name: 'query', type: 'text', required: true, placeholder: 'Search query' }],
  },
]

export default function MCPTesterPage() {
  const [selectedTool, setSelectedTool] = useState<string>('read_all_people')
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  const currentTool = TOOLS.find((t) => t.name === selectedTool)

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleExecuteTool = async () => {
    if (!currentTool) return

    setLoading(true)
    try {
      // Build input object
      const toolInput: Record<string, unknown> = {}
      currentTool.inputs.forEach((input) => {
        const value = inputs[input.name]?.trim()
        if (value) {
          toolInput[input.name] = value
        }
      })

      const result = await testMCPTool(selectedTool, toolInput)

      const historyEntry: RequestHistory = {
        id: Date.now().toString(),
        tool: selectedTool,
        input: toolInput,
        result: result.result,
        error: result.error,
        timestamp: new Date(),
      }

      setHistory((prev) => [historyEntry, ...prev])
      setSelectedHistoryId(historyEntry.id)
    } catch (error) {
      const historyEntry: RequestHistory = {
        id: Date.now().toString(),
        tool: selectedTool,
        input: inputs,
        result: null,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      }
      setHistory((prev) => [historyEntry, ...prev])
      setSelectedHistoryId(historyEntry.id)
    } finally {
      setLoading(false)
    }
  }

  const selectedHistory = history.find((h) => h.id === selectedHistoryId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">MCP CRUD Tester</h1>
          <p className="text-muted-foreground">
            Real-time testing interface for Person Search MCP Server CRUD functionality
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Tool Selector & Input */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Tool</CardTitle>
                <CardDescription>Choose an MCP operation to test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-select">Tool</Label>
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger id="tool-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOOLS.map((tool) => (
                        <SelectItem key={tool.name} value={tool.name}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">{currentTool?.description}</p>

                {/* Tool Inputs */}
                <div className="space-y-3 mt-4">
                  {currentTool?.inputs.map((input) => (
                    <div key={input.name} className="space-y-1">
                      <Label htmlFor={input.name} className="text-sm">
                        {input.name}
                        {input.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Input
                        id={input.name}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={inputs[input.name] || ''}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleExecuteTool}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading && <Spinner className="mr-2" />}
                  {loading ? 'Testing...' : 'Execute Tool'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Response & History */}
          <div className="lg:col-span-2 space-y-4">
            {/* Response Viewer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response</CardTitle>
                <CardDescription>
                  {selectedHistory ? new Date(selectedHistory.timestamp).toLocaleTimeString() : 'No request executed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedHistory ? (
                  <div className="space-y-4">
                    {selectedHistory.error ? (
                      <Alert variant="destructive">
                        <AlertDescription>
                          <span className="font-semibold">Error:</span> {selectedHistory.error}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        {/* Input Summary */}
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Input:</p>
                          <div className="space-y-1">
                            {Object.entries(selectedHistory.input).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-mono text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                                  {key}
                                </span>
                                <span className="text-sm">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Result Display */}
                        {selectedHistory.result && typeof selectedHistory.result === 'object' ? (
                          Array.isArray(selectedHistory.result) ? (
                            // Display array of people
                            <div className="space-y-3">
                              <p className="text-sm font-semibold">Results ({selectedHistory.result.length}):</p>
                              {selectedHistory.result.length > 0 ? (
                                <div className="grid gap-3 max-h-96 overflow-y-auto">
                                  {selectedHistory.result.map((item: any, idx) => (
                                    <div key={idx} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                                      {item.name && (
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <p className="font-semibold text-base">{item.name}</p>
                                            {item.id && (
                                              <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                                            )}
                                          </div>
                                          {item.createdAt && (
                                            <Badge variant="outline" className="text-xs">
                                              {new Date(item.createdAt).toLocaleDateString()}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                      {item.email && (
                                        <p className="text-sm text-muted-foreground">📧 {item.email}</p>
                                      )}
                                      {item.phoneNumber && (
                                        <p className="text-sm text-muted-foreground">📞 {item.phoneNumber}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-sm">No results found</p>
                              )}
                            </div>
                          ) : (
                            // Display single object
                            (() => {
                              const result = selectedHistory.result as any
                              return (
                                <div className="border rounded-lg p-4 space-y-3">
                                  {result?.name ? (
                                    <div>
                                      <p className="font-semibold text-lg">{String(result.name)}</p>
                                      {result?.id && (
                                        <p className="text-xs text-muted-foreground">ID: {String(result.id)}</p>
                                      )}
                                    </div>
                                  ) : null}
                                  {result?.email ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">📧</span>
                                      <span className="text-sm">{String(result.email)}</span>
                                    </div>
                                  ) : null}
                                  {result?.phoneNumber ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">📞</span>
                                      <span className="text-sm">{String(result.phoneNumber)}</span>
                                    </div>
                                  ) : null}
                                  {result?.createdAt ? (
                                    <div className="text-xs text-muted-foreground">
                                      Created: {new Date(String(result.createdAt)).toLocaleDateString()}
                                    </div>
                                  ) : null}
                                </div>
                              )
                            })()
                          )
                        ) : typeof selectedHistory.result === 'string' ? (
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <p className="text-sm text-green-800 dark:text-green-200">{selectedHistory.result}</p>
                          </div>
                        ) : (
                          <div className="bg-muted p-3 rounded">
                            <p className="text-sm text-muted-foreground">
                              {selectedHistory.result ? String(selectedHistory.result) : 'Operation completed'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Execute a tool to see the response</p>
                )}
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Request History</span>
                  <Badge variant="outline">{history.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {history.map((entry) => (
                        <button
                          key={entry.id}
                          onClick={() => setSelectedHistoryId(entry.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedHistoryId === entry.id
                              ? 'bg-primary/10 border-primary'
                              : 'bg-muted/50 border-muted hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm">{entry.tool}</span>
                            {entry.error ? (
                              <Badge variant="destructive">Error</Badge>
                            ) : (
                              <Badge variant="outline">Success</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-muted-foreground text-sm">No requests yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">MCP Server Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Status:</span>{' '}
              <Badge variant="outline" className="ml-2">
                Ready
              </Badge>
            </div>
            <div>
              <span className="font-semibold">Database:</span> SQLite (Shared with Next.js App)
            </div>
            <div>
              <span className="font-semibold">Available Tools:</span> 6 CRUD operations
            </div>
            <div>
              <span className="font-semibold">Usage:</span> Select a tool above and click Execute to test the MCP server
              functionality in real-time.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
