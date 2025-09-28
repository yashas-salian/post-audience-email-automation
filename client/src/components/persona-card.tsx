"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type Persona = {
  id: string
  name: string
  ageRange: string
  occupation: string
  income: string
  gender?: string
  demographics: string[]
  psychographics: string[]
  painPoints: string[]
  platforms: string[]
  motivation: string
  engagementStyle: string
}

export function PersonaCard({
  persona,
  selected,
  onSelect,
}: {
  persona: Persona
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full text-left transition-colors ${selected ? "ring-2 ring-primary" : ""}`}
      aria-pressed={selected}
    >
      <Card className="bg-card hover:bg-muted/40 p-4 rounded-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={`/placeholder.svg?height=48&width=48&query=persona avatar`}
              alt={`Avatar for ${persona.name}`}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-base font-medium text-foreground">{persona.name}</h3>
              <p className="text-xs text-muted-foreground">
                {persona.ageRange} • {persona.occupation}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {persona.engagementStyle}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {persona.platforms.slice(0, 3).map((p) => (
            <Badge key={p} variant="outline" className="text-xs">
              {p}
            </Badge>
          ))}
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{persona.motivation}</p>
      </Card>
    </button>
  )
}
