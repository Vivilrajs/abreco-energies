// Default FAQ - fallback when DB is empty/unreachable.
import type { FaqDTO } from "@/lib/data";

export const FAQ_CONTENT: FaqDTO[] = [
  {
    _id: "default-1",
    question: "How much does installation cost?",
    answer:
      "Cost depends on your property, system size, and product choice. We provide a free, no-obligation quote after a short consultation, and handle all available government rebates to reduce the final price.",
    order: 1,
    published: true,
  },
  {
    _id: "default-2",
    question: "How long does an installation take?",
    answer:
      "Most residential heat pump, air conditioning, or solar installations are completed in a single day by our licensed, accredited installers.",
    order: 2,
    published: true,
  },
  {
    _id: "default-3",
    question: "Do you handle government rebates?",
    answer:
      "Yes. As an accredited provider we manage all federal and state rebate paperwork on your behalf, so the savings are applied automatically.",
    order: 3,
    published: true,
  },
  {
    _id: "default-4",
    question: "What areas do you service?",
    answer:
      "We're accredited and operating across VIC, NSW, QLD, and SA. Get in touch to confirm availability at your address.",
    order: 4,
    published: true,
  },
  {
    _id: "default-5",
    question: "Do you offer ongoing support after installation?",
    answer:
      "Yes - our team stays on hand for servicing, warranty claims, and any questions long after your system is installed.",
    order: 5,
    published: true,
  },
];
