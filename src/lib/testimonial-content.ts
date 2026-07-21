// Default testimonials — fallback when DB is empty/unreachable.
import type { TestimonialDTO } from "@/lib/data";

export const TESTIMONIALS_CONTENT: TestimonialDTO[] = [
  {
    _id: "default-1",
    name: "Sarah M.",
    role: "Homeowner, Melbourne",
    quote:
      "The whole process was seamless — from the free consultation to installation day. Our power bills dropped almost immediately.",
    avatar: "/assets/testimonials/testi-1.png",
    rating: 5,
    order: 1,
    published: true,
  },
  {
    _id: "default-2",
    name: "James T.",
    role: "Homeowner, Brisbane",
    quote:
      "Professional installers, honest advice, and they handled all the rebate paperwork for us. Couldn't ask for more.",
    avatar: "/assets/testimonials/testi-2.png",
    rating: 5,
    order: 2,
    published: true,
  },
  {
    _id: "default-3",
    name: "Priya K.",
    role: "Business Owner, Sydney",
    quote:
      "We upgraded our warehouse to solar and a battery system. Great communication throughout and the savings speak for themselves.",
    avatar: "/assets/testimonials/testi-3.png",
    rating: 5,
    order: 3,
    published: true,
  },
];
