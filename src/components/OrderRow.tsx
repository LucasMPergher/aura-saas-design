import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderRowProps {
  id: string;
  customer: string;
  products: string[];
  total: number;
  status: "pendiente" | "pagado" | "enviado" | "entregado";
  date: string;
}

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "pending" as const },
  pagado: { label: "Pagado", variant: "stock" as const },
  enviado: { label: "Enviado", variant: "secondary" as const },
  entregado: { label: "Entregado", variant: "gold" as const },
};

export function OrderRow({ id, customer, products, total, status, date }: OrderRowProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs text-muted-foreground">#{id}</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
          <Link to={`/pedido/${id}`}>
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
