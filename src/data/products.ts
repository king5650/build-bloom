import type { Bi } from "@/i18n/i18n";

export type ProductFamily = "construction" | "decoration" | "consumable";

export const PRODUCT_FAMILIES: { id: ProductFamily; label: Bi }[] = [
  { id: "construction", label: { fr: "Équipement de construction", en: "Construction equipment" } },
  { id: "decoration", label: { fr: "Équipement de décoration", en: "Decoration equipment" } },
  { id: "consumable", label: { fr: "Consommables", en: "Consumables" } },
];

export type Product = {
  id: string;
  name: Bi;
  family: ProductFamily;
  price: number; // XAF
  unit: Bi;
  hex: string;
  spec: Bi;
  stock: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "airless-pro",
    name: { fr: "Station airless portative", en: "Portable airless sprayer" },
    family: "construction",
    price: 850000,
    unit: { fr: "l'unité", en: "each" },
    hex: "#2B2E33",
    spec: {
      fr: "180 bar, buse réversible, flexible 15 m. Façades et grandes surfaces.",
      en: "180 bar, reversible tip, 15 m hose. Facades and large surfaces.",
    },
    stock: 4,
  },
  {
    id: "scaffold-bay",
    name: { fr: "Travée d'échafaudage acier", en: "Steel scaffolding bay" },
    family: "construction",
    price: 195000,
    unit: { fr: "la travée", en: "per bay" },
    hex: "#4A5568",
    spec: {
      fr: "2 m × 1,80 m, plancher bois, garde-corps et plinthes inclus.",
      en: "2 m × 1.80 m, timber deck, guardrail and toe boards included.",
    },
    stock: 22,
  },
  {
    id: "mixer-1600",
    name: { fr: "Malaxeur d'enduit 1600 W", en: "Render mixer 1600 W" },
    family: "construction",
    price: 145000,
    unit: { fr: "l'unité", en: "each" },
    hex: "#6E6A63",
    spec: {
      fr: "Deux vitesses, fouet Ø 140 mm, mortiers et enduits.",
      en: "Two speeds, Ø 140 mm paddle, mortars and renders.",
    },
    stock: 9,
  },
  {
    id: "laser-level",
    name: { fr: "Niveau laser + hygromètre", en: "Laser level + moisture meter" },
    family: "construction",
    price: 120000,
    unit: { fr: "le kit", en: "per kit" },
    hex: "#A79E92",
    spec: {
      fr: "±1 mm / 10 m, mesure d'humidité des supports avant peinture.",
      en: "±1 mm / 10 m, substrate moisture reading before painting.",
    },
    stock: 12,
  },
  {
    id: "sander-hepa",
    name: { fr: "Ponceuse girafe aspirée", en: "Extraction drywall sander" },
    family: "construction",
    price: 320000,
    unit: { fr: "l'unité", en: "each" },
    hex: "#B8B2A9",
    spec: {
      fr: "Ø 225 mm, aspirateur HEPA, chantiers occupés.",
      en: "Ø 225 mm, HEPA vacuum, occupied sites.",
    },
    stock: 6,
  },
  {
    id: "render-trowel-set",
    name: { fr: "Kit taloches & lisseuses inox", en: "Stainless trowel & float kit" },
    family: "decoration",
    price: 65000,
    unit: { fr: "le kit 6 pièces", en: "6-piece kit" },
    hex: "#DCD3C4",
    spec: {
      fr: "Béton ciré, chaux, stucs : angles arrondis, acier souple.",
      en: "Polished concrete, lime, stucco: rounded corners, flexible steel.",
    },
    stock: 30,
  },
  {
    id: "stencil-kit",
    name: { fr: "Pochoirs & rouleaux à motifs", en: "Stencils & pattern rollers" },
    family: "decoration",
    price: 42000,
    unit: { fr: "le kit", en: "per kit" },
    hex: "#C1592B",
    spec: {
      fr: "Douze motifs géométriques, murs d'accent et bandeaux.",
      en: "Twelve geometric patterns, accent walls and bands.",
    },
    stock: 25,
  },
  {
    id: "moulding-set",
    name: { fr: "Moulures & corniches polystyrène", en: "Polystyrene mouldings & cornices" },
    family: "decoration",
    price: 28000,
    unit: { fr: "les 10 ml", en: "per 10 lm" },
    hex: "#E8E4DE",
    spec: {
      fr: "Prêtes à peindre, collage sans clou, profils droits et sculptés.",
      en: "Paint-ready, nail-free bonding, plain and carved profiles.",
    },
    stock: 60,
  },
  {
    id: "brush-roller-pack",
    name: { fr: "Pack brosses & rouleaux pro", en: "Pro brush & roller pack" },
    family: "consumable",
    price: 18500,
    unit: { fr: "le pack", en: "per pack" },
    hex: "#C9C3BA",
    spec: {
      fr: "Manchons anti-gouttes 180/250 mm, brosses à réchampir.",
      en: "Non-drip sleeves 180/250 mm, cutting-in brushes.",
    },
    stock: 80,
  },
  {
    id: "masking-kit",
    name: { fr: "Kit de protection chantier", en: "Site protection kit" },
    family: "consumable",
    price: 12000,
    unit: { fr: "le kit", en: "per kit" },
    hex: "#D9D2C6",
    spec: {
      fr: "Bâches, adhésif de masquage précision, films de sol.",
      en: "Dust sheets, precision masking tape, floor films.",
    },
    stock: 100,
  },
];

export function formatXAF(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}