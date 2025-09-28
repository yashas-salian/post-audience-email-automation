import { campaignURL } from "../config"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"


interface Campaign {
  ID: string
  Product_name: string
  Campany_name: string
  Description: string
  Price: string
  Features: string
  USP: string
  Post_description: string
  Start_date: string
  End_date: string
  Status: string
  User_ID: string
  Posts?: any[]
  Ads?: any[]
}


export const useCampaignHook = () => {
    // const {user} = useUser()
    const [campaign , setCampaign] = useState<Campaign[]>([])
    const getCampaigns = useCallback(async ()=>{
        const res = await axios.get(`${campaignURL}/campaign`)
        try {
            if (res.data.data){
                console.log(res.data.data)
                setCampaign(res.data.data)
            }
            } catch (error) {
                // setError(error as string)
    }},[])

    useEffect(() => {
        getCampaigns()
    },[getCampaigns])

    return {campaign}
}