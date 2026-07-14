import Image from 'next/image';

export function AICore() {
  return (
    <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52 lg:h-64 lg:w-64">
      {/* Woven ribbon artwork — rotates as one cohesive piece */}
      <div className="animate-core-spin absolute inset-0 h-full w-full">
        <Image
          src="/images/ui/ai-core-rings.svg"
          alt=""
          aria-hidden="true"
          fill
          className="h-full w-full object-contain"
        />
      </div>

      {/* Ambient glow behind the mark, matching the ribbon's blue */}
      <div
        className="bg-primary absolute h-1/2 w-1/2 rounded-full opacity-30 blur-2xl"
        aria-hidden="true"
      />

      {/* Logo mark — stays still at center, doesn't rotate */}
      <div className="bg-foreground shadow-glow-blue relative z-10 flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16 lg:h-20 lg:w-20">
        <Image
          src="/logo/ajix-icon-light.svg"
          alt="AJIX"
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
          priority
        />
      </div>
    </div>
  );
}
