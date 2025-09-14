export type CampaignPlan = {
  id: string;
  product: string;
  schedule: Array<{
    day: string; // e.g. "Day 1"
    task: "post" | "email";
    desc: string;
  }>;
};
