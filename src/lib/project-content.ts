// Default project gallery - fallback when DB is empty/unreachable.
import type { ProjectDTO } from "@/lib/data";

export const PROJECTS_CONTENT: ProjectDTO[] = [
  {
    _id: "default-1",
    slug: "rooftop-solar-8kw",
    title: "Rooftop Solar – 8 kW System",
    category: "Residential",
    description:
      "A full 8 kW rooftop solar installation for a family home in Victoria. The system includes high-efficiency panels and a smart inverter, reducing the household's electricity bill by over 70%. Rebates were fully managed by our team.",
    image: "/assets/projects/proj-1.png",
    order: 1,
    published: true,
  },
  {
    _id: "default-2",
    slug: "commercial-warehouse-solar",
    title: "Commercial Warehouse Install",
    category: "Commercial",
    description:
      "A 30 kW solar array installed across the roof of a distribution warehouse in South Australia. Designed to offset peak-hour grid draw, the system integrates with the facility's existing energy management software.",
    image: "/assets/projects/proj-2.png",
    order: 2,
    published: true,
  },
  {
    _id: "default-3",
    slug: "heat-pump-hot-water",
    title: "Heat Pump Hot Water",
    category: "Residential",
    description:
      "Replacement of a conventional electric hot-water system with a heat-pump unit in Queensland. The upgrade cuts hot-water energy consumption by up to 75% and qualifies for state government rebates.",
    image: "/assets/projects/proj-3.png",
    order: 3,
    published: true,
  },
  {
    _id: "default-4",
    slug: "ducted-reverse-cycle",
    title: "Ducted Reverse-Cycle A/C",
    category: "Residential",
    description:
      "Full ducted reverse-cycle air-conditioning installation across a four-bedroom home in New South Wales. Zone control and smart thermostat were included, giving the owners precise control and significant energy savings.",
    image: "/assets/projects/proj-4.png",
    order: 4,
    published: true,
  },
  {
    _id: "default-5",
    slug: "solar-battery-backup",
    title: "Solar Battery Backup",
    category: "Residential",
    description:
      "A 10 kWh battery storage system paired with an existing 6.6 kW solar array in Western Australia. The battery provides overnight energy independence and acts as a backup during grid outages.",
    image: "/assets/projects/proj-5.png",
    order: 5,
    published: true,
  },
  {
    _id: "default-6",
    slug: "multi-unit-solar-retrofit",
    title: "Multi-Unit Solar Retrofit",
    category: "Commercial",
    description:
      "Shared solar installation across a 12-unit apartment complex in Melbourne. Each apartment benefits from a proportional share of the generation, with billing managed through a virtual net metering arrangement.",
    image: "/assets/projects/proj-6.png",
    order: 6,
    published: true,
  },
];
