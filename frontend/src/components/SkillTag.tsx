import { Badge } from "@/components/ui/badge";

export function SkillTag({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "matched" | "missing";
}) {
  const styles =
    variant === "matched"
      ? "bg-success/15 text-success border-success/40"
      : variant === "missing"
      ? "bg-destructive/15 text-destructive border-destructive/40"
      : "bg-secondary text-secondary-foreground border-border";
  return (
    <Badge variant="outline" className={`${styles} font-mono text-xs`}>
      {label}
    </Badge>
  );
}
