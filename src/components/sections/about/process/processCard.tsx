'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { fadeUp } from '@/animations/variants';
import { ArrowUpRight } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

import type { ProcessStep } from '@/types/process';

interface ProcessCardProps {
  step: ProcessStep;
}

export function ProcessCard({ step }: ProcessCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="border-border bg-card/60 relative flex flex-col overflow-hidden rounded-2xl border"
    >
      {/* Ghost number */}
      <span className="font-heading text-foreground/10 pointer-events-none absolute top-2 right-4 z-10 text-6xl font-bold select-none">
        {step.number}
      </span>

      <div
        aria-hidden="true"
        className="absolute -bottom-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-2"
      />

      {/* Top edge highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
      />

      {/* Image */}
      <div className="relative h-56 w-full">
        <Image
          src={step.image}
          alt={step.title}
          fill
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover"
        />
        <div className="from-card absolute inset-0 bg-linear-to-t via-transparent to-transparent" />

        {/* Per-step icon badge, overlapping the image edge */}
        <div className="from-violet to-primary shadow-glow-violet absolute -bottom-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br">
          <Icon name={step.icon} size={18} className="text-foreground" />
        </div>

        {/* Decorative arrow badge — not a link, per current design brief */}
        <div
          aria-hidden="true"
          className="bg-gradient-primary shadow-glow-blue absolute right-5 -bottom-5 flex h-10 w-10 items-center justify-center rounded-xl"
        >
          <ArrowUpRight size={18} className="text-foreground" />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-8 pb-6">
        <h3 className="font-heading text-foreground text-lg font-semibold">{step.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}
