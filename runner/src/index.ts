import { Hono } from 'hono'
import { getPrismaClient } from '../../share/prisma'
import axios from 'axios'

const app = new Hono()

async function callMicroservice(url: string, payload: any) {
  const response = await axios.post(url, payload)
  if (!response) throw new Error(`Microservice call failed`)
  return response.data
}

// --- Post to Instagram using Graph API ---
async function postToInstagram(accessToken: string, igUserId: string, content: string, imageUrl: string) {
  try {
    // 1. Create media container
    const mediaRes = await axios.post(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        image_url: imageUrl,
        caption: content,
        access_token: accessToken,
      }
    )

    const creationId = mediaRes.data.id

    // 2. Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        creation_id: creationId,
        access_token: accessToken,
      }
    )

    console.log('✅ Instagram post published:', publishRes.data)
    return publishRes.data
  } catch (err: any) {
    console.error('❌ Error posting to Instagram:', err.response?.data || err.message)
    throw err
  }
}

async function runDailyCampaigns(env: any) {
  const prisma = getPrismaClient(env.DATABASE_URL)
  const today = new Date()

  const campaigns = await prisma.campaign.findMany({
    where: { Status: 'ongoing' },
  })
  console.log(campaigns)

  for (const campaign of campaigns) {
    const campaignId = campaign.ID
    const startDate = campaign.Start_date
    const dayNumber =
      Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // --- Generate post daily ---
    const postExists = await prisma.post.findFirst({
      where: { Campaign_ID: campaignId, Day: dayNumber },
    })

    if (!postExists) {
      console.log(`Generating post for Campaign ${campaignId} day ${dayNumber}`)
      const postData = await callMicroservice(
        'http://127.0.0.1:8787/generate-image/social-post',
        {
          productDetails: campaign,
          type: 'post',
          prevDayPerformance: null,
          campaignId,
        }
      )

      // ✅ Save generated post in DB
      await prisma.post.create({
        data: {
          Campaign_ID: campaignId,
          Day: dayNumber,
          SURL: postData.image ?? '',
          Prompt: "",
          URL: ""
        },
      })

      // ✅ Post to Instagram via Graph API
      await postToInstagram(
        env.IG_ACCESS_TOKEN, // put in Cloudflare / env vars
        env.IG_USER_ID,
        postData.caption,
        postData.image
      )
    }

    // --- Generate ad on first day ---
    if (dayNumber === 1) {
      console.log(`Generating ad for Campaign ${campaignId}`)
      await callMicroservice('http://127.0.0.1:8787/generate-image/ad', {
        productDetails: campaign,
        type: 'ad',
      })
    }

    // TODO: generate email once
  }
}

app.get('/run-daily', async (c) => {
  await runDailyCampaigns(c.env)
  return c.json({ message: 'Campaign tasks executed' })
})

export default {
  fetch: app.fetch,
  scheduled: async (_event: any, env: any) => {
    await runDailyCampaigns(env)
  },
}
