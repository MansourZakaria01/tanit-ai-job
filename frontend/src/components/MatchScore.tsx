export function MatchScore({ score }: { score: number }) {
  const color =
    score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Match score</span>
        <span
          className="font-display text-4xl font-bold"
          style={{ color }}
        >
          {score}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-smooth"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}, var(--primary))`,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </div>
  );
}
