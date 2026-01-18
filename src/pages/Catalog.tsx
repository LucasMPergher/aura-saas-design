import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { PerfumeCard } from "@/components/PerfumeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import perfume1 from "@/assets/perfume-1.jpg";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume3 from "@/assets/perfume-3.jpg";
import perfume4 from "@/assets/perfume-4.jpg";

const allPerfumes = [
  { id: "1", name: "Oud Al Layl", brand: "Lattafa", type: "Árabe" as const, price: 45000, imageUrl: perfume2, inStock: true },
  { id: "2", name: "Aventus", brand: "Creed", type: "Nicho" as const, price: 120000, imageUrl: perfume1, inStock: false },
  { id: "3", name: "Bleu de Chanel", brand: "Chanel", type: "Diseñador" as const, price: 85000, imageUrl: perfume3, inStock: true },
  { id: "4", name: "Amber Oud", brand: "Al Haramain", type: "Árabe" as const, price: 38000, imageUrl: perfume4, inStock: true },
  { id: "5", name: "Sauvage", brand: "Dior", type: "Diseñador" as const, price: 75000, imageUrl: perfume3, inStock: true },
  { id: "6", name: "Raghba", brand: "Lattafa", type: "Árabe" as const, price: 28000, imageUrl: perfume2, inStock: true },
  { id: "7", name: "Noir de Noir", brand: "Tom Ford", type: "Nicho" as const, price: 180000, imageUrl: perfume1, inStock: false },
  { id: "8", name: "Sultan Al Oud", brand: "Swiss Arabian", type: "Árabe" as const, price: 52000, imageUrl: perfume4, inStock: true },
];

const categories = ["Todos", "Árabe", "Diseñador", "Nicho"];

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPerfumes = allPerfumes.filter((perfume) => {
    const matchesCategory = activeCategory === "Todos" || perfume.type === activeCategory;
    const matchesSearch = perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Catálogo
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explorá nuestra colección completa de fragancias exclusivas
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Search */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar perfumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-gold"
                      : "bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredPerfumes.length} perfumes encontrados
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="stock">{allPerfumes.filter(p => p.inStock).length} en stock</Badge>
              <Badge variant="pending">{allPerfumes.filter(p => !p.inStock).length} a pedido</Badge>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} {...perfume} />
            ))}
          </div>

          {filteredPerfumes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No se encontraron perfumes</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Catalog;
