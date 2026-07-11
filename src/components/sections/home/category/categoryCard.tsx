'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '@/types/category';

import { gradientColorClass } from '@/lib/constants/categoryClasses';
import { cn } from '@/lib/utils/cn';

interface CategoryCardProps {
  category: Category;
  index: number;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}

export function CategoryCard({ category, index, hoveredIndex, onHover }: CategoryCardProps) {
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && !isHovered;
  const baseRotate = index % 2 === 0 ? -2 : 2; // alternating tilt — poker-card fan effect
  const gradient = gradientColorClass[category.color];

  return (
    <Link
      href={`/projects?category=${category.slug}`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="focus-visible:ring-primary block rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
      aria-label={`View ${category.name} projects`}
    >
      <motion.div
        animate={{
          rotate: isHovered ? 0 : baseRotate,
          y: isHovered ? -12 : 0,
          scale: isHovered ? 1.03 : isDimmed ? 0.97 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'group border-border bg-gradient-surface shadow-card relative flex h-80 flex-col justify-between overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-[border-color,opacity,box-shadow] duration-30',
          isHovered && 'border-border/40 shadow-glow-blue',
          isDimmed && 'opacity-60',
        )}
      >
        {/* Liquid glass sheen */}
        <div
          aria-hidden="true"
          className="absolute -top-1/3 -left-1/3 h-2/3 w-2/3 rotate-12 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-2"
        />

        {/* Top edge highlight */}
        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Category gradient wash on hover */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            gradient,
          )}
        />

        <div className="relative z-10 flex items-start justify-between">
          <span className="text-muted text-xs font-medium tracking-widest uppercase">
            {category.number}
          </span>
          <motion.div
            animate={{ rotate: isHovered ? 45 : 0, opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight size={20} className="text-foreground" />
          </motion.div>
        </div>

        <div className="border-border bg-gradient-surface relative my-2 h-32 w-full overflow-hidden rounded-xl border">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>

        <div className="relative z-10">
          <h3 className="font-heading text-foreground text-xl font-semibold md:text-2xl">
            {category.name}
          </h3>
          <p className="text-foreground/70 mt-2 text-sm leading-relaxed">{category.description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
