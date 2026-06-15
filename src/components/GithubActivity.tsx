import Section from './Section';
import Reveal from './Reveal';
import { githubActivity } from '../config/githubActivity';
import type { ContributionDay } from '../config/githubActivityTypes';
import { safeLinkAttrs } from '../utils/links';

// Five intensity steps, re-themed from GitHub's greens to this site's
// cyan → indigo palette. Index 0 is the "no contributions" cell.
const LEVEL_COLORS = [
  'rgba(255, 255, 255, 0.05)',
  'rgba(56, 189, 248, 0.30)',
  'rgba(56, 189, 248, 0.55)',
  'rgba(56, 189, 248, 0.85)',
  '#818cf8',
];

/** Bucket a day's count into an intensity level (0–4), relative to the max. */
function levelFor(count: number, max: number): number {
  if (count <= 0) return 0;
  const ratio = count / Math.max(1, max);
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

/** Align a (possibly partial) week into 7 weekday slots, Sun→Sat. */
function toWeekdayGrid(week: ContributionDay[]): (ContributionDay | null)[] {
  const slots: (ContributionDay | null)[] = Array(7).fill(null);
  for (const day of week) {
    slots[new Date(day.date).getUTCDay()] = day;
  }
  return slots;
}

function formatRange(weeks: ContributionDay[][]): string | null {
  const first = weeks[0]?.[0]?.date;
  const lastWeek = weeks[weeks.length - 1];
  const last = lastWeek?.[lastWeek.length - 1]?.date;
  if (!first || !last) return null;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `${fmt(first)} – ${fmt(last)}`;
}

export default function GithubActivity() {
  const { total, weeks } = githubActivity;
  const max = weeks.reduce((m, week) => week.reduce((wm, d) => Math.max(wm, d.count), m), 0);
  const range = formatRange(weeks);
  const hasData = weeks.length > 0;

  return (
    <Section id="activity" eyebrow="Open source" title="GitHub Activity">
      <Reveal className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-muted">
            <span className="font-semibold text-text">{total.toLocaleString()}</span> contributions
            {range ? ` · ${range}` : ''}
          </p>
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>Less</span>
            {LEVEL_COLORS.map((color, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {hasData ? (
          <div className="no-scrollbar overflow-x-auto pb-1">
            <div
              role="img"
              aria-label={`${total} GitHub contributions${range ? ` from ${range}` : ''}`}
              className="flex min-w-max gap-[3px]"
            >
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {toWeekdayGrid(week).map((day, di) => (
                    <span
                      key={di}
                      title={day ? `${day.count} on ${day.date}` : undefined}
                      aria-hidden="true"
                      className="h-3 w-3 rounded-[2px] transition-transform hover:scale-125"
                      style={{ backgroundColor: LEVEL_COLORS[day ? levelFor(day.count, max) : 0] }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Contribution data is generated at deploy time and will appear on the live site.
          </p>
        )}

        <a
          {...safeLinkAttrs(`https://github.com/${githubActivity.login}`)}
          className="mt-5 inline-flex text-sm font-medium text-accent hover:underline"
        >
          View full profile on GitHub →
        </a>
      </Reveal>
    </Section>
  );
}
