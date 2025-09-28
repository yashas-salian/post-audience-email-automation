import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { Search, Filter, Copy, Download, Edit3, MoreHorizontal, Check, X, Archive, Tag, Folder } from "lucide-react"
import { Button } from "../components/ui/button"

// ---------- Types ----------
interface PostAsset {
  id: string
  type: "post"
  platform: string
  caption: string
  imageUrl: string
  title: string
  tags?: string[]
  collection?: string
}

interface AdAsset {
  id: string
  type: "ad"
  platform: string
  headline: string
  body: string
  cta?: string
  bannerUrl?: string
  ratio?: string
  title: string
  tags?: string[]
  collection?: string
}

interface EmailAsset {
  id: string
  type: "email"
  sequenceType: string
  subject: string
  preheader: string
  html: string
  text: string
  sendDay: number
  title: string
  tags?: string[]
  collection?: string
}

interface PersonaAsset {
  id: string
  type: "persona"
  name: string
  demographics?: { age?: string; location?: string }
  psychographics?: string[]
  painPoints?: string[]
  platforms?: string[]
  motivations?: string[]
  tags?: string[]
  collection?: string
}

interface AssetLibrary {
  posts: PostAsset[]
  ads: AdAsset[]
  emails: EmailAsset[]
  personas: PersonaAsset[]
}

interface AssetActions {
  onReuse: () => void
  onDuplicate?: () => void
  onExport: () => void
  onEdit: () => void
  reuseLabel: string
}

// ---------- Mock Components ----------
const Tabs = ({ value, onValueChange, className, children }: any) => <div className={className}>{children}</div>
const TabsList = ({ children, className }: any) => <div className={`${className} bg-gray-100 p-1 rounded-lg flex`}>{children}</div>
const TabsTrigger = ({ value, children, onValueChange }: any) => (
  <button
    className="px-4 py-2 rounded-md text-sm font-medium flex-1 bg-white shadow-sm text-gray-900"
    onClick={() => onValueChange?.(value)}
  >
    {children}
  </button>
)
const TabsContent = ({ value, children, className }: any) => <div className={className}>{children}</div>
const Input = ({ className, ...props }: any) => (
  <input className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />
)
const MyButton = ({ variant = "default", size = "default", children, className, ...props }: any) => {
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
  }
  const sizes: Record<string, string> = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
  }
  return (
    <button className={`rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
const Card = ({ children, className }: any) => <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>
const Checkbox = ({ checked, onCheckedChange, id, ...props }: any) => (
  <input type="checkbox" id={id} checked={checked} onChange={(e: ChangeEvent<HTMLInputElement>) => onCheckedChange?.(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" {...props} />
)
const Label = ({ htmlFor, children, className }: any) => <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>
const Badge = ({ variant = "default", children, className }: any) => {
  const variants: Record<string, string> = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
  }
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
}
const Separator = ({ className }: any) => <hr className={`border-gray-200 ${className}`} />

// ---------- Preview Components ----------
const PostPreview = ({ asset, actions }: { asset: PostAsset; actions: AssetActions }) => (
  <Card className="p-4 space-y-3">
    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
      {asset.imageUrl ? <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover rounded-lg" /> : <div className="text-gray-400 text-sm">No Image</div>}
    </div>
    <div>
      <h3 className="font-medium text-sm">{asset.title}</h3>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{asset.caption}</p>
      <div className="flex items-center gap-1 mt-2">
        <Badge variant="secondary">{asset.platform}</Badge>
        {asset.tags?.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
      </div>
    </div>
    <div className="flex gap-2">
      <Button size="sm" onClick={actions.onReuse}>{actions.reuseLabel}</Button>
      <Button size="sm" variant="outline" onClick={actions.onEdit}><Edit3 className="w-3 h-3" /></Button>
      <Button size="sm" variant="outline" onClick={actions.onExport}><Download className="w-3 h-3" /></Button>
    </div>
  </Card>
)

// Similar TSX conversion needed for AdPreview, EmailPreview, PersonaPreview
// ... you can copy the same typing approach as PostPreview

// ---------- Asset Library Page ----------
export default function AssetLibraryPage() {
  const [tab, setTab] = useState<keyof AssetLibrary>("posts")
  const [library, setLibrary] = useState<AssetLibrary>({ posts: [], ads: [], emails: [], personas: [] })
  const [query, setQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [activeCollection, setActiveCollection] = useState("")
  const [activeTag, setActiveTag] = useState("")

  // Load / Save library
  useEffect(() => {
    const raw = localStorage.getItem("assetLibrary")
    if (raw) setLibrary(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem("assetLibrary", JSON.stringify(library))
  }, [library])

  // Current filtered list
  const currentList = useMemo(() => {
    const list = library[tab]
    return list.filter((item: any) => {
      const q = query.trim().toLowerCase()
      const qMatch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.caption?.toLowerCase().includes(q) ||
        item.headline?.toLowerCase().includes(q) ||
        item.body?.toLowerCase().includes(q) ||
        item.subject?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q)
      const tagMatch = !activeTag || item.tags?.includes(activeTag)
      const collectionMatch = !activeCollection || item.collection === activeCollection
      return qMatch && tagMatch && collectionMatch
    })
  }, [library, tab, query, activeTag, activeCollection])

  const toggleSelect = (id: string) => setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }))
  const clearSelection = () => setSelectedIds({})
  const bulkCount = Object.values(selectedIds).filter(Boolean).length

  // Render tab content
  const renderTabContent = (tabType: keyof AssetLibrary) => {
    const components = {
      posts: PostPreview,
      ads: PostPreview, // replace with AdPreview TSX
      emails: PostPreview, // replace with EmailPreview TSX
      personas: PostPreview, // replace with PersonaPreview TSX
    }
    const PreviewComponent = components[tabType]
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentList.map((item: any) => (
          <div key={item.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <Checkbox checked={!!selectedIds[item.id]} onCheckedChange={() => toggleSelect(item.id)} id={`select-${item.id}`} />
            </div>
            <PreviewComponent
              asset={item}
              actions={{
                onReuse: () => console.log("Reuse", item),
                onExport: () => console.log("Export", item),
                onEdit: () => console.log("Edit", item),
                reuseLabel: "Reuse",
              }}
            />
          </div>
        ))}
        {currentList.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or create new assets to populate your library.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Library</h1>
        <p className="text-gray-600">Centralized repository for your generated posts, ads, emails, and personas</p>
      </header>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="posts" onValueChange={setTab}>Posts ({library.posts.length})</TabsTrigger>
          <TabsTrigger value="ads" onValueChange={setTab}>Ads ({library.ads.length})</TabsTrigger>
          <TabsTrigger value="emails" onValueChange={setTab}>Emails ({library.emails.length})</TabsTrigger>
          <TabsTrigger value="personas" onValueChange={setTab}>Personas ({library.personas.length})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-6">{renderTabContent(tab)}</TabsContent>
      </Tabs>
    </main>
  )
}
