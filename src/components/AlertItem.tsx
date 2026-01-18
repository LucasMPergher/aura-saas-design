import { AlertTriangle, Package } from "lucide-react";

interface AlertItemProps {
  type: "stock" | "order";
  message: string;
  time: string;
}

export function AlertItem({ type, message, time }: AlertItemProps) {
  const Icon = type === "stock" ? AlertTriangle : Package;
  const iconColor = type === "stock" ? "text-aura-warning" : "text-primary";
  const bgColor = type === "stock" ? "bg-aura-warning/10" : "bg-primary/10";

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}
