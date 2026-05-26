"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Mail,
  MousePointerClick,
  Network,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const navItems = ["Services", "Projects", "Process", "FAQ"];
const SUPPORT_EMAIL = "hello@bookiq.co";
const COMPLIANCE_TEXT =
  "By submitting this form, you agree to receive communications from Ceiro regarding your inquiry. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out.";

const oldWebsite = [
  "Outdated design",
  "Weak CTA",
  "Slow replies",
  "Low trust",
  "Poor mobile UX",
];

const ceiroSystem = [
  "Premium design",
  "AI automation",
  "Lead capture",
  "Conversion optimization",
  "Fast response",
  "Booking systems",
];

const services = [
  {
    icon: Globe2,
    title: "Premium Website Design",
    copy: "Conversion-led sites with polished visuals, fast mobile UX, and brand systems that feel funded.",
    tone: "from-blue-100 to-lavender-100",
  },
  {
    icon: Bot,
    title: "AI Lead Follow-Up",
    copy: "Instant qualification, compliant inquiry routing, and nurturing flows that keep warm leads moving.",
    tone: "from-mint-100 to-bluewash",
  },
  {
    icon: CalendarCheck,
    title: "Booking & CRM Integration",
    copy: "Connect forms, calendars, pipelines, notifications, and support handoffs into one clean operating layer.",
    tone: "from-peach-100 to-white",
  },
  {
    icon: MousePointerClick,
    title: "Conversion Optimization",
    copy: "Sharper messaging, clearer paths, and experiments focused on turning attention into action.",
    tone: "from-lavender-100 to-peach-100",
  },
  {
    icon: Network,
    title: "Automation Systems",
    copy: "Automated handoffs, follow-ups, alerts, and reporting built around real operational workflows.",
    tone: "from-white to-mint-100",
  },
];

const projects = [
  {
    title: "Luxury Service Website",
    tag: "Premium booking flow",
    accent: "bg-[#dff4ff]",
    stat: "+68%",
    label: "Inquiry quality",
  },
  {
    title: "Modern SaaS Dashboard",
    tag: "Founder-ready product UI",
    accent: "bg-[#eee7ff]",
    stat: "3.2x",
    label: "Faster demo path",
  },
  {
    title: "AI Booking System",
    tag: "Chat, qualify, schedule",
    accent: "bg-[#dcf9ee]",
    stat: "24/7",
    label: "Lead coverage",
  },
];

const process = [
  {
    title: "Audit",
    copy: "We review your current website, lead flow, and conversion bottlenecks to identify missed revenue opportunities.",
  },
  {
    title: "Strategy",
    copy: "We create a focused growth plan covering design, automation, lead capture, and conversion improvements.",
  },
  {
    title: "Design",
    copy: "We design a premium modern interface optimized for trust, clarity, and higher conversion rates.",
  },
  {
    title: "Build",
    copy: "We develop the website system, integrations, forms, automations, and responsive infrastructure.",
  },
  {
    title: "Automate",
    copy: "We connect AI follow-up, booking systems, lead qualification, and operational workflows.",
  },
  {
    title: "Launch",
    copy: "After testing and optimization, we deploy the system and monitor performance improvements.",
  },
];

const testimonials = [
  {
    quote:
      "Ceiro made our site feel like a product, not a brochure. The new automation flow paid for itself in the first month.",
    name: "Maya Chen",
    role: "Founder, Northline Studio",
    gradient: "from-[#dff4ff] to-[#eee7ff]",
  },
  {
    quote:
      "The design is calm and premium, but the best part is how many more leads now make it to booked calls.",
    name: "Evan Brooks",
    role: "CEO, Atlas Ops",
    gradient: "from-[#dcf9ee] to-[#fff0e7]",
  },
  {
    quote:
      "It finally feels like our website is working while our team is asleep. Clean build, thoughtful strategy, beautiful finish.",
    name: "Sofia Patel",
    role: "Partner, Vale Advisory",
    gradient: "from-[#fff0e7] to-[#dff4ff]",
  },
];

const faqs = [
  {
    q: "Do I need an existing website?",
    a: "No. Ceiro can build from a fresh brand direction, improve an existing site, or rebuild around a stronger conversion system.",
  },
  {
    q: "Can this work for any business?",
    a: "It works best for service businesses, consultants, startups, and local operators where better leads and faster response times create real revenue.",
  },
  {
    q: "What does the AI automation do?",
    a: "It captures, qualifies, routes, follows up, and nudges leads toward the next step with workflows tailored to your offer and communication preferences.",
  },
  {
    q: "How long does it take?",
    a: "Most projects move from audit to launch in two to five weeks, depending on content, integrations, and automation depth.",
  },
  {
    q: "How do I get started?",
    a: `Book a free audit. Ceiro will review your current funnel and show the highest-leverage opportunities before anything is built. You can also contact support at ${SUPPORT_EMAIL}.`,
  },
];

function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/ceiro-logo.png"
      alt="Ceiro logo"
      width={64}
      height={64}
      className={`${className} rounded-[14px] object-cover`}
      priority
    />
  );
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="text-lg font-black tracking-[-0.03em] text-neutral-950">
        Ceiro
      </span>
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="reveal mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">
        {kicker}
      </p>
      <h2 className="text-balance text-4xl font-black tracking-[-0.055em] text-neutral-950 sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-8 text-neutral-600">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

function MetricCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`float-soft absolute z-20 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(31,41,55,0.13)] backdrop-blur-2xl ${className}`}
    >
      <p className="text-lg font-black tracking-[-0.04em] text-neutral-950">
        {value}
      </p>
      <p className="mt-1 max-w-[11rem] text-xs font-semibold leading-5 text-neutral-500">
        {label}
      </p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="reveal relative mx-auto mt-10 max-w-6xl px-4" style={{ animationDelay: "120ms" }}>
      <div className="orza-glow absolute inset-x-8 top-2 h-72 rounded-full blur-3xl" />
      <div className="relative min-h-[520px] overflow-hidden rounded-[42px] border border-white/70 bg-white/55 p-4 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_15%,rgba(177,220,255,0.55),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(229,211,255,0.58),transparent_28%),radial-gradient(circle_at_68%_88%,rgba(195,247,226,0.5),transparent_30%)]" />
        <div className="relative mx-auto mt-16 max-w-3xl rounded-[32px] border border-black/10 bg-[#fbfaf5]/92 p-4 shadow-[0_34px_100px_rgba(15,23,42,0.15)] sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ffb4a2]" />
              <span className="h-3 w-3 rounded-full bg-[#f5d26c]" />
              <span className="h-3 w-3 rounded-full bg-[#86dfbd]" />
            </div>
            <div className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-bold text-white">
              Live growth system
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[24px] bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Conversion flow
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
                    Lead operations dashboard
                  </h3>
                </div>
                <LogoMark className="h-10 w-10" />
              </div>
              <div className="mt-8 h-36 rounded-[22px] bg-gradient-to-br from-blue-100 via-lavender-100 to-mint-100 p-4">
                <div className="flex h-full items-end gap-3">
                  {[42, 70, 52, 84, 65, 92, 76].map((height, index) => (
                    <div
                      key={height}
                      className="flex-1 rounded-t-2xl bg-neutral-950/80"
                      style={{ height: `${height}%`, opacity: 0.55 + index * 0.06 }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["312", "Captured"],
                  ["48", "Booked"],
                  ["94%", "Qualified"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-[#f7f3ea] p-4">
                    <p className="text-2xl font-black tracking-[-0.04em] text-neutral-950">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[24px] bg-neutral-950 p-5 text-white shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/12 p-3">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">AI assistant</p>
                    <p className="text-xs text-white/55">Qualification enabled</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="max-w-[82%] rounded-2xl bg-white/10 p-3 text-sm text-white/80">
                    New inquiry from audit page. Budget confirmed.
                  </div>
                  <div className="ml-auto max-w-[78%] rounded-2xl bg-[#dff4ff] p-3 text-sm font-semibold text-neutral-950">
                    Consent logged. Audit link sent.
                  </div>
                </div>
              </div>
              <div className="rounded-[24px] bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black tracking-[-0.02em]">Website preview</p>
                  <Sparkles className="h-5 w-5 text-neutral-400" />
                </div>
                <div className="mt-4 overflow-hidden rounded-[20px] border border-black/10">
                  <div className="h-16 bg-gradient-to-r from-[#fff0e7] via-[#eee7ff] to-[#dff4ff]" />
                  <div className="space-y-2 bg-white p-4">
                    <div className="h-3 w-3/5 rounded-full bg-neutral-950" />
                    <div className="h-2 w-4/5 rounded-full bg-neutral-200" />
                    <div className="h-2 w-2/3 rounded-full bg-neutral-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MetricCard
          value="2x"
          label="Faster lead response"
          className="left-5 top-8 bg-[#dff4ff]/75 sm:left-12"
        />
        <MetricCard
          value="40%"
          label="Better conversion flow"
          className="right-4 top-16 bg-[#eee7ff]/75 sm:right-16"
        />
        <MetricCard
          value="24/7"
          label="AI follow-up"
          className="bottom-20 left-6 bg-[#dcf9ee]/80 sm:left-20"
        />
        <MetricCard
          value="+312"
          label="Leads captured"
          className="bottom-8 right-5 bg-[#fff0e7]/85 sm:right-16"
        />
      </div>
    </div>
  );
}

function MiniBrowserMock({ index }: { index: number }) {
  const fills = [
    "from-[#fff0e7] via-[#f8f5eb] to-[#dff4ff]",
    "from-[#eee7ff] via-white to-[#dcf9ee]",
    "from-[#dff4ff] via-white to-[#fff0e7]",
  ];

  return (
    <div className="relative h-72 overflow-hidden rounded-[30px] border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[23px] border border-black/10 bg-[#fbfaf5]">
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffb4a2]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5d26c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#86dfbd]" />
          </div>
          <LogoMark className="h-6 w-6 rounded-lg" />
        </div>
        <div className={`flex-1 bg-gradient-to-br ${fills[index]} p-5`}>
          <div className="h-5 w-24 rounded-full bg-neutral-950/85" />
          <div className="mt-8 h-6 w-3/4 rounded-full bg-neutral-950/80" />
          <div className="mt-3 h-3 w-5/6 rounded-full bg-white/80" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-white/80" />
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-2xl bg-white/70 shadow-soft" />
            <div className="h-20 rounded-2xl bg-white/70 shadow-soft" />
            <div className="h-20 rounded-2xl bg-neutral-950/85 shadow-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadLossCalculator() {
  const [visitors, setVisitors] = useState(4200);
  const [rate, setRate] = useState(2.1);
  const [value, setValue] = useState(1800);
  const [response, setResponse] = useState(12);

  const results = useMemo(() => {
    const currentLeads = visitors * (rate / 100);
    const responseDrag = response > 8 ? 0.42 : response > 3 ? 0.24 : 0.1;
    const improvedLeads = currentLeads * (1.35 + responseDrag);
    const lostRevenue = Math.max(0, improvedLeads - currentLeads) * value * 0.22;

    return {
      lostRevenue: Math.round(lostRevenue),
      bookedCalls: Math.round(improvedLeads * 0.28),
      leadIncrease: Math.round(((improvedLeads - currentLeads) / currentLeads) * 100),
    };
  }, [visitors, rate, value, response]);

  const controls = [
    {
      label: "Monthly website visitors",
      value: visitors,
      min: 500,
      max: 25000,
      step: 100,
      display: visitors.toLocaleString(),
      onChange: setVisitors,
    },
    {
      label: "Current conversion rate",
      value: rate,
      min: 0.5,
      max: 8,
      step: 0.1,
      display: `${rate.toFixed(1)}%`,
      onChange: setRate,
    },
    {
      label: "Average customer value",
      value,
      min: 250,
      max: 12000,
      step: 50,
      display: `$${value.toLocaleString()}`,
      onChange: setValue,
    },
    {
      label: "Response time",
      value: response,
      min: 1,
      max: 48,
      step: 1,
      display: `${response}h`,
      onChange: setResponse,
    },
  ];

  return (
    <section className="px-5 py-28 sm:px-8" id="calculator">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          kicker="Lead Loss Calculator"
          title="See what slow follow-up may be costing you."
          copy="A simple model for estimating the revenue hidden inside better conversion flow and faster response."
        />
        <div className="reveal mt-14 grid gap-6 rounded-[38px] border border-white/70 bg-white/55 p-5 shadow-[0_34px_100px_rgba(15,23,42,0.1)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="rounded-[30px] bg-white/80 p-6 shadow-soft">
            <div className="grid gap-5">
              {controls.map((control) => (
                <label key={control.label} className="block">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-neutral-600">
                      {control.label}
                    </span>
                    <span className="rounded-full bg-neutral-950 px-3 py-1 text-sm font-bold text-white">
                      {control.display}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={control.value}
                    onChange={(event) => control.onChange(Number(event.target.value))}
                    className="ceiro-range w-full"
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["Estimated lost revenue", `$${results.lostRevenue.toLocaleString()}`, TrendingUp],
              ["Potential booked calls", `${results.bookedCalls}`, CalendarCheck],
              ["Projected lead increase", `+${results.leadIncrease}%`, Rocket],
            ].map(([label, number, Icon]) => {
              const LucideIcon = Icon as typeof TrendingUp;
              return (
                <div
                  key={label as string}
                  className="rounded-[28px] border border-black/10 bg-[#fbfaf5]/90 p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-neutral-500">{label as string}</p>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-lavender-100 p-3">
                      <LucideIcon className="h-5 w-5 text-neutral-950" />
                    </div>
                  </div>
                  <p className="mt-5 text-4xl font-black tracking-[-0.055em] text-neutral-950">
                    {number as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CeiroLandingPage() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5eb] text-neutral-950">
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-black/10 bg-[#fbfaf5]/70 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <a href="#" aria-label="Ceiro home">
            <BrandLockup compact />
          </a>
          <div className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/50 p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-full px-4 py-2 text-sm font-bold text-neutral-600 transition hover:bg-white hover:text-neutral-950"
              >
                {item}
              </a>
            ))}
          </div>
          <a
            href="#book"
            className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_35px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            Book Audit
          </a>
        </nav>
      </header>

      <section className="relative px-5 pb-24 pt-32 sm:px-8 lg:pt-32">
        <div className="ceiro-aurora absolute inset-x-0 top-0 h-[720px]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="reveal mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-bold text-neutral-600 shadow-soft backdrop-blur-2xl">
            <LogoMark className="h-6 w-6 rounded-lg" />
            Modern websites built to convert.
          </div>
          <h1 className="reveal mx-auto max-w-5xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.07em] text-neutral-950 sm:text-6xl lg:text-7xl">
            Websites That Turn Visitors Into Customers
          </h1>
          <p
            className="reveal mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-neutral-600 sm:text-xl"
            style={{ animationDelay: "70ms" }}
          >
            Premium web design, AI-powered lead systems, and automation for
            businesses that want to grow faster.
          </p>
          <p
            className="reveal mx-auto mt-3 max-w-xl text-sm font-semibold text-neutral-500"
            style={{ animationDelay: "90ms" }}
          >
            Business inquiries and customer support:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-neutral-950 underline decoration-black/20 underline-offset-4 transition hover:decoration-black">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <div
            className="reveal mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "110ms" }}
          >
            <a
              href="#book"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Book Free Audit
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-6 py-4 text-sm font-black text-neutral-950 shadow-soft backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white"
            >
              View Projects
            </a>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="relative bg-[#fbfaf5] px-5 py-28 sm:px-8" id="services">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker="Website System"
            title="Your website should work harder than a brochure."
            copy="Most businesses lose customers because their website is outdated, slow to respond, poorly optimized for mobile, and lacks accountable follow-up systems."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="reveal rounded-[34px] border border-black/10 bg-white p-7 shadow-soft">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-[-0.04em]">Old website</h3>
                <Clock3 className="h-6 w-6 text-neutral-400" />
              </div>
              <div className="space-y-3">
                {oldWebsite.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#f3f0e7] px-4 py-3 text-sm font-bold text-neutral-600">
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal relative overflow-hidden rounded-[34px] border border-black/10 bg-neutral-950 p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_12%,rgba(210,193,255,0.36),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(186,243,221,0.26),transparent_32%)]" />
              <div className="relative mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-[-0.04em]">Ceiro system</h3>
                <LogoMark className="h-9 w-9 rounded-xl" />
              </div>
              <div className="relative grid gap-3 sm:grid-cols-2">
                {ceiroSystem.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white/86">
                    <Check className="h-4 w-4 text-[#baf3dd]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24">
            <SectionHeader
              kicker="Services"
              title="Design, automation, and growth systems in one place."
            />
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className="reveal group rounded-[30px] border border-black/10 bg-white/74 p-5 shadow-soft backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <div className={`mb-8 inline-flex rounded-3xl bg-gradient-to-br ${service.tone} p-4`}>
                      <Icon className="h-6 w-6 text-neutral-950" />
                    </div>
                    <h3 className="text-xl font-black leading-tight tracking-[-0.04em]">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      {service.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8" id="projects">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker="Projects"
            title="Featured systems with startup-grade polish."
            copy="Operationally realistic UI directions for brands that need to earn trust quickly, capture inquiries clearly, and move users toward action."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="reveal group overflow-hidden rounded-[34px] border border-black/10 bg-white/75 p-4 shadow-soft backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:shadow-[0_36px_100px_rgba(15,23,42,0.15)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <MiniBrowserMock index={index} />
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                    {project.tag}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.045em]">
                    {project.title}
                  </h3>
                  <div className="mt-5 flex items-end justify-between rounded-[24px] bg-[#f7f3ea] p-4">
                    <div>
                      <p className="text-3xl font-black tracking-[-0.05em]">
                        {project.stat}
                      </p>
                      <p className="text-sm font-semibold text-neutral-500">
                        {project.label}
                      </p>
                    </div>
                    <div className={`h-14 w-14 rounded-3xl ${project.accent}`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LeadLossCalculator />

      <section className="bg-[#fbfaf5] px-5 py-28 sm:px-8" id="process">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker="Process"
            title="From outdated website to automated growth system."
          />
          <div className="relative mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {process.map((step, index) => (
              <div
                key={step.title}
                className="reveal rounded-[28px] border border-black/10 bg-white/80 p-5 shadow-soft transition hover:-translate-y-1"
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black tracking-[-0.04em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            kicker="Testimonials"
            title="Premium design that turns into measurable momentum."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.name}
                className="reveal rounded-[34px] border border-black/10 bg-white/72 p-6 shadow-soft backdrop-blur-xl"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className={`mb-8 h-16 w-16 rounded-full bg-gradient-to-br ${testimonial.gradient} p-1`}>
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-lg font-black">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                </div>
                <blockquote className="text-xl font-bold leading-8 tracking-[-0.025em] text-neutral-950">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-8">
                  <p className="font-black tracking-[-0.02em]">{testimonial.name}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-500">
                    {testimonial.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf5] px-5 py-28 sm:px-8" id="faq">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1fr]">
          <div className="reveal">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">
              FAQ
            </p>
            <h2 className="text-balance text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Clear answers before the audit.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.q}
                className="reveal group rounded-[26px] border border-black/10 bg-white/75 p-5 shadow-soft backdrop-blur-xl"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black tracking-[-0.035em]">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-7 text-neutral-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8" id="book">
        <div className="reveal relative mx-auto max-w-6xl overflow-hidden rounded-[44px] bg-neutral-950 px-6 py-20 text-center text-white shadow-[0_40px_120px_rgba(0,0,0,0.22)] sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(223,244,255,0.28),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(238,231,255,0.32),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(220,249,238,0.22),transparent_30%)]" />
          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-[24px] bg-white">
              <LogoMark className="h-11 w-11 rounded-2xl" />
            </div>
            <h2 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl">
              Turn your website into your best salesperson.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-8 text-white/70">
              Modern design. AI automation. Better conversions.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Free%20Ceiro%20Audit`}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-neutral-950 shadow-[0_18px_45px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5"
            >
              Book Free Audit
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mx-auto mt-5 max-w-2xl text-xs font-medium leading-5 text-white/48">
              {COMPLIANCE_TEXT} For support, email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white/75 underline decoration-white/25 underline-offset-4 transition hover:text-white">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-10 sm:px-8">
        <div className="mx-auto max-w-6xl border-t border-black/10 py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <BrandLockup />
            <div className="grid gap-6 text-sm font-bold text-neutral-500 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr]">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-neutral-950">
                    {item}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/privacy" className="transition hover:text-neutral-950">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="transition hover:text-neutral-950">
                  Terms & Conditions
                </Link>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="transition hover:text-neutral-950">
                  Contact
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-neutral-950">
                  <Mail className="h-4 w-4" />
                  {SUPPORT_EMAIL}
                </a>
                <p className="max-w-xs text-sm font-semibold leading-6 text-neutral-500">
                  Support for website, automation, and lead-system inquiries for bookiq.co.
                </p>
                <p className="text-sm font-semibold text-neutral-400">
                  © 2026 Ceiro. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
