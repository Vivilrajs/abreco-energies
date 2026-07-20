// Default blog content — fallback when DB empty, mirrored by seed.
import type { BlogPostDTO } from "@/lib/data";

export const BLOG_CONTENT: BlogPostDTO[] = [
  {
    _id: "default-panels-needed",
    slug: "how-many-solar-panels-do-you-need",
    title: "How many solar panels do you need for your home?",
    excerpt:
      "Sizing a solar system comes down to your energy use, roof space, and sunlight. Here's how to work out the right number of panels.",
    body: "The number of panels you need depends on three things: your annual electricity use, the amount of usable roof space, and how much sun your location gets.\nA typical Australian home uses 15–20 kWh per day, which usually calls for a 6.6 kW system — around 16 to 18 panels.\nOur team runs a full assessment of your roof orientation, tilt, and shading, then designs a system that maximises output and rebate eligibility.",
    image: "",
    author: "Abreco Energies",
    date: "2025-12-25T00:00:00.000Z",
    readTime: "10 min read",
    published: true,
  },
  {
    _id: "default-innovations",
    slug: "latest-innovations-in-solar-technology",
    title: "Exploring the latest innovations in solar technology",
    excerpt:
      "From bifacial panels to smart inverters and next-gen batteries, solar tech is moving fast. Here's what matters for homeowners.",
    body: "Solar technology has advanced rapidly. Bifacial panels capture light on both sides for higher yield, while microinverters and power optimisers squeeze more from partially shaded roofs.\nBattery chemistry keeps improving too, with longer cycle life and better safety.\nWe only install trusted, high-efficiency brands so you benefit from these advances without the risk of unproven hardware.",
    image: "",
    author: "Abreco Energies",
    date: "2025-12-28T00:00:00.000Z",
    readTime: "15 min read",
    published: true,
  },
  {
    _id: "default-tax-deductions",
    slug: "understanding-solar-tax-deductions",
    title: "Understanding solar tax deductions for small businesses",
    excerpt:
      "Government incentives and instant asset write-offs can slash the cost of going solar for your business. Here's what to know.",
    body: "Small businesses can access several incentives when installing solar, including federal STCs and, at times, instant asset write-offs on eligible equipment.\nThese can dramatically shorten your payback period.\nWe handle the rebate paperwork and provide full documentation so your accountant has everything needed at tax time.",
    image: "",
    author: "Abreco Energies",
    date: "2025-12-29T00:00:00.000Z",
    readTime: "10 min read",
    published: true,
  },
];
