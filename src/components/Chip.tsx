interface ChipProps {
  children: string;
}

/** Small pill used to render tech-stack / skill tags. */
export default function Chip({ children }: ChipProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-sm text-muted">
      {children}
    </span>
  );
}
