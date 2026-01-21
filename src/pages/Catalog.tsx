import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { PerfumeCard } from "@/components/PerfumeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { allPerfumes } from "@/lib/perfumes-data";

const categories = ["Todos", "Árabe", "Diseñador", "Nicho"];

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros adicionales
  const [stockFilter, setStockFilter] = useState<"todos" | "stock" | "pedido">("todos");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);

  // Obtener marcas únicas
  const uniqueBrands = Array.from(new Set(allPerfumes.map(p => p.brand))).sort();

  const filteredPerfumes = allPerfumes.filter((perfume) => {
    const matchesCategory = activeCategory === "Todos" || perfume.type === activeCategory;
    const matchesSearch = perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = stockFilter === "todos" || 
      (stockFilter === "stock" && perfume.inStock) ||
      (stockFilter === "pedido" && !perfume.inStock);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(perfume.brand);
    const matchesPrice = perfume.price >= priceRange[0] && perfume.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesStock && matchesBrand && matchesPrice;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory("Todos");
    setSearchQuery("");
    setStockFilter("todos");
    setSelectedBrands([]);
    setPriceRange([0, 200000]);
  };

  const hasActiveFilters = activeCategory !== "Todos" || searchQuery !== "" || 
    stockFilter !== "todos" || selectedBrands.length > 0 || 
    priceRange[0] !== 0 || priceRange[1] !== 200000;

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
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="icon" 
                className="shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={clearAllFilters}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Advanced Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-3 gap-4 mb-6"
              >
                {/* Stock Filter */}
                <Card className="bg-aura-night border-aura-smoke/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-aura-gold">Disponibilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stock-todos"
                        checked={stockFilter === "todos"}
                        onCheckedChange={() => setStockFilter("todos")}
                      />
                      <Label htmlFor="stock-todos" className="text-sm cursor-pointer">Todos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stock-disponible"
                        checked={stockFilter === "stock"}
                        onCheckedChange={() => setStockFilter("stock")}
                      />
                      <Label htmlFor="stock-disponible" className="text-sm cursor-pointer">
                        En stock
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stock-pedido"
                        checked={stockFilter === "pedido"}
                        onCheckedChange={() => setStockFilter("pedido")}
                      />
                      <Label htmlFor="stock-pedido" className="text-sm cursor-pointer">
                        A pedido
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Brand Filter */}
                <Card className="bg-aura-night border-aura-smoke/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-aura-gold">Marca</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-40 overflow-y-auto">
                    {uniqueBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Price Filter */}
                <Card className="bg-aura-night border-aura-smoke/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-aura-gold">Precio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      min={0}
                      max={200000}
                      step={5000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
