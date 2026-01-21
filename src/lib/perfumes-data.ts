/**
 * Mock data centralizado para perfumes
 * Usado en Catalog y PerfumeDetail
 */

import perfume1 from "@/assets/perfume-1.jpg";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume3 from "@/assets/perfume-3.jpg";
import perfume4 from "@/assets/perfume-4.jpg";

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  type: "Árabe" | "Diseñador" | "Nicho";
  price: number;
  imageUrl: string;
  inStock: boolean;
  description?: string;
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  volume?: string;
  concentration?: string;
}

export const allPerfumes: Perfume[] = [
  {
    id: "1",
    name: "Oud Al Layl",
    brand: "Lattafa",
    type: "Árabe",
    price: 45000,
    imageUrl: perfume2,
    inStock: true,
    description: "Una fragancia oriental intensa con profundas notas de oud. Perfecta para ocasiones especiales nocturnas.",
    notes: {
      top: ["Bergamota", "Rosa"],
      heart: ["Oud", "Azafrán", "Jazmín"],
      base: ["Ámbar", "Pachulí", "Vainilla"]
    },
    volume: "100ml",
    concentration: "Eau de Parfum"
  },
  {
    id: "2",
    name: "Aventus",
    brand: "Creed",
    type: "Nicho",
    price: 120000,
    imageUrl: perfume1,
    inStock: false,
    description: "La fragancia icónica de Creed. Fresca, frutal y elegante con un carácter único e irresistible.",
    notes: {
      top: ["Piña", "Grosella negra", "Manzana"],
      heart: ["Abedul", "Rosa", "Jazmín"],
      base: ["Almizcle", "Musgo de roble", "Vainilla"]
    },
    volume: "100ml",
    concentration: "Eau de Parfum"
  },
  {
    id: "3",
    name: "Bleu de Chanel",
    brand: "Chanel",
    type: "Diseñador",
    price: 85000,
    imageUrl: perfume3,
    inStock: true,
    description: "Elegancia atemporal en una fragancia fresca y amaderada. La definición de sofisticación masculina.",
    notes: {
      top: ["Limón", "Menta", "Rosa"],
      heart: ["Jengibre", "Jazmín", "Nuez moscada"],
      base: ["Cedro", "Sándalo", "Incienso"]
    },
    volume: "100ml",
    concentration: "Eau de Toilette"
  },
  {
    id: "4",
    name: "Amber Oud",
    brand: "Al Haramain",
    type: "Árabe",
    price: 38000,
    imageUrl: perfume4,
    inStock: true,
    description: "Combinación perfecta de ámbar cálido y oud profundo. Lujosa y envolvente.",
    notes: {
      top: ["Rosa", "Azafrán"],
      heart: ["Oud", "Ámbar"],
      base: ["Almizcle", "Maderas preciosas"]
    },
    volume: "60ml",
    concentration: "Eau de Parfum"
  },
  {
    id: "5",
    name: "Sauvage",
    brand: "Dior",
    type: "Diseñador",
    price: 75000,
    imageUrl: perfume3,
    inStock: true,
    description: "Frescura radical inspirada en amplios espacios abiertos. Poderosa y elegante.",
    notes: {
      top: ["Pimienta de Sichuan", "Bergamota"],
      heart: ["Lavanda", "Geranio", "Elemi"],
      base: ["Ambroxan", "Cedro", "Vetiver"]
    },
    volume: "100ml",
    concentration: "Eau de Toilette"
  },
  {
    id: "6",
    name: "Raghba",
    brand: "Lattafa",
    type: "Árabe",
    price: 28000,
    imageUrl: perfume2,
    inStock: true,
    description: "Dulce, cálida y cautivadora. Una fragancia oriental moderna que perdura todo el día.",
    notes: {
      top: ["Vainilla", "Frutas"],
      heart: ["Oud", "Rosa"],
      base: ["Ámbar", "Almizcle", "Maderas"]
    },
    volume: "100ml",
    concentration: "Eau de Parfum"
  },
  {
    id: "7",
    name: "Noir de Noir",
    brand: "Tom Ford",
    type: "Nicho",
    price: 180000,
    imageUrl: perfume1,
    inStock: false,
    description: "Oscura, misteriosa y seductora. La expresión máxima del lujo oriental.",
    notes: {
      top: ["Trufa", "Azafrán", "Rosa"],
      heart: ["Rosa negra", "Orquídea"],
      base: ["Pachulí", "Vainilla", "Oud"]
    },
    volume: "50ml",
    concentration: "Eau de Parfum"
  },
  {
    id: "8",
    name: "Sultan Al Oud",
    brand: "Swiss Arabian",
    type: "Árabe",
    price: 52000,
    imageUrl: perfume4,
    inStock: true,
    description: "Majestuosa fragancia oriental con oud de alta calidad. Proyección potente y elegante.",
    notes: {
      top: ["Bergamota", "Cardamomo"],
      heart: ["Oud", "Rosa", "Jazmín"],
      base: ["Ámbar", "Almizcle", "Cedro"]
    },
    volume: "100ml",
    concentration: "Eau de Parfum"
  }
];

export const getPerfumeById = (id: string): Perfume | undefined => {
  return allPerfumes.find(p => p.id === id);
};
