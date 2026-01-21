import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderRowProps {
  id: string;
  customer: string;
  products: string[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "pendiente" | "pagado" | "enviado" | "entregado";
  date: string;
  hasBackorder?: boolean;
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "pending" as const },
  pendiente: { label: "Pendiente", variant: "pending" as const },
  confirmed: { label: "Confirmado", variant: "stock" as const },
  pagado: { label: "Pagado", variant: "stock" as const },
  shipped: { label: "Enviado", variant: "secondary" as const },
  enviado: { label: "Enviado", variant: "secondary" as const },
  delivered: { label: "Entregado", variant: "gold" as const },
  entregado: { label: "Entregado", variant: "gold" as const },
  cancelled: { label: "Cancelado", variant: "outline" as const },
};

export function OrderRow({ id, customer, products, total, status, date, hasBackorder }: OrderRowProps) {
  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs text-muted-foreground">{id}</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          {hasBackorder && (
            <Badge variant="gold" className="gap-1">
              <Bell className="w-3 h-3" />
              A pedido
            </Badge>
          )}
        </div>
        <p className="font-medium text-foreground truncate">{customer}</p>
        <p className="text-sm text-muted-foreground truncate">
          {products.join(", ")}
        </p>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-foreground">${total.toLocaleString("es-AR")}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/pedido/${id.replace('#', '')}`}>
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
