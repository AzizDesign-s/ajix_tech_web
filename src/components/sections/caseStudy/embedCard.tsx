'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Play } from 'lucide-react';
import type { CaseStudyImage } from '@/types/caseStudy';

interface EmbedCardProps {
  kind: 'video' | 'prototype';
  url: string;
  poster?: CaseStudyImage;
  /** Read by anyone who cannot or will not load the embed — search engines included. */
  description?: string;
  title: string;
}

/**
 * Click-to-load wrapper for third-party embeds.
 *
 * Nothing from YouTube, Vimeo or Figma is requested until the visitor asks for
 * it. An auto-loaded iframe costs several hundred kilobytes and a third-party
 * cookie on a page most visitors scroll past — and it would break the
 * "no third-party requests" guarantee the smoke suite asserts.
 */
export function EmbedCard({ kind, url, poster, description, title }: EmbedCardProps) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = toEmbedUrl(url, kind);

  return (
    <div className="w-full">
      <div className="border-border relative aspect-16/9 w-full overflow-hidden rounded-xl border">
        {loaded && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            // Narrow permissions: an embed needs to play media and go
            // fullscreen, and nothing else.
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            {poster ? (
              <Image
                src={poster.url}
                alt=""
                fill
                sizes="(max-width: 768px) 92vw, 900px"
                className="object-cover object-top"
              />
            ) : (
              <div aria-hidden="true" className="bg-gradient-surface absolute inset-0" />
            )}

            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="bg-background/40 focus-visible:ring-ring hover:bg-background/25 absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="bg-gradient-secondary text-on-accent inline-flex h-14 w-14 items-center justify-center rounded-full">
                {kind === 'video' ? (
                  <Play size={20} aria-hidden="true" />
                ) : (
                  <ExternalLink size={20} aria-hidden="true" />
                )}
              </span>
              <span className="text-foreground text-sm font-medium">
                {kind === 'video' ? 'Play video' : 'Load prototype'}
              </span>
              <span className="text-muted text-xs">Loads content from {safeHost(url)}</span>
            </button>
          </>
        )}
      </div>

      {description && <p className="text-muted mt-4 leading-relaxed">{description}</p>}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-light decoration-primary/50 hover:decoration-primary focus-visible:ring-ring mt-3 inline-flex items-center gap-1.5 rounded text-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        Open on {safeHost(url)}
        <ExternalLink size={13} aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'the source site';
  }
}

/**
 * Converts a watch/share URL into its embeddable form.
 *
 * Returns null for anything that is not a host we recognise, rather than
 * dropping an arbitrary URL into an iframe — the brief is explicit about not
 * embedding untrusted sites.
 */
function toEmbedUrl(url: string, kind: 'video' | 'prototype'): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (kind === 'video') {
      if (host === 'youtube.com') {
        const id = parsed.searchParams.get('v');
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (host === 'youtu.be') {
        const id = parsed.pathname.slice(1);
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (host === 'vimeo.com') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
      return null;
    }

    if (host === 'figma.com' || host.endsWith('.figma.com')) {
      return `https://embed.figma.com/proto/${parsed.pathname.replace(/^\/(proto|file|design)\//, '')}${parsed.search}&embed-host=ajix`;
    }
    return null;
  } catch {
    return null;
  }
}
