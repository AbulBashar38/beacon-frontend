export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
