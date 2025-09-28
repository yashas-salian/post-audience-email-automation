import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Download, Save, Users, TrendingUp, BarChart3, TableIcon, PieChart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from "recharts"
import axios from "axios"

// Backend API response types
interface BackendPersona {
  PriorityOrder: number
  Name: string
  AgeRange: string
  Gender: string
  Occupation: string
  Region: string
  Interests: string[]
  LifeStyle: string
  BuyingMotivation: string
  PreferredMarketingChannel: string
  IncomeLevel: string
  MarketSharePercent: number
}

interface ApiResponse {
  status: number
  message: string
  success: boolean
  data: {
    personas: BackendPersona[]
  }
}

// Frontend types (converted from backend)
interface Persona {
  id: string
  name: string
  ageRange: string
  occupation: string
  income: string
  gender: string
  demographics: string[]
  psychographics: string[]
  painPoints: string[]
  platforms: string[]
  motivation: string
  engagementStyle: string
  priorityOrder: number
  marketShare: number
  region: string
  interests: string[]
  lifestyle: string
}

type FormState = {
  business?: string
  product?: string
  industry?: string
  goal?: string
  geo?: string
}

const INDUSTRIES = ["SaaS", "Sustainable products", "Education", "Fashion", "Health & Wellness", "Fintech", "Travel"]
const GOALS = ["Sales", "Awareness", "Engagement", "Retention"]

// Convert backend persona to frontend persona
function convertBackendPersona(backendPersona: BackendPersona, index: number): Persona {
  return {
    id: `persona-${Date.now()}-${index}`,
    name: backendPersona.Name,
    ageRange: backendPersona.AgeRange,
    occupation: backendPersona.Occupation,
    income: backendPersona.IncomeLevel,
    gender: backendPersona.Gender,
    demographics: [backendPersona.Region, backendPersona.Gender, backendPersona.IncomeLevel],
    psychographics: [backendPersona.LifeStyle, ...backendPersona.Interests.slice(0, 2)],
    painPoints: [backendPersona.BuyingMotivation],
    platforms: [backendPersona.PreferredMarketingChannel],
    motivation: backendPersona.BuyingMotivation,
    engagementStyle: backendPersona.PreferredMarketingChannel,
    priorityOrder: backendPersona.PriorityOrder,
    marketShare: backendPersona.MarketSharePercent,
    region: backendPersona.Region,
    interests: backendPersona.Interests,
    lifestyle: backendPersona.LifeStyle
  }
}

function PersonaCard({ persona, selected, onSelect }: { persona: Persona; selected: boolean; onSelect: () => void }) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">{persona.name}</h3>
          <Badge variant="outline" className="text-xs">#{persona.priorityOrder}</Badge>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>{persona.occupation} • {persona.ageRange}</p>
          <p>{persona.region} • {persona.income}</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{persona.marketShare}% market share</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function downloadCSV(rows: Record<string, string>[], filename: string) {
  const headers = Object.keys(rows[0] || {})
  const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`
  const csv = [headers.join(",")].concat(rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(","))).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function AudienceProfilingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    business: "",
    product: "",
    industry: "",
    goal: "",
    geo: "",
  })
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table')
  
  const selected = useMemo(() => personas.find((p) => p.id === (selectedId ?? personas[0]?.id)), [personas, selectedId])
  const [isEditing, setIsEditing] = useState(false)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  useEffect(() => {
    const draft = localStorage.getItem("audience-profiling:form")
    if (draft) {
      try {
        setForm(JSON.parse(draft))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("audience-profiling:form", JSON.stringify(form))
  }, [form])

  const generatePersonas = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Build description from form data
      const desc = `Business: ${form.business || 'Not specified'}
Product/Service: ${form.product || 'Not specified'}
Industry: ${form.industry || 'Not specified'}
Goal: ${form.goal || 'Not specified'}
Geography: ${form.geo || 'Global'}`

      // Make API call to your backend
      const response = await axios.post('http://127.0.0.1:8787/get-audience-profile',JSON.stringify(desc))

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      // const data: ApiResponse = await response.json()
      
      // if (!data.success) {
      //   throw new Error(data.message || 'Failed to generate personas')
      // }

      // Convert backend personas to frontend format
      const convertedPersonas = response.data.data.personas.map((persona: BackendPersona, index: number) => 
        convertBackendPersona(persona, index)
      )
      
      setPersonas(convertedPersonas)
      setSelectedId(convertedPersonas[0]?.id || null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate personas')
    } finally {
      setIsLoading(false)
    }
  }

  // Chart data preparation
  const chartData = useMemo(() => {
    const marketShareData = personas.map(p => ({
      name: p.name,
      marketShare: p.marketShare,
      priority: p.priorityOrder
    }))

    const ageDistribution = personas.reduce((acc, p) => {
      acc[p.ageRange] = (acc[p.ageRange] || 0) + p.marketShare
      return acc
    }, {} as Record<string, number>)

    const ageData = Object.entries(ageDistribution).map(([age, share]) => ({
      age,
      share: Math.round(share * 100) / 100
    }))

    const incomeDistribution = personas.reduce((acc, p) => {
      acc[p.income] = (acc[p.income] || 0) + p.marketShare
      return acc
    }, {} as Record<string, number>)

    const incomeData = Object.entries(incomeDistribution).map(([income, share]) => ({
      income,
      share: Math.round(share * 100) / 100
    }))

    return {
      marketShare: marketShareData,
      ageDistribution: ageData,
      incomeDistribution: incomeData
    }
  }, [personas])

  const onSavePersona = (p: Persona) => {
    try {
      const key = "asset-library:personas"
      const existing: Persona[] = JSON.parse(localStorage.getItem(key) || "[]")
      const next = [...existing, p]
      localStorage.setItem(key, JSON.stringify(next))
    } catch {}
  }

  const onExportAll = () => {
    const rows = personas.map(p => ({
      priority: p.priorityOrder.toString(),
      name: p.name,
      ageRange: p.ageRange,
      gender: p.gender,
      occupation: p.occupation,
      region: p.region,
      income: p.income,
      interests: p.interests.join("; "),
      lifestyle: p.lifestyle,
      motivation: p.motivation,
      marketingChannel: p.engagementStyle,
      marketShare: p.marketShare.toString() + "%"
    }))
    downloadCSV(rows, `audience-personas-${Date.now()}.csv`)
  }

  const onSendToWizard = (selected: Persona[]) => {
    localStorage.setItem("campaign-wizard:selected-personas", JSON.stringify(selected))
    navigate("/campaign-wizard")
  }

  const updateSelected = (patch: Partial<Persona>) => {
    if (!selected) return
    setPersonas((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)))
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audience Profiling</h1>
          <p className="text-sm text-muted-foreground">Generate AI-powered persona cards for better targeting.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm underline text-primary">
            Back to Dashboard
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              localStorage.setItem("audience-profiling:form", JSON.stringify(form))
            }}
          >
            Save Draft
          </Button>
        </div>
      </header>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Generate Personas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="business">Business / Brand</Label>
              <Input
                id="business"
                value={form.business}
                onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                placeholder="EcoBottle"
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={(v) => setForm((f) => ({ ...f, industry: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Goal / Priority</Label>
              <Select value={form.goal} onValueChange={(v) => setForm((f) => ({ ...f, goal: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose goal" />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product">Product / Service Description</Label>
              <Textarea
                id="product"
                value={form.product}
                onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                placeholder="Describe your product or service in detail..."
                className="min-h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geo">Geography (optional)</Label>
              <Input
                id="geo"
                value={form.geo}
                onChange={(e) => setForm((f) => ({ ...f, geo: e.target.value }))}
                placeholder="Global, India, US, EU..."
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={generatePersonas} disabled={isLoading || !form.product}>
              {isLoading ? "Generating..." : "Generate Personas"}
            </Button>
            {personas.length > 0 && (
              <Button variant="secondary" onClick={onExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {personas.length > 0 && (
        <>
          {/* View Toggle and Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Generated Personas ({personas.length})</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'charts' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('charts')}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Charts
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total Market Coverage: {Math.round(personas.reduce((sum, p) => sum + p.marketShare, 0) * 100) / 100}%
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card>
              <CardHeader>
                <CardTitle>Persona Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Priority</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age Range</TableHead>
                        <TableHead>Occupation</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead>Market Share</TableHead>
                        <TableHead>Interests</TableHead>
                        <TableHead>Marketing Channel</TableHead>
                        <TableHead>Motivation</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {personas
                        .sort((a, b) => a.priorityOrder - b.priorityOrder)
                        .map((persona) => (
                        <TableRow key={persona.id}>
                          <TableCell>
                            <Badge variant="secondary">#{persona.priorityOrder}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{persona.name}</TableCell>
                          <TableCell>{persona.ageRange}</TableCell>
                          <TableCell>{persona.occupation}</TableCell>
                          <TableCell>{persona.region}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{persona.income}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(persona.marketShare, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{persona.marketShare}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {persona.interests.slice(0, 2).map((interest, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {persona.interests.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{persona.interests.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{persona.engagementStyle}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-sm" title={persona.motivation}>
                              {persona.motivation}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSavePersona(persona)}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts View */}
          {viewMode === 'charts' && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Market Share Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Market Share Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie 
                        data={chartData.marketShare}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="marketShare"
                      >
                        {chartData.marketShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority vs Market Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Priority vs Market Share
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.marketShare}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="marketShare" fill="#8884d8" name="Market Share %" />
                      <Bar dataKey="priority" fill="#82ca9d" name="Priority Order" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Age Group Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="share" fill="#0088FE" name="Market Share %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Income Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.incomeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ income, share }) => `${income}: ${share}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="share"
                      >
                        {chartData.incomeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detailed Persona Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Persona Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {personas
                  .sort((a, b) => a.priorityOrder - b.priorityOrder)
                  .map((persona) => (
                  <Card key={persona.id} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{persona.name}</CardTitle>
                        <Badge variant="default">#{persona.priorityOrder}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {persona.occupation} • {persona.ageRange} • {persona.region}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs font-semibold text-gray-600">INCOME</Label>
                          <p>{persona.income}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-600">MARKET SHARE</Label>
                          <p className="flex items-center gap-2">
                            {persona.marketShare}%
                            <TrendingUp className="h-3 w-3" />
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold text-gray-600">INTERESTS</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {persona.interests.map((interest, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold text-gray-600">LIFESTYLE</Label>
                        <p className="text-sm">{persona.lifestyle}</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold text-gray-600">BUYING MOTIVATION</Label>
                        <p className="text-sm">{persona.motivation}</p>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold text-gray-600">PREFERRED CHANNEL</Label>
                        <Badge variant="outline">{persona.engagementStyle}</Badge>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSavePersona(persona)}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onSendToWizard([persona])}
                        >
                          Use in Campaign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}