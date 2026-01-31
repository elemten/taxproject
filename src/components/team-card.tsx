import { cn } from "@/lib/utils";

export function TeamCard({
  name,
  role,
  points,
  className,
}: {
  name: string;
  role: string;
  points: string[];
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className={cn("surface-solid p-8", className)}>
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-full border bg-muted text-sm font-semibold">
          {initials || "TE"}
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">{name}</p>
          <p className="text-sm font-semibold text-brand">{role}</p>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p} className="leading-7">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

