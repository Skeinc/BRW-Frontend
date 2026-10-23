interface ShowcaseHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}

export function ShowcaseHeading({ id, eyebrow, title, children }: ShowcaseHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
