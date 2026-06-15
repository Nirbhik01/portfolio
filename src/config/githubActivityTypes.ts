/**
 * Shape of the baked GitHub contribution data.
 *
 * The data file (`githubActivity.ts`) is regenerated at build time by
 * `scripts/fetch-github-activity.mjs`; this type lives in its own module so the
 * regenerated file can import it without the generator needing to re-emit it.
 */
export interface ContributionDay {
  /** ISO date, e.g. "2026-06-15". */
  date: string;
  /** Number of contributions on that day. */
  count: number;
}

export interface GithubActivity {
  /** Total contributions across the displayed range. */
  total: number;
  /** Calendar columns; each week is its days in chronological order. */
  weeks: ContributionDay[][];
  /** ISO timestamp the data was fetched, or null for the committed fallback. */
  fetchedAt: string | null;
  /** The GitHub login the data is for. */
  login: string;
}
