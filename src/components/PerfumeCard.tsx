import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

interface PerfumeCardProps {
  id: string;
  name: string;
  brand: string;
  type: "Árabe" | "Diseñador" | "Nicho";
  price: number;
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
}

const typeColors = {
  "Árabe": "gold",
  "Diseñador": "secondary",
  "Nicho": "outline",
} as const;

export function PerfumeCard({
  id,
  name,
  brand,
  type,
  price,
  imageUrl,
  inStock,
  featured = false,
}: PerfumeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className={`overflow-hidden ${featured ? "gold-glow" : ""}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-dark">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button variant="gold" size="sm" className="flex-1">
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </Button>
            <Button variant="outline" size="icon" className="shrink-0" asChild>
              <Link to={`/perfume/${id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge variant={typeColors[type]}>{type}</Badge>
            <Badge variant={inStock ? "stock" : "pending"}>
              {inStock ? "En stock" : "A pedido"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {brand}
          </p>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-xl font-semibold text-primary">
            ${price.toLocaleString("es-AR")}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
