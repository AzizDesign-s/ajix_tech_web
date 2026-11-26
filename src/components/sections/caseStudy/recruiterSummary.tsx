import type { WorkItem } from '@/types/work';
import { getToolsBySlug } from '@/lib/services/tools';
import { getCategoryLabel } from '@/lib/services/categories';

/**
 * The compressed version, for someone deciding in fifteen seconds whether to
 * read the rest.
 *
 * Every value here is drawn from fields that already exist — role is derived
 * from the project type, the stack from the tools list. Nothing is written
 * specially for it, so it cannot drift away from the case study it summarises
 * and it cannot claim an outcome the project never had.
 */
export function RecruiterSummary({ item }: { item: WorkItem }) {
  const tools = getToolsBySlug(item.toolSlugs);

  const rows: Array<{ label: string; value: string }> = [
    {
      label: 'Role',
      value: item.projectType === 'uiux' ? 'Product & UX Design' : 'Design & Frontend',
    },
    { label: 'Discipline', value: item.badge?.label ?? getCategoryLabel(item.category) },
  ];

  if (item.client) rows.push({ label: 'Client', value: item.client });
  if (item.year) rows.push({ label: 'Year', value: item.year });
  if (tools.length) rows.push({ label: 'Stack', value: tools.map((t) => t.label).join(', ') });

  return (
    <aside
      aria-labelledby="quick-summary"
      className="border-border bg-card/40 w-full rounded-2xl border p-6"
    >
      <h2 id="quick-summary" className="text-muted text-[11px] tracking-widest uppercase">
        Quick summary
      </h2>
      <p className="text-foreground mt-3 leading-relaxed">{item.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-muted text-[11px] tracking-wide uppercase">{row.label}</dt>
            <dd className="text-foreground mt-1 text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
