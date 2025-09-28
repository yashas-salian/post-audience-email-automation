"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Common = {
  id: string
  title?: string
  tags?: string[]
  collection?: string
  createdAt?: string
}

export type PostAsset = Common & {
  type: "post"
  platform: "instagram" | "linkedin" | "twitter" | "facebook"
  caption: string
  imageUrl?: string
}

export type AdAsset = Common & {
  type: "ad"
  platform: "facebook" | "linkedin" | "google"
  headline: string
  body: string
  cta: string
  bannerUrl?: string
  ratio?: "1:1" | "1.91:1" | "9:16"
}

export type EmailAsset = Common & {
  type: "email"
  sequenceType: "single" | "drip-3"
  subject: string
  preheader?: string
  html: string
  text: string
  sendDay?: number
}

export type PersonaAsset = Common & {
  type: "persona"
  name: string
  demographics: { age?: string; location?: string; income?: string }
  psychographics?: string[]
  painPoints?: string[]
  platforms?: string[]
  motivations?: string[]
}

type ActionBarProps = {
  onReuse?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onEdit?: () => void
  reuseLabel?: string
}

export function ActionBar({ onReuse, onDuplicate, onExport, onEdit, reuseLabel = "Reuse" }: ActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="default" onClick={onReuse}>
        {reuseLabel}
      </Button>
      <Button size="sm" variant="secondary" onClick={onDuplicate}>
        Duplicate
      </Button>
      <Button size="sm" variant="outline" onClick={onExport}>
        Export
      </Button>
      <Button size="sm" variant="ghost" onClick={onEdit}>
        Edit
      </Button>
    </div>
  )
}

export function PostPreview({
  asset,
  actions,
}: {
  asset: PostAsset
  actions: ActionBarProps
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-pretty">{asset.title || "Social Post"}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {asset.platform}
          </Badge>
          {asset.collection ? <Badge variant="secondary">{asset.collection}</Badge> : null}
          {asset.tags?.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border bg-card flex items-center justify-center">
          <img
            src={asset.imageUrl || "/placeholder.svg?height=320&width=320&query=post+image+thumbnail"}
            alt="Post image preview"
            className="w-full max-h-64 object-cover rounded-md"
          />
        </div>
        <p className="text-sm leading-relaxed">{asset.caption}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <ActionBar {...actions} reuseLabel="Reuse" />
      </CardFooter>
    </Card>
  )
}

export function AdPreview({
  asset,
  actions,
}: {
  asset: AdAsset
  actions: ActionBarProps
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-pretty">{asset.title || "Ad Creative"}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {asset.platform}
          </Badge>
          {asset.ratio ? <Badge variant="secondary">{asset.ratio}</Badge> : null}
          {asset.collection ? <Badge variant="secondary">{asset.collection}</Badge> : null}
          {asset.tags?.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border bg-card flex items-center justify-center">
          <img
            src={asset.bannerUrl || "/placeholder.svg?height=220&width=400&query=banner+mockup"}
            alt="Ad banner preview"
            className="w-full max-h-56 object-cover rounded-md"
          />
        </div>
        <div className="space-y-1">
          <p className="font-medium">{asset.headline}</p>
          <p className="text-sm leading-relaxed">{asset.body}</p>
          <Badge variant="default" className="mt-1">
            {asset.cta}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <ActionBar {...actions} reuseLabel="Reuse" />
      </CardFooter>
    </Card>
  )
}

export function EmailPreview({
  asset,
  actions,
}: {
  asset: EmailAsset
  actions: ActionBarProps
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-pretty">{asset.title || "Email"}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2">
          <span className="text-xs">{asset.sequenceType === "single" ? "Single Email" : "3-Step Drip"}</span>
          {typeof asset.sendDay === "number" ? <Badge variant="secondary">Day {asset.sendDay}</Badge> : null}
          {asset.collection ? <Badge variant="secondary">{asset.collection}</Badge> : null}
          {asset.tags?.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Subject:</span> {asset.subject}
          </p>
          {asset.preheader ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Preheader:</span> {asset.preheader}
            </p>
          ) : null}
        </div>
        <div
          className="rounded-md border bg-card p-3 max-h-56 overflow-auto text-sm leading-relaxed"
          aria-label="HTML preview"
        >
          <div dangerouslySetInnerHTML={{ __html: asset.html }} />
        </div>
        <details className="text-xs">
          <summary className="cursor-pointer">View plain-text</summary>
          <pre className="mt-2 whitespace-pre-wrap">{asset.text}</pre>
        </details>
      </CardContent>
      <CardFooter className="mt-auto">
        <ActionBar {...actions} reuseLabel="Reuse" />
      </CardFooter>
    </Card>
  )
}

export function PersonaPreview({
  asset,
  actions,
}: {
  asset: PersonaAsset
  actions: ActionBarProps
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-pretty">{asset.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          {asset.demographics?.age ? <Badge variant="outline">{asset.demographics.age}</Badge> : null}
          {asset.demographics?.location ? <Badge variant="outline">{asset.demographics.location}</Badge> : null}
          {asset.collection ? <Badge variant="secondary">{asset.collection}</Badge> : null}
          {asset.tags?.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {asset.psychographics?.length ? (
          <div>
            <p className="text-xs font-medium mb-1">Psychographics</p>
            <div className="flex flex-wrap gap-1">
              {asset.psychographics.map((p) => (
                <Badge key={p} variant="outline">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
        {asset.painPoints?.length ? (
          <div>
            <p className="text-xs font-medium mb-1">Pain Points</p>
            <ul className="list-disc pl-4 text-sm">
              {asset.painPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {asset.platforms?.length ? (
          <div>
            <p className="text-xs font-medium mb-1">Platforms</p>
            <div className="flex flex-wrap gap-1">
              {asset.platforms.map((p) => (
                <Badge key={p} variant="outline" className="capitalize">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto">
        <ActionBar {...actions} reuseLabel="Reuse" />
      </CardFooter>
    </Card>
  )
}
