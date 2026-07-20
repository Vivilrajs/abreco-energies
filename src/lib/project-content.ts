// Default project gallery — fallback when DB is empty/unreachable.
import type { ProjectDTO } from "@/lib/data";

export const PROJECTS_CONTENT: ProjectDTO[] = [
  {
    _id: "default-1",
    title: "Rooftop Solar — 8kW System",
    category: "Residential",
    image: "",
    order: 1,
    published: true,
  },
  {
    _id: "default-2",
    title: "Commercial Warehouse Install",
    category: "Commercial",
    image: "",
    order: 2,
    published: true,
  },
  {
    _id: "default-3",
    title: "Heat Pump Hot Water",
    category: "Residential",
    image: "",
    order: 3,
    published: true,
  },
  {
    _id: "default-4",
    title: "Ducted Reverse-Cycle A/C",
    category: "Residential",
    image: "",
    order: 4,
    published: true,
  },
  {
    _id: "default-5",
    title: "Solar Battery Backup",
    category: "Residential",
    image: "",
    order: 5,
    published: true,
  },
  {
    _id: "default-6",
    title: "Multi-Unit Solar Retrofit",
    category: "Commercial",
    image: "",
    order: 6,
    published: true,
  },
];
