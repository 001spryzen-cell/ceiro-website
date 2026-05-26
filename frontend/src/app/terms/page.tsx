import type { Metadata } from "next";
import { LegalPage } from "@/components/ceiro/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ceiro",
  description:
    "Ceiro terms and conditions for website usage, service inquiries, communications, and SMS messages.",
};

const sections = [
  {
    title: "Service Terms",
    body: [
      "Ceiro provides website design, automation strategy, lead-system implementation, conversion optimization, and related digital services. Any project scope, timeline, pricing, deliverables, and responsibilities will be defined in a separate proposal, agreement, or written communication.",
      "Submitting an inquiry or booking an audit does not create a service agreement until both parties confirm the scope and terms.",
    ],
  },
  {
    title: "Website Usage Terms",
    body: [
      "You may use the Ceiro website for lawful business inquiry, informational, and communication purposes only.",
      "You agree not to misuse the website, attempt unauthorized access, submit harmful content, interfere with website operation, or use the site in a way that violates applicable laws.",
    ],
  },
  {
    title: "Communication Consent",
    body: [
      "By submitting a form, sending an email, booking a call, or otherwise contacting Ceiro, you consent to receive communications from Ceiro related to your inquiry, requested services, project discussions, support, and follow-up.",
      "You are responsible for providing accurate contact information and may request that Ceiro stop contacting you through a specific channel when applicable.",
    ],
  },
  {
    title: "SMS Terms",
    body: [
      "If you provide your phone number and consent to SMS communications, Ceiro may send text messages related to your inquiry, audit request, appointments, project updates, service follow-up, or support.",
      "Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe. Reply HELP for support.",
    ],
  },
  {
    title: "Liability Limitation",
    body: [
      "Ceiro works to provide high-quality website, automation, and conversion services, but does not guarantee a specific revenue result, lead volume, ranking, conversion rate, or business outcome.",
      "To the fullest extent permitted by law, Ceiro is not liable for indirect, incidental, consequential, special, or punitive damages arising from website use, communications, service discussions, or reliance on website content.",
    ],
  },
  {
    title: "Contact And Support Information",
    body: [
      "For questions about these terms, service inquiries, SMS support, or customer support, contact Ceiro at hello@bookiq.co.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms & Conditions"
      title="Terms for using Ceiro and requesting services."
      intro="These terms explain the basic conditions for using bookiq.co, contacting Ceiro, and receiving business communications related to website and automation services."
      sections={sections}
    />
  );
}
