// Canonical default content for the 5 products. Used as a fallback when the DB
// is empty/unreachable, and mirrored by scripts/seed.mjs for DB seeding.
import type { SolutionDTO } from "@/lib/data";

export const PRODUCTS_CONTENT: SolutionDTO[] = [
  {
    _id: "default-heat-pumps",
    slug: "heat-pumps",
    title: "Heat Pumps",
    icon: "♨️",
    order: 1,
    published: true,
    description:
      "Efficient heat pumps that keep your home comfortable year-round.",
    tagline: "Heat pumps cut power use, boost savings!",
    headline: "What is so good about Heat Pumps?",
    intro:
      "Energy-efficient heat pump hot water systems for homes and businesses across Australia. We handle system selection, installation by qualified plumbers and electricians, and access to government incentives.",
    heroImage: "",
    heroVideo: "",
    ctaLabel: "Get Now!",
    benefits: [
      {
        icon: "💧",
        text: "This innovative renewable energy water heating technology consumes up to 70% less energy than traditional water heaters, providing dependable hot water around the clock.",
      },
      {
        icon: "🛡️",
        text: "Premium heat pumps are designed for longevity, featuring durable materials and cutting-edge technology. With fewer moving parts, they require minimal maintenance and come with long-term warranties.",
      },
      {
        icon: "💰",
        text: "Our electric heat pumps can cut energy costs by up to 60%-70%, saving you as much as $700-$850 per year. Maximize savings further with available government rebates.",
      },
      {
        icon: "✨",
        text: "Our heat pump water heater installations combine innovation, sustainability, versatility, and ease of use for an exceptional water heating solution.",
      },
    ],
    commercial: {
      title: "Commercial Heat Pump Installations",
      body: "We help Australian businesses upgrade to energy-efficient heat pump hot water systems. We handle system selection, installation by qualified plumbers and electricians, and access to government incentives. Businesses benefit from lower energy costs, reliable hot water, and a more sustainable operation.",
      scenarios: [
        "Replacing gas or electric systems with heat pumps",
        "Installing new heat pump systems",
      ],
      image: "",
    },
    residential: {
      title: "Residential Heat Pump Installations",
      body: "We make it simple for Australian homeowners to switch to energy-efficient heat pump hot water systems. We guide you through choosing the right system, arrange installation by qualified plumbers and electricians, and help access government rebates. Enjoy lower energy bills, dependable hot water, and a greener home.",
      scenarios: [
        "Replacing gas or electric hot water systems with heat pumps",
        "Installing new heat pump systems",
      ],
      image: "",
    },
  },
  {
    _id: "default-air-conditioning",
    slug: "air-conditioning",
    title: "Air Conditioning Units",
    icon: "❄️",
    order: 2,
    published: true,
    description:
      "Eco-friendly air conditioners that save energy while enhancing comfort.",
    tagline: "Smart AC, cooler home, lower bills!",
    headline: "What is so good about Air Conditioners?",
    intro:
      "Energy-efficient air conditioning systems tailored to homes and businesses. We manage system selection, professional installation by qualified technicians, and guidance on available incentives.",
    heroImage: "",
    heroVideo: "",
    ctaLabel: "Get Now!",
    benefits: [
      {
        icon: "🌡️",
        text: "This advanced air conditioning technology uses up to 30–50% less energy than traditional systems, keeping your home comfortable year-round while cutting electricity costs.",
      },
      {
        icon: "🛡️",
        text: "Our high-quality air conditioners are built to last, using robust components and modern technology. Engineered for low upkeep and backed by extended warranties.",
      },
      {
        icon: "💰",
        text: "Our energy-efficient air conditioners can reduce electricity bills by up to 40–50%, helping you save hundreds each year. Government rebates can further increase your savings.",
      },
      {
        icon: "🎛️",
        text: "Our air conditioning systems deliver cutting-edge performance, eco-friendly operation, flexible control, and reliable comfort for your home or office.",
      },
    ],
    commercial: {
      title: "Commercial Air Conditioning Installations",
      body: "We help Australian businesses install energy-efficient air conditioning systems tailored to their needs. We manage system selection, professional installation by qualified technicians, and can guide you on available incentives.",
      scenarios: [
        "Installing single split air conditioners",
        "Installing multi-split systems",
        "Installing ducted air conditioning systems",
      ],
      image: "",
    },
    residential: {
      title: "Residential Air Conditioning Installations",
      body: "We help Australian homeowners upgrade to energy-efficient air conditioning systems designed for their home. We assist with choosing the right system, coordinate professional installation, and provide guidance on available rebates.",
      scenarios: [
        "Installing single split air conditioners",
        "Installing multi-split systems",
        "Installing ducted air conditioning systems",
      ],
      image: "",
    },
  },
  {
    _id: "default-residential-solar",
    slug: "residential-solar",
    title: "Residential Solar",
    icon: "🏡",
    order: 3,
    published: true,
    description: "Reliable solar solutions for a greener, more efficient home.",
    tagline: "Sun-powered savings, brighter home, lower bills!",
    headline: "Why Choose a Solar System?",
    intro:
      "We help Australian households make the switch to clean, renewable energy. Our residential solar systems deliver reliable performance, long-term savings, and a brighter, greener future. Custom-designed solutions maximise your roof's potential - efficient, durable, and easy to maintain. SAA and CEC-accredited installers deliver safe, professional installations.",
    heroImage: "",
    heroVideo: "",
    ctaLabel: "Get Now!",
    benefits: [
      { icon: "💰", text: "Save Money on Electricity – Generate your own clean power and see up to 30–40% reduction in energy bills." },
      { icon: "⚡", text: "Stay Energy Independent – Rely less on the grid and protect yourself from rising power costs." },
      { icon: "🏡", text: "Increase Property Value – Homes with solar systems are more desirable and energy-efficient." },
      { icon: "🌿", text: "Reduce Carbon Emissions – Do your part for the planet with clean, renewable energy." },
      { icon: "💡", text: "Government Rebates Available – Take advantage of state incentives and rebates to lower upfront costs." },
      { icon: "🧹", text: "Low Maintenance – Our systems are built to last and easy to keep clean." },
      { icon: "🔋", text: "Battery-Ready Options – Store excess energy for use day or night." },
    ],
    commercial: { title: "", body: "", scenarios: [], image: "" },
    residential: { title: "", body: "", scenarios: [], image: "" },
  },
  {
    _id: "default-commercial-solar",
    slug: "commercial-solar",
    title: "Commercial Solar",
    icon: "🏢",
    order: 4,
    published: true,
    description:
      "Reliable commercial solar systems that reduce costs and support the environment.",
    tagline: "Power your business with the sun, slash energy costs!",
    headline: "Why Choose Commercial Solar?",
    intro:
      "We help Australian businesses take control of their energy future with reliable, cost-effective commercial solar. Tailored systems maximise energy efficiency and long-term returns. From consultation through installation and ongoing support, we handle the entire process - ensuring maximum return on investment. SAA and CEC-accredited experts deliver installations that meet the highest standards.",
    heroImage: "",
    heroVideo: "",
    ctaLabel: "Get Now!",
    benefits: [
      { icon: "💼", text: "Lower Operational Costs – Slash your electricity bills and stabilise future energy expenses." },
      { icon: "⚡", text: "Energy Independence – Generate your own clean power and reduce reliance on the grid." },
      { icon: "💰", text: "Boost Your Bottom Line – Reinvest energy savings back into growing your business." },
      { icon: "🏢", text: "Increase Property Value – Solar installations add long-term asset value to your premises." },
      { icon: "🧾", text: "Government Incentives & Tax Benefits – Take advantage of available rebates and tax offsets." },
      { icon: "🌏", text: "Enhance Your Brand Image – Show customers and partners your commitment to sustainability." },
      { icon: "♻️", text: "Support Corporate Social Responsibility – Make your operations cleaner and more ethical." },
      { icon: "🧹", text: "Low Maintenance – Durable panels built for long-term performance with minimal upkeep." },
    ],
    commercial: { title: "", body: "", scenarios: [], image: "" },
    residential: { title: "", body: "", scenarios: [], image: "" },
  },
  {
    _id: "default-solar-battery",
    slug: "solar-battery",
    title: "Solar Battery",
    icon: "🔋",
    order: 5,
    published: true,
    description: "Store, save, and stay powered with smart solar batteries.",
    tagline: "Store the sun, use smarter, save longer!",
    headline: "Why Choose Solar Batteries?",
    intro:
      "Advanced solar battery systems that help homes and businesses make the most of their solar power. Smart battery solutions store excess energy produced during the day for use at night, in cloudy weather, or when the grid goes down - giving you uninterrupted, affordable, sustainable power. CEC-accredited professionals deliver end-to-end service from energy assessment to aftercare.",
    heroImage: "",
    heroVideo: "",
    ctaLabel: "Get Now!",
    benefits: [
      { icon: "⚡", text: "Energy Independence – Generate, store, and use your own clean power on demand." },
      { icon: "🔋", text: "Backup During Outages – Keep your home or business running even when the grid fails." },
      { icon: "💰", text: "Significant Cost Savings – Use stored energy during peak hours to reduce power bills." },
      { icon: "🏢", text: "Ideal for Homes & Businesses – Scalable solutions to meet any size or energy demand." },
      { icon: "🌏", text: "Sustainable & Eco-Friendly – Lower emissions and contribute to a cleaner environment." },
      { icon: "📈", text: "Increased Property & Asset Value – Add long-term value to your property or facility." },
      { icon: "🧠", text: "Smart Energy Monitoring – Track your production and usage in real time." },
      { icon: "🧱", text: "Durable & Low Maintenance – Built for long-lasting performance in all conditions." },
    ],
    commercial: { title: "", body: "", scenarios: [], image: "" },
    residential: { title: "", body: "", scenarios: [], image: "" },
  },
];
