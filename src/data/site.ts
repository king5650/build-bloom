import type { Bi } from "@/i18n/i18n";

import p1before from "@/assets/project-1-before.jpg";
import p1after from "@/assets/project-1-after.jpg";
import p2before from "@/assets/project-2-before.jpg";
import p2after from "@/assets/project-2-after.jpg";
import p3before from "@/assets/project-3-before.jpg";
import p3after from "@/assets/project-3-after.jpg";

export const CONTACT = {
  email: "infoasafrica@gmail.com",
  phoneDisplay: "+237 680 777 582",
  phoneRaw: "+237680777582",
  whatsapp: "237680777582",
  city: { fr: "Yaoundé, Cameroun", en: "Yaoundé, Cameroon" } as Bi,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Category = "painting" | "renovation" | "structural" | "decoration";

export const CATEGORIES: { id: Category; label: Bi }[] = [
  { id: "painting", label: { fr: "Peinture", en: "Painting" } },
  { id: "renovation", label: { fr: "Rénovation complète", en: "Full renovation" } },
  { id: "structural", label: { fr: "Reprise structurelle", en: "Structural repair" } },
  { id: "decoration", label: { fr: "Décoration", en: "Decoration" } },
];

export type Project = {
  slug: string;
  title: Bi;
  category: Category;
  location: Bi;
  year: string;
  duration: Bi;
  surface: string;
  summary: Bi;
  description: Bi;
  scope: Bi[];
  before: string;
  after: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "residence-bastos",
    title: { fr: "Résidence Bastos — façade & enduits", en: "Bastos Residence — facade & render" },
    category: "renovation",
    location: { fr: "Bastos, Yaoundé", en: "Bastos, Yaoundé" },
    year: "2025",
    duration: { fr: "6 semaines", en: "6 weeks" },
    surface: "820 m²",
    summary: {
      fr: "Un immeuble de rapport fatigué, remis à neuf de la fondation visible à l'acrotère.",
      en: "A tired apartment block brought back to life from plinth to parapet.",
    },
    description: {
      fr: "Enduits décollés, fissures de retrait et infiltrations en toiture. Nous avons purgé les zones mortes, reconstitué les enduits, traité les fissures en armature fibre puis appliqué un système de peinture façade trois couches, avec une bande d'accent terre cuite pour redonner un rythme à la ligne de plancher.",
      en: "Blown render, shrinkage cracks and roof-line water ingress. We stripped the dead zones, rebuilt the render, reinforced cracks with fibre mesh, then applied a three-coat facade system with a terracotta accent band to give the floor line rhythm again.",
    },
    scope: [
      { fr: "Diagnostic et relevé photographique", en: "Survey and photographic report" },
      { fr: "Piquage et reprise des enduits (140 m²)", en: "Hacking off and rebuilding render (140 m²)" },
      { fr: "Traitement des fissures, armature fibre", en: "Crack treatment with fibre reinforcement" },
      { fr: "Peinture façade 3 couches, finition satinée", en: "Three-coat facade paint, satin finish" },
      { fr: "Menuiseries et garde-corps laqués", en: "Lacquered joinery and railings" },
    ],
    before: p1before,
    after: p1after,
  },
  {
    slug: "villa-odza-interieur",
    title: { fr: "Villa Odza — intérieurs & décoration", en: "Odza Villa — interiors & decoration" },
    category: "decoration",
    location: { fr: "Odza, Yaoundé", en: "Odza, Yaoundé" },
    year: "2025",
    duration: { fr: "3 semaines", en: "3 weeks" },
    surface: "210 m²",
    summary: {
      fr: "Séjour terne transformé en volume lumineux avec mur d'accent graphite.",
      en: "A dull living space turned into a bright volume with a graphite accent wall.",
    },
    description: {
      fr: "Ratissage complet des murs, reprise des plafonds tachés par une ancienne fuite, mise en peinture mate haut de gamme et création d'un mur d'accent graphite pour ancrer le salon. Les sols béton ont été poncés et protégés.",
      en: "Full skim of the walls, repair of ceilings stained by an old leak, premium matt paint throughout and a graphite accent wall to anchor the lounge. Concrete floors were ground back and sealed.",
    },
    scope: [
      { fr: "Ratissage et ponçage des murs", en: "Skim coating and sanding" },
      { fr: "Traitement anti-humidité des plafonds", en: "Anti-damp ceiling treatment" },
      { fr: "Peinture mate lessivable", en: "Washable matt paint" },
      { fr: "Mur d'accent et bandeaux décoratifs", en: "Accent wall and decorative bands" },
      { fr: "Ponçage et vitrification des sols", en: "Floor grinding and sealing" },
    ],
    before: p2before,
    after: p2after,
  },
  {
    slug: "local-commercial-mvan",
    title: { fr: "Local commercial Mvan — devanture", en: "Mvan Retail Unit — shopfront" },
    category: "painting",
    location: { fr: "Mvan, Yaoundé", en: "Mvan, Yaoundé" },
    year: "2024",
    duration: { fr: "12 jours", en: "12 days" },
    surface: "95 m²",
    summary: {
      fr: "Devanture rouillée reprise en graphite et béton chaud, prête à l'ouverture.",
      en: "A rusted shopfront rebuilt in graphite and warm concrete, ready to open.",
    },
    description: {
      fr: "Décapage et traitement antirouille des rideaux métalliques, reprise des appuis en ciment, peinture époxy sur métal et bandeau d'enseigne préparé pour la pose de lettrage. Chantier mené de nuit pour ne pas bloquer la rue.",
      en: "Stripping and rust treatment of the metal shutters, cement sill repairs, epoxy paint on steel and a signage band prepared for lettering. Worked overnight to keep the street clear.",
    },
    scope: [
      { fr: "Décapage et traitement antirouille", en: "Stripping and rust treatment" },
      { fr: "Peinture époxy bi-composant sur métal", en: "Two-part epoxy paint on steel" },
      { fr: "Reprise ciment des appuis et seuils", en: "Cement repairs to sills and thresholds" },
      { fr: "Bandeau d'enseigne et éclairage", en: "Signage band and lighting" },
    ],
    before: p3before,
    after: p3after,
  },
];

export type Service = { id: string; title: Bi; body: Bi };

export const SERVICES: Service[] = [
  {
    id: "painting",
    title: { fr: "Peinture intérieure & extérieure", en: "Interior & exterior painting" },
    body: {
      fr: "Préparation sérieuse des supports, systèmes de peinture adaptés au climat, finitions nettes et durables.",
      en: "Serious substrate preparation, paint systems suited to the climate, crisp and durable finishes.",
    },
  },
  {
    id: "renovation",
    title: { fr: "Rénovation de bâtiment", en: "Building renovation" },
    body: {
      fr: "Enduits, cloisons, carrelage, menuiseries : nous reprenons le bâti avant de l'habiller.",
      en: "Render, partitions, tiling, joinery: we repair the fabric before dressing it.",
    },
  },
  {
    id: "structural",
    title: { fr: "Reprise structurelle & étanchéité", en: "Structural repair & waterproofing" },
    body: {
      fr: "Fissures, infiltrations, béton dégradé — diagnostic, méthode, rapport photo à la livraison.",
      en: "Cracks, water ingress, degraded concrete — diagnosis, method, photo report on handover.",
    },
  },
  {
    id: "decoration",
    title: { fr: "Décoration & finitions", en: "Decoration & finishes" },
    body: {
      fr: "Murs d'accent, effets d'enduit, moulures et bandeaux : le détail qui fait la pièce.",
      en: "Accent walls, render effects, mouldings and bands: the detail that makes the room.",
    },
  },
];

export type CatalogItem = {
  id: string;
  name: Bi;
  family: "paint" | "finish" | "floor" | "exterior";
  hex: string;
  spec: Bi;
};

export const CATALOG_FAMILIES: { id: CatalogItem["family"]; label: Bi }[] = [
  { id: "paint", label: { fr: "Peintures murales", en: "Wall paints" } },
  { id: "finish", label: { fr: "Effets & enduits", en: "Effects & renders" } },
  { id: "floor", label: { fr: "Sols", en: "Floors" } },
  { id: "exterior", label: { fr: "Façades", en: "Facades" } },
];

export const CATALOG: CatalogItem[] = [
  {
    id: "graphite",
    name: { fr: "Graphite AS", en: "AS Graphite" },
    family: "paint",
    hex: "#2B2E33",
    spec: {
      fr: "Mat profond lessivable — murs d'accent, menuiseries.",
      en: "Deep washable matt — accent walls, joinery.",
    },
  },
  {
    id: "warm-concrete",
    name: { fr: "Béton chaud", en: "Warm Concrete" },
    family: "paint",
    hex: "#E8E4DE",
    spec: {
      fr: "Mat velours, la base la plus demandée en séjour.",
      en: "Velvet matt, our most requested living-room base.",
    },
  },
  {
    id: "terracotta",
    name: { fr: "Terre cuite brûlée", en: "Burnt Terracotta" },
    family: "paint",
    hex: "#C1592B",
    spec: {
      fr: "Satiné — niches, portes, bandeaux d'accent.",
      en: "Satin — niches, doors, accent bands.",
    },
  },
  {
    id: "slate",
    name: { fr: "Bleu ardoise", en: "Slate Blue" },
    family: "paint",
    hex: "#4A5568",
    spec: {
      fr: "Satiné — bureaux, espaces techniques.",
      en: "Satin — offices, technical spaces.",
    },
  },
  {
    id: "chaux",
    name: { fr: "Badigeon de chaux", en: "Lime wash" },
    family: "finish",
    hex: "#DCD3C4",
    spec: {
      fr: "Effet nuagé appliqué à la brosse, respirant.",
      en: "Brush-applied clouded effect, breathable.",
    },
  },
  {
    id: "beton-cire",
    name: { fr: "Béton ciré", en: "Polished concrete effect" },
    family: "finish",
    hex: "#B8B2A9",
    spec: {
      fr: "Enduit minéral lissé, plans de travail et murs de douche.",
      en: "Smoothed mineral render, worktops and shower walls.",
    },
  },
  {
    id: "resine-sol",
    name: { fr: "Résine de sol époxy", en: "Epoxy floor resin" },
    family: "floor",
    hex: "#6E6A63",
    spec: {
      fr: "Garages, ateliers, locaux commerciaux — antipoussière.",
      en: "Garages, workshops, retail units — dust-free.",
    },
  },
  {
    id: "carrelage",
    name: { fr: "Grès cérame grand format", en: "Large-format porcelain" },
    family: "floor",
    hex: "#C9C3BA",
    spec: {
      fr: "Pose collée, joints 2 mm, calepinage fourni.",
      en: "Adhesive-fixed, 2 mm joints, setting-out drawing provided.",
    },
  },
  {
    id: "facade-hydro",
    name: { fr: "Façade hydrofuge", en: "Water-repellent facade" },
    family: "exterior",
    hex: "#D9D2C6",
    spec: {
      fr: "Film souple anti-pluie battante, garanti 8 ans.",
      en: "Flexible film against driving rain, 8-year warranty.",
    },
  },
  {
    id: "facade-quartz",
    name: { fr: "Revêtement quartz", en: "Quartz coating" },
    family: "exterior",
    hex: "#A79E92",
    spec: {
      fr: "Grain fin garnissant, masque les microfissures.",
      en: "Fine filling grain, hides micro-cracks.",
    },
  },
];

export type Equipment = { id: string; name: Bi; spec: Bi; detail: Bi };

export const EQUIPMENT: Equipment[] = [
  {
    id: "airless",
    name: { fr: "Station airless haute pression", en: "High-pressure airless rig" },
    spec: { fr: "220 bar · 3,6 L/min", en: "220 bar · 3.6 L/min" },
    detail: {
      fr: "Couvre 400 m² de façade par jour avec une épaisseur de film régulière.",
      en: "Covers 400 m² of facade a day at a consistent film thickness.",
    },
  },
  {
    id: "scaffold",
    name: { fr: "Échafaudage multidirectionnel", en: "Multidirectional scaffolding" },
    spec: { fr: "600 m² · jusqu'à 5 niveaux", en: "600 m² · up to 5 levels" },
    detail: {
      fr: "Monté par notre équipe, garde-corps et plinthes systématiques.",
      en: "Erected by our own crew, guardrails and toe boards as standard.",
    },
  },
  {
    id: "sander",
    name: { fr: "Ponceuse girafe aspirée", en: "Extraction drywall sander" },
    spec: { fr: "Ø 225 mm · aspiration HEPA", en: "Ø 225 mm · HEPA extraction" },
    detail: {
      fr: "Chantiers occupés : quasiment aucune poussière en suspension.",
      en: "Occupied sites: almost no airborne dust.",
    },
  },
  {
    id: "mixer",
    name: { fr: "Malaxeur et pompe à enduit", en: "Mixer and render pump" },
    spec: { fr: "1600 W · 60 L/min", en: "1600 W · 60 L/min" },
    detail: {
      fr: "Enduits homogènes, cadence constante sur grandes surfaces.",
      en: "Homogeneous render, steady output on large areas.",
    },
  },
  {
    id: "laser",
    name: { fr: "Niveau laser et hygromètre", en: "Laser level and moisture meter" },
    spec: { fr: "±1 mm / 10 m", en: "±1 mm / 10 m" },
    detail: {
      fr: "On ne peint jamais un support dont l'humidité n'a pas été mesurée.",
      en: "We never paint a substrate whose moisture we have not measured.",
    },
  },
  {
    id: "truck",
    name: { fr: "Utilitaire de chantier", en: "Site utility vehicle" },
    spec: { fr: "3,5 t · matériel + équipe", en: "3.5 t · materials + crew" },
    detail: {
      fr: "Livraison matériaux et intervention rapide dans le Grand Yaoundé.",
      en: "Material delivery and fast response across greater Yaoundé.",
    },
  },
];

export type Member = { id: string; name: string; role: Bi; bio: Bi; initials: string };

export const TEAM: Member[] = [
  {
    id: "founder",
    name: "A. Soppo",
    initials: "AS",
    role: { fr: "Fondateur · Conduite de travaux", en: "Founder · Site management" },
    bio: {
      fr: "Quinze ans sur les chantiers de peinture et de rénovation. Chiffre, planifie et suit chaque chantier jusqu'à la réception.",
      en: "Fifteen years on painting and renovation sites. Prices, plans and follows every job through to handover.",
    },
  },
  {
    id: "cofounder",
    name: "K. Tata",
    initials: "KT",
    role: { fr: "Co-fondateur · Méthodes & digital", en: "Co-founder · Methods & digital" },
    bio: {
      fr: "Apporte la rigueur d'ingénierie : relevés, rapports photo, devis détaillés et suivi client.",
      en: "Brings the engineering rigour: surveys, photo reports, detailed quotes and client follow-up.",
    },
  },
  {
    id: "foreman",
    name: "E. Ngono",
    initials: "EN",
    role: { fr: "Chef d'équipe peinture", en: "Painting foreman" },
    bio: {
      fr: "Spécialiste des finitions fines et des enduits décoratifs. Forme les apprentis de l'atelier.",
      en: "Specialist in fine finishes and decorative renders. Trains the workshop apprentices.",
    },
  },
];

export const STATS: { value: string; label: Bi }[] = [
  { value: "12+", label: { fr: "années de métier", en: "years in the trade" } },
  { value: "140", label: { fr: "chantiers livrés", en: "projects delivered" } },
  { value: "8", label: { fr: "compagnons formés", en: "craftsmen trained" } },
  { value: "48h", label: { fr: "délai de devis", en: "quote turnaround" } },
];