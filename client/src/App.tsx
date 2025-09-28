import './App.css'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import  Dashboard  from './pages/dashboard'
import CampaignWizard from './pages/campaign-wizard'
import CampaignDetails from './pages/campaign'
import SocialGenerator from './pages/social-generator'
import AdGeneratorPage from './pages/ad-generator'
import AudienceProfilingPage from './pages/audience-profiling'
import EmailGeneratorPage from './pages/email-generator'
import AssetLibraryPage from './pages/asset-library'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaign-wizard" element={<CampaignWizard />} />
        <Route path="/campaign/:id" element={<CampaignDetailsPage />}/>
        <Route path="/social-generator" element={<SocialGenerator />} />
        <Route path="/ad-generator" element={<AdGeneratorPage />} />
        <Route path="/audience-profiling" element={<AudienceProfilingPage />} />
        <Route path="/email-generator" element={<EmailGeneratorPage />} />
        <Route path="/asset-library" element={<AssetLibraryPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>()
  return <CampaignDetails campaignId={id!} />
}

export default App
