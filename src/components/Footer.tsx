interface FooterProps {
  note: string;
  year: number;
}

export default function Footer({ note, year }: FooterProps) {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted">
      <p>
        © {year} {note}. Built with React, Three.js &amp; Vite.
      </p>
    </footer>
  );
}
