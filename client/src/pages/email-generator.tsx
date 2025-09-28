"use client"

import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type SequenceType = "single" | "drip"
type Goal = "welcome" | "product_launch" | "promotional_sale" | "cart_recovery" | "reengagement" | "newsletter"
type Tone = "formal" | "friendly" | "witty" | "professional" | "empathetic"
type CTA = "Buy Now" | "Sign Up" | "Learn More" | "Book Demo"

type EmailPiece = {
  day?: number
  subject: string
  preheader: string
  body_html: string
  body_text: string
  ctas: { text: string; url: string }[]
  estimated_spam_score: number
  estimated_readability: number
  recommended_send_time?: string
}

type Variant = {
  variantId: string
  emails: EmailPiece[]
  metadata: { tone: Tone; created_by: string }
}

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function htmlFromText(text: string, cta: CTA) {
  const safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.6; color: var(--foreground);">
      <div style="padding:16px;">
        ${safe}
        <div style="margin-top:16px;">
          <a href="https://example.com" style="display:inline-block; background: var(--primary); color: var(--primary-foreground); padding:10px 14px; border-radius: 8px; text-decoration:none;">${cta}</a>
        </div>
        <hr style="margin:24px 0; opacity:.2"/>
        <p style="font-size:12px; opacity:.7;">You received this email because you opted in. <a href="#" style="color:inherit;">Unsubscribe</a>.</p>
      </div>
    </div>
  `
}

export default function EmailGeneratorPage() {
  const navigate = useNavigate()

  // Form state
  const [goal, setGoal] = React.useState<Goal>("product_launch")
  const [tone, setTone] = React.useState<Tone>("friendly")
  const [productDescription, setProductDescription] = React.useState("")
  const [primaryCTA, setPrimaryCTA] = React.useState<CTA>("Buy Now")
  const [language, setLanguage] = React.useState("en-US")
  const [sequenceType, setSequenceType] = React.useState<SequenceType>("drip")
  const [tokens, setTokens] = React.useState<string>("{{first_name}}, {{product}}")
  const [nVariants, setNVariants] = React.useState<number>(3)
  const [abTestSubjects, setAbTestSubjects] = React.useState<boolean>(true)
  const [includeImages, setIncludeImages] = React.useState<boolean>(false)
  const [template, setTemplate] = React.useState<string>("basic")
  const [bestTime, setBestTime] = React.useState<boolean>(true)

  // Generation state
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [variants, setVariants] = React.useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null)

  // Send test dialog
  const [sendTestOpen, setSendTestOpen] = React.useState(false)
  const [testEmail, setTestEmail] = React.useState("test@example.com")

  function simulateVariant(idx: number): Variant {
    const baseSubject =
      goal === "product_launch"
        ? "Meet " + (productDescription.match(/([A-Z][A-Za-z0-9]+)/)?.[0] || "our new product")
        : goal === "welcome"
          ? "Welcome to our world"
          : goal === "promotional_sale"
            ? "Limited-time offer inside"
            : goal === "cart_recovery"
              ? "You left something behind"
              : goal === "reengagement"
                ? "We miss you"
                : "Your update is here"

    function mkEmail(day?: number): EmailPiece {
      const textBody =
        `Hi {{first_name}},\n\n${productDescription || "Here’s a quick update about our offering."}\n\n` +
        `We think you’ll love it.\n\n— Team`
      return {
        day,
        subject: `${baseSubject}${abTestSubjects ? ` (v${idx + 1})` : ""}`,
        preheader: goal === "product_launch" ? "Fresh features, crafted for you." : "A quick note you’ll find useful.",
        body_text: textBody,
        body_html: htmlFromText(textBody, primaryCTA),
        ctas: [{ text: primaryCTA, url: "https://example.com" }],
        estimated_spam_score: Math.round((Math.random() * 6 + 2) * 10) / 10,
        estimated_readability: Math.floor(Math.random() * 20 + 55),
        recommended_send_time: bestTime ? new Date(Date.now() + 36e5).toISOString() : undefined,
      }
    }

    const emails = sequenceType === "single" ? [mkEmail()] : [mkEmail(0), mkEmail(2), mkEmail(5)]

    return {
      variantId: `v${idx + 1}`,
      emails,
      metadata: { tone, created_by: "AI-v1" },
    }
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault()
    setIsGenerating(true)
    // Simulate latency
    await new Promise((r) => setTimeout(r, 600))
    const count = Math.min(Math.max(nVariants, 1), 4)
    const generated = Array.from({ length: count }, (_, i) => simulateVariant(i))
    setVariants(generated)
    setSelectedVariant(generated[0]?.variantId || null)
    setIsGenerating(false)
  }

  function onExportJSON() {
    downloadJSON("email-sequence.json", {
      goal,
      tone,
      language,
      sequenceType,
      primaryCTA,
      variants,
      metadata: { generated_by: "AI-v1", template, includeImages },
    })
  }

  function onSaveToLibrary() {
    try {
      const existing = JSON.parse(localStorage.getItem("emailLibrary") || "[]")
      existing.push({
        savedAt: new Date().toISOString(),
        goal,
        tone,
        language,
        sequenceType,
        primaryCTA,
        variants,
        template,
        includeImages,
      })
      localStorage.setItem("emailLibrary", JSON.stringify(existing))
      alert("Saved to Library")
    } catch {
      alert("Could not save. Local storage unavailable.")
    }
  }

  function onSendToCampaign() {
    try {
      const payload = {
        goal,
        tone,
        language,
        sequenceType,
        primaryCTA,
        variants,
      }
      localStorage.setItem("campaignEmailSequence", JSON.stringify(payload))
      navigate("/campaign-wizard")
    } catch {
      alert("Could not attach to campaign.")
    }
  }

  function onSendTest() {
    // Mocked "send test"
    setTimeout(() => {
      setSendTestOpen(false)
      alert(`Test email "sent" to ${testEmail} (demo)`)
    }, 400)
  }

  const selected = React.useMemo(
    () => variants.find((v) => v.variantId === selectedVariant),
    [variants, selectedVariant],
  )

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-semibold">Email Sequence Generator</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExportJSON}>
            Export JSON
          </Button>
          <Button variant="outline" onClick={onSaveToLibrary}>
            Save to Library
          </Button>
          <Button onClick={onSendToCampaign}>Send to Campaign</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Brief</CardTitle>
            <CardDescription>Minimal inputs with optional advanced settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onGenerate} className="space-y-4">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Select value={goal} onValueChange={(v: Goal) => setGoal(v)}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="product_launch">Product Launch</SelectItem>
                      <SelectItem value="promotional_sale">Promotional Sale</SelectItem>
                      <SelectItem value="cart_recovery">Cart Recovery</SelectItem>
                      <SelectItem value="reengagement">Re-engagement</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v: Tone) => setTone(v)}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="witty">Witty</SelectItem>
                      <SelectItem value="empathetic">Empathetic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desc">Product / Offer description</Label>
                  <Textarea
                    id="desc"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="EcoBottle — reusable 500ml bottle, BPA-free, keeps drinks cold 12 hours"
                    rows={4}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cta">Primary CTA</Label>
                  <Select value={primaryCTA} onValueChange={(v: CTA) => setPrimaryCTA(v as CTA)}>
                    <SelectTrigger id="cta">
                      <SelectValue placeholder="Select primary CTA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buy Now">Buy Now</SelectItem>
                      <SelectItem value="Sign Up">Sign Up</SelectItem>
                      <SelectItem value="Learn More">Learn More</SelectItem>
                      <SelectItem value="Book Demo">Book Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lang">Language / Locale</Label>
                  <Input id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="en-US" />
                </div>

                <div className="grid gap-2">
                  <Label>Sequence type</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="single"
                        checked={sequenceType === "single"}
                        onCheckedChange={(ck) => ck && setSequenceType("single")}
                      />
                      <Label htmlFor="single">Single</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="drip"
                        checked={sequenceType === "drip"}
                        onCheckedChange={(ck) => ck && setSequenceType("drip")}
                      />
                      <Label htmlFor="drip">Drip (3 emails)</Label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tokens">Personalization tokens</Label>
                  <Input
                    id="tokens"
                    value={tokens}
                    onChange={(e) => setTokens(e.target.value)}
                    placeholder="{{first_name}}, {{company}}, {{product}}"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="variants">Number of variants</Label>
                  <Input
                    id="variants"
                    type="number"
                    min={1}
                    max={4}
                    value={nVariants}
                    onChange={(e) => setNVariants(Number(e.target.value))}
                  />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adv">Advanced options</Label>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">A/B test subject lines</span>
                      <Switch checked={abTestSubjects} onCheckedChange={setAbTestSubjects} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Include image (banner)</span>
                      <Switch checked={includeImages} onCheckedChange={setIncludeImages} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Best-time send window</span>
                      <Switch checked={bestTime} onCheckedChange={setBestTime} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tpl">Template</Label>
                      <Select value={template} onValueChange={setTemplate}>
                        <SelectTrigger id="tpl">
                          <SelectValue placeholder="Choose template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="mjml-basic">MJML - Basic</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Select a variant to inspect and edit</CardDescription>
          </CardHeader>
          <CardContent>
            {variants.length === 0 ? (
              <p className="text-sm opacity-70">No output yet. Fill the brief and click Generate.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <Button
                      key={v.variantId}
                      variant={selectedVariant === v.variantId ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariant(v.variantId)}
                    >
                      Variant {v.variantId.toUpperCase()}
                    </Button>
                  ))}
                </div>

                {selected && (
                  <div className="space-y-4">
                    {sequenceType === "drip" && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Timeline</Badge>
                        <div className="flex items-center gap-2 text-xs opacity-80">
                          <span>Day 0</span>
                          <span>•</span>
                          <span>Day 2</span>
                          <span>•</span>
                          <span>Day 5</span>
                        </div>
                      </div>
                    )}

                    {selected.emails.map((em, idx) => (
                      <Card key={idx}>
                        <CardHeader className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {typeof em.day === "number" ? <Badge>Day {em.day}</Badge> : <Badge>Single</Badge>}
                              <Badge variant="secondary">{tone}</Badge>
                              <Badge variant="secondary">{language}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-80">Spam {em.estimated_spam_score}</span>
                              <span className="text-xs opacity-80">Readability {em.estimated_readability}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Label className="text-xs">Subject</Label>
                            <Input
                              value={em.subject}
                              onChange={(e) => {
                                const next = variants.map((v) =>
                                  v.variantId === selected.variantId
                                    ? {
                                        ...v,
                                        emails: v.emails.map((mail, i) =>
                                          i === idx ? { ...mail, subject: e.target.value } : mail,
                                        ),
                                      }
                                    : v,
                                )
                                setVariants(next)
                              }}
                            />
                          </div>
                          <div className="mt-2">
                            <Label className="text-xs">Preheader</Label>
                            <Input
                              value={em.preheader}
                              onChange={(e) => {
                                const next = variants.map((v) =>
                                  v.variantId === selected.variantId
                                    ? {
                                        ...v,
                                        emails: v.emails.map((mail, i) =>
                                          i === idx ? { ...mail, preheader: e.target.value } : mail,
                                        ),
                                      }
                                    : v,
                                )
                                setVariants(next)
                              }}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Tabs defaultValue="html">
                            <TabsList>
                              <TabsTrigger value="html">HTML</TabsTrigger>
                              <TabsTrigger value="text">Plain Text</TabsTrigger>
                            </TabsList>
                            <TabsContent value="html" className="space-y-2">
                              <div className="rounded-md border p-3">
                                <div
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: em.body_html }}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label className="text-xs">Edit HTML (quick)</Label>
                                <Textarea
                                  rows={6}
                                  value={em.body_html}
                                  onChange={(e) => {
                                    const next = variants.map((v) =>
                                      v.variantId === selected.variantId
                                        ? {
                                            ...v,
                                            emails: v.emails.map((mail, i) =>
                                              i === idx ? { ...mail, body_html: e.target.value } : mail,
                                            ),
                                          }
                                        : v,
                                    )
                                    setVariants(next)
                                  }}
                                />
                              </div>
                            </TabsContent>
                            <TabsContent value="text" className="space-y-2">
                              <Textarea
                                rows={8}
                                value={em.body_text}
                                onChange={(e) => {
                                  const next = variants.map((v) =>
                                    v.variantId === selected.variantId
                                      ? {
                                          ...v,
                                          emails: v.emails.map((mail, i) =>
                                            i === idx ? { ...mail, body_text: e.target.value } : mail,
                                          ),
                                        }
                                      : v,
                                  )
                                  setVariants(next)
                                }}
                              />
                            </TabsContent>
                          </Tabs>

                          <div className="flex flex-wrap items-center gap-2">
                            {em.ctas.map((c, i) => (
                              <Button key={i} variant="outline" size="sm">
                                {c.text}
                              </Button>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setSendTestOpen(true)}>
                              Send Test
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onExportJSON()}>
                              Export
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={sendTestOpen} onOpenChange={setSendTestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>Enter an email address to receive a preview (demo only).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="testEmail">Recipient</Label>
            <Input id="testEmail" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendTestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSendTest}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
