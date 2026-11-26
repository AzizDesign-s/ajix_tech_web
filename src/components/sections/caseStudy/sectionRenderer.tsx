import { RichText } from '@/components/shared/portableText';
import { MediaFigure } from '@/components/sections/caseStudy/mediaFigure';
import { BeforeAfter } from '@/components/sections/caseStudy/beforeAfter';
import { EmbedCard } from '@/components/sections/caseStudy/embedCard';
import { sectionAnchorId, type CaseStudySection } from '@/types/caseStudy';
import { cn } from '@/lib/utils/cn';

/**
 * Renders one case-study block.
 *
 * A Server Component: everything static stays on the server, and only the four
 * genuinely interactive pieces — lightbox, before/after, and the two embeds —
 * ship any JavaScript.
 *
 * The switch is exhaustive over the union in src/types/caseStudy.ts, so adding
 * a block type in Sanity without adding a renderer here fails the build rather
 * than rendering a blank space on a live page.
 */
export function SectionRenderer({ section }: { section: CaseStudySection }) {
  const body = renderBody(section);
  if (!body) return null;

  return (
    <section
      id={sectionAnchorId(section)}
      // scroll-mt clears the fixed navbar when a chapter link jumps here.
      className="border-border w-full scroll-mt-28 border-t pt-12 first:border-t-0 first:pt-0"
    >
      {section.heading && (
        <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
          {section.heading}
        </h2>
      )}
      <div className={cn(section.heading && 'mt-6')}>{body}</div>
    </section>
  );
}

function renderBody(section: CaseStudySection) {
  switch (section._type) {
    case 'richTextSection':
      return section.body?.length ? <RichText value={section.body} /> : null;

    case 'imageSection':
      return (
        <MediaFigure
          image={section.image}
          className={cn(
            section.width === 'full'
              ? 'aspect-21/9'
              : section.width === 'wide'
                ? 'aspect-16/9'
                : 'aspect-16/10',
          )}
          sizes={section.width === 'content' ? '(max-width: 768px) 92vw, 760px' : '92vw'}
        />
      );

    case 'gallerySection': {
      if (!section.images?.length) return null;
      const columns = section.columns ?? 2;
      return (
        <ul
          className={cn(
            'grid gap-4',
            columns === 2 && 'sm:grid-cols-2',
            columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {section.images.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <MediaFigure
                image={image}
                className="aspect-4/3"
                sizes="(max-width: 640px) 92vw, 440px"
              />
            </li>
          ))}
        </ul>
      );
    }

    case 'videoSection':
      return (
        <EmbedCard
          kind="video"
          url={section.url}
          poster={section.poster}
          description={section.transcript}
          title={section.heading ?? 'Project video'}
        />
      );

    case 'quoteSection':
      return (
        <figure>
          <blockquote className="border-primary/50 text-foreground border-l-2 pl-6 text-xl leading-relaxed italic md:text-2xl">
            {section.quote}
          </blockquote>
          {section.attribution && (
            <figcaption className="text-muted mt-4 pl-6 text-sm">
              {section.attribution}
              {section.role && <span className="opacity-80"> · {section.role}</span>}
              {/* An unverified quote is labelled rather than dressed up as a
                  testimonial. A fabricated endorsement is the fastest way to
                  lose a client. */}
              {!section.isVerified && (
                <span className="text-muted/80 ml-2 text-xs">(illustrative)</span>
              )}
            </figcaption>
          )}
        </figure>
      );

    case 'twoColumnSection':
      if (!section.left?.length && !section.right?.length) return null;
      return (
        <div className="grid gap-8 md:grid-cols-2">
          <RichText value={section.left} />
          <RichText value={section.right} />
        </div>
      );

    case 'researchSection': {
      const hasContent = section.method || section.findings?.length || section.personas?.length;
      if (!hasContent) return null;
      return (
        <div>
          {(section.method || section.participantCount) && (
            <dl className="border-border text-muted flex flex-wrap gap-x-10 gap-y-3 rounded-xl border p-5 text-sm">
              {section.method && (
                <div>
                  <dt className="text-[11px] tracking-wide uppercase">Method</dt>
                  <dd className="text-foreground mt-1">{section.method}</dd>
                </div>
              )}
              {typeof section.participantCount === 'number' && (
                <div>
                  <dt className="text-[11px] tracking-wide uppercase">Participants</dt>
                  <dd className="text-foreground mt-1">{section.participantCount}</dd>
                </div>
              )}
            </dl>
          )}

          {section.findings?.length ? (
            <ul className="mt-6 space-y-4">
              {section.findings.map((finding) => (
                <li key={finding._key} className="border-border rounded-xl border p-5">
                  {finding.insight && (
                    <p className="text-foreground font-medium">{finding.insight}</p>
                  )}
                  {finding.evidence && (
                    <p className="text-muted mt-2 text-sm leading-relaxed">{finding.evidence}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          {section.personas?.length ? (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {section.personas.map((persona) => (
                <li key={persona._key} className="border-border bg-card/40 rounded-xl border p-5">
                  <p className="text-foreground font-heading text-lg font-semibold">
                    {persona.name}
                  </p>
                  {persona.role && <p className="text-muted text-sm">{persona.role}</p>}
                  {persona.context && (
                    <p className="text-muted mt-3 text-sm leading-relaxed">{persona.context}</p>
                  )}
                  {persona.goals?.length ? (
                    <>
                      <p className="text-muted mt-4 text-[11px] tracking-wide uppercase">Goals</p>
                      <ul className="text-muted mt-1 list-disc space-y-1 pl-5 text-sm">
                        {persona.goals.map((goal) => (
                          <li key={goal}>{goal}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {persona.frustrations?.length ? (
                    <>
                      <p className="text-muted mt-4 text-[11px] tracking-wide uppercase">
                        Frustrations
                      </p>
                      <ul className="text-muted mt-1 list-disc space-y-1 pl-5 text-sm">
                        {persona.frustrations.map((frustration) => (
                          <li key={frustration}>{frustration}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {persona.isComposite !== false && (
                    <p className="text-muted/80 mt-4 text-xs">
                      Composite persona, not an interviewed individual.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    case 'journeySection': {
      if (!section.stages?.length) return null;
      return (
        <div>
          {section.persona && (
            <p className="text-muted text-sm">
              Journey for <span className="text-foreground">{section.persona}</span>
            </p>
          )}
          <ol className="mt-5 space-y-3">
            {section.stages.map((stage, index) => (
              <li
                key={stage._key}
                className="border-border bg-card/40 grid gap-3 rounded-xl border p-5 md:grid-cols-[auto_1fr_1fr_1fr] md:items-start"
              >
                <span className="border-primary/40 bg-primary/10 text-blue-light flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <p className="text-foreground font-medium">{stage.name}</p>
                  {stage.action && <p className="text-muted mt-1 text-sm">{stage.action}</p>}
                </div>
                {stage.painPoint && (
                  <div>
                    <p className="text-muted text-[11px] tracking-wide uppercase">Pain point</p>
                    <p className="text-muted mt-1 text-sm">{stage.painPoint}</p>
                  </div>
                )}
                {stage.opportunity && (
                  <div>
                    <p className="text-muted text-[11px] tracking-wide uppercase">Opportunity</p>
                    <p className="text-muted mt-1 text-sm">{stage.opportunity}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      );
    }

    case 'timelineSection': {
      if (!section.phases?.length) return null;
      return (
        <ol className="border-border relative space-y-8 border-l pl-6">
          {section.phases.map((phase) => (
            <li key={phase._key} className="relative">
              <span
                aria-hidden="true"
                className="bg-primary absolute top-2 -left-[27px] h-2.5 w-2.5 rounded-full"
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <p className="text-foreground font-heading text-lg font-semibold">{phase.name}</p>
                {phase.duration && <p className="text-muted text-sm">{phase.duration}</p>}
              </div>
              {phase.summary && (
                <p className="text-muted mt-2 text-sm leading-relaxed">{phase.summary}</p>
              )}
              {phase.deliverables?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {phase.deliverables.map((item) => (
                    <li
                      key={item}
                      className="border-border bg-background/60 text-muted rounded-md border px-2.5 py-1 text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      );
    }

    case 'beforeAfterSection':
      return (
        <BeforeAfter before={section.before} after={section.after} summary={section.summary} />
      );

    case 'designSystemSection': {
      const hasContent =
        section.intro ||
        section.colors?.length ||
        section.typography?.length ||
        section.components?.length;
      if (!hasContent) return null;
      return (
        <div>
          {section.intro && <p className="text-muted leading-relaxed">{section.intro}</p>}

          {section.colors?.length ? (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {section.colors.map((color) => (
                <li key={color._key} className="border-border overflow-hidden rounded-xl border">
                  <div
                    aria-hidden="true"
                    className="h-16 w-full"
                    style={{ backgroundColor: color.value ?? 'transparent' }}
                  />
                  <div className="p-3">
                    <p className="text-foreground text-sm font-medium">{color.name}</p>
                    <p className="text-muted font-mono text-xs">{color.value}</p>
                    {color.usage && <p className="text-muted mt-1 text-xs">{color.usage}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {section.typography?.length ? (
            <ul className="border-border mt-6 divide-y divide-[var(--color-border)] rounded-xl border">
              {section.typography.map((type) => (
                <li key={type._key} className="flex flex-wrap justify-between gap-2 p-4">
                  <span className="text-foreground font-medium">{type.name}</span>
                  <span className="text-muted font-mono text-sm">{type.spec}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {section.components?.length ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {section.components.map((image, index) => (
                <li key={`${image.url}-${index}`}>
                  <MediaFigure
                    image={image}
                    className="aspect-4/3"
                    sizes="(max-width: 640px) 92vw, 440px"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    case 'prototypeSection':
      return (
        <EmbedCard
          kind="prototype"
          url={section.url}
          poster={section.poster}
          description={section.fallbackDescription}
          title={section.heading ?? 'Interactive prototype'}
        />
      );

    case 'resultsSection': {
      if (!section.summary?.length && !section.metrics?.length) return null;
      return (
        <div>
          {section.metrics?.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.metrics.map((metric) => (
                <li key={metric._key} className="border-border bg-card/40 rounded-xl border p-5">
                  <p className="font-heading text-foreground text-3xl font-semibold tabular-nums">
                    {metric.value}
                  </p>
                  <p className="text-muted mt-1 text-sm">{metric.label}</p>
                  {/* A figure without a source is labelled as an estimate.
                      An unsourced percentage on a portfolio is worse than no
                      percentage at all. */}
                  {metric.isEstimate && <p className="text-muted/80 mt-2 text-xs">Estimate</p>}
                  {metric.source && (
                    <p className="text-muted/80 mt-2 text-xs">Source: {metric.source}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
          <RichText value={section.summary} className={section.metrics?.length ? 'mt-6' : ''} />
        </div>
      );
    }

    case 'reflectionSection': {
      const hasContent =
        section.whatWorked?.length || section.whatIdChange?.length || section.keyLearning;
      if (!hasContent) return null;
      return (
        <div>
          <div className="grid gap-8 md:grid-cols-2">
            {section.whatWorked?.length ? (
              <div>
                <h3 className="font-heading text-foreground text-lg font-semibold">What worked</h3>
                <RichText value={section.whatWorked} />
              </div>
            ) : null}
            {section.whatIdChange?.length ? (
              <div>
                <h3 className="font-heading text-foreground text-lg font-semibold">
                  What I would change
                </h3>
                <RichText value={section.whatIdChange} />
              </div>
            ) : null}
          </div>
          {section.keyLearning && (
            <p className="border-primary/50 text-foreground mt-8 border-l-2 pl-5 leading-relaxed">
              {section.keyLearning}
            </p>
          )}
        </div>
      );
    }

    case 'featureGridSection': {
      if (!section.features?.length) return null;
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.features.map((feature) => (
            <li key={feature._key} className="border-border bg-card/40 rounded-xl border p-5">
              <p className="text-foreground font-heading text-lg font-semibold">{feature.title}</p>
              {feature.description && (
                <p className="text-muted mt-2 text-sm leading-relaxed">{feature.description}</p>
              )}
            </li>
          ))}
        </ul>
      );
    }
  }
}
