import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

const SUPPORT_EMAIL = "hello@bookiq.co";

type LegalSection = {
  title: string;
  body: string[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5eb] text-neutral-950">
      <div className="ceiro-aurora absolute inset-x-0 top-0 h-[520px]" />
      <header className="relative z-10 px-5 py-6 sm:px-8">
        <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-black/10 bg-[#fbfaf5]/70 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3" aria-label="Ceiro home">
            <Image
              src="/ceiro-logo.png"
              alt="Ceiro logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-[14px] object-cover"
              priority
            />
            <span className="text-lg font-black tracking-[-0.03em]">
              Ceiro
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-4 py-2 text-sm font-black text-neutral-950 shadow-soft transition hover:-translate-y-0.5 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>
      </header>

      <section className="relative z-10 px-5 pb-24 pt-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="reveal is-visible mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">
              {eyebrow}
            </p>
            <h1 className="text-balance text-5xl font-black leading-[0.96] tracking-[-0.065em] sm:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-neutral-600">
              {intro}
            </p>
            <p className="mt-4 text-sm font-bold text-neutral-500">
              Effective date: May 26, 2026
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[42px] border border-white/70 bg-white/60 p-4 shadow-[0_40px_120px_rgba(15,23,42,0.1)] backdrop-blur-2xl sm:p-7">
            <div className="grid gap-4">
              {sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-[28px] border border-black/10 bg-[#fbfaf5]/88 p-6 shadow-soft"
                >
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-neutral-600">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[30px] border border-black/10 bg-neutral-950 p-6 text-white shadow-[0_26px_80px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Support
              </p>
              <p className="mt-2 text-xl font-black tracking-[-0.035em]">
                Questions about Ceiro policies or communications?
              </p>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
