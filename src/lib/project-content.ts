// Default project gallery - fallback when DB is empty/unreachable.
import type { ProjectDTO } from "@/lib/data";

export const PROJECTS_CONTENT: ProjectDTO[] = [
  {
    _id: "default-1",
    title: "Rooftop Solar - 8kW System",
    category: "Residential",
    image: "/assets/projects/proj-1.png",
    order: 1,
    published: true,
  },
  {
    _id: "default-2",
    title: "Commercial Warehouse Install",
    category: "Commercial",
    image: "/assets/projects/proj-2.png",
    order: 2,
    published: true,
  },
  {
    _id: "default-3",
    title: "Heat Pump Hot Water",
    category: "Residential",
    image: "/assets/projects/proj-3.png",
    order: 3,
    published: true,
  },
  {
    _id: "default-4",
    title: "Ducted Reverse-Cycle A/C",
    category: "Residential",
    image: "/assets/projects/proj-4.png",
    order: 4,
    published: true,
  },
  {
    _id: "default-5",
    title: "Solar Battery Backup",
    category: "Residential",
    image: "/assets/projects/proj-5.png",
    order: 5,
    published: true,
  },
  {
    _id: "default-6",
    title: "Multi-Unit Solar Retrofit",
    category: "Commercial",
    image: "/assets/projects/proj-6.png",
    order: 6,
    published: true,
  },
];
