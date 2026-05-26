import type { Metadata } from "next";
import { LegalPage } from "@/components/ceiro/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Ceiro",
  description:
    "Ceiro privacy policy for website inquiries, contact information, analytics, and SMS communications.",
};

const sections = [
  {
    title: "Information Collected Through Forms",
    body: [
      "Ceiro may collect information you choose to submit through website forms, audit requests, booking links, or email inquiries. This may include your name, business name, email address, phone number, website URL, project details, and any message you provide.",
      "We use this information to review your inquiry, respond to your request, prepare recommendations, schedule calls, and provide website, automation, and lead-system services.",
    ],
  },
  {
    title: "Contact Information Usage",
    body: [
      "Ceiro uses submitted contact information to communicate with you about your inquiry, requested services, project updates, support needs, and related business communications.",
      "Support and customer inquiries can be sent to hello@bookiq.co.",
    ],
  },
  {
    title: "Cookies And Analytics Usage",
    body: [
      "Ceiro may use cookies, analytics tools, and similar technologies to understand website traffic, page performance, user behavior, and conversion activity.",
      "This information helps us improve the website experience, measure marketing performance, and identify ways to make the site easier to use.",
    ],
  },
  {
    title: "Data Protection",
    body: [
      "Ceiro takes reasonable steps to protect submitted information from unauthorized access, loss, misuse, or disclosure.",
      "No website or online transmission can be guaranteed to be completely secure, but we use practical safeguards appropriate for a modern business website and service inquiry workflow.",
    ],
  },
  {
    title: "Data Is Not Sold",
    body: [
      "Ceiro does not sell personal information, lead information, contact details, or SMS opt-in data.",
      "Information may be shared with service providers only when needed to operate the website, manage communications, deliver requested services, or comply with legal obligations.",
    ],
  },
  {
    title: "SMS Communication Disclosure",
    body: [
      "If you provide a phone number and consent to receive messages, Ceiro may send SMS communications related to your inquiry, audit request, booking, service updates, or support needs.",
      "Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help.",
    ],
  },
  {
    title: "Support Contact Information",
    body: [
      "For privacy questions, support requests, communication preferences, or help with SMS messages, contact Ceiro at hello@bookiq.co.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="How Ceiro handles inquiry and communication data."
      intro="This policy explains how Ceiro collects, uses, protects, and manages information submitted through bookiq.co and related Ceiro communication channels."
      sections={sections}
    />
  );
}
