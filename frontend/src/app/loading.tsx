import Image from "next/image";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8f5eb]">
      <div className="flex min-h-screen items-center justify-center">
        <div className="ceiro-loader flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-5 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <Image
            src="/ceiro-logo.png"
            alt="Ceiro"
            width={32}
            height={32}
            className="h-8 w-8 rounded-xl object-cover"
            priority
          />
          <span className="text-sm font-semibold tracking-tight text-neutral-950">
            Ceiro
          </span>
        </div>
      </div>
    </main>
  );
}
