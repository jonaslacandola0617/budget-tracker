import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "danger";
}

const VARIANT_STYLES = {
  default: { icon: "bg-accent/10 text-accent", border: "" },
  success: { icon: "bg-success/10 text-success", border: "border-success/20" },
  warning: { icon: "bg-warning/10 text-warning", border: "border-warning/20" },
  danger:  { icon: "bg-danger/10 text-danger",   border: "border-danger/20"  },
};

export function StatCard({ label, value, sub, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div className={`card p-4 sm:p-5 flex flex-col gap-3 card-hover ${styles.border}`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={`text-xs font-medium tabular ${trend.value >= 0 ? "text-success" : "text-danger"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value.toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-text-primary tabular truncate"
           style={{ fontFamily: "var(--font-display)" }}>
          {value}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 leading-snug">{label}</p>
        {sub && <p className="text-xs text-text-dim mt-1">{sub}</p>}
      </div>
    </div>
  );
}
