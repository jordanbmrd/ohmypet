/** Shared marketing content — kept in sync with the iOS PosterTheme catalogue. */

import { asset } from "./utils";

export type Theme = {
  key: string;
  title: string;
  subtitle: string;
  accentVar: string;
  blurb: string;
  image: string;
};

/** The candid source photo every example below is generated from. */
export const originalPhoto = asset("/dog-photo.jpg");

export const themes: Theme[] = [
  {
    key: "magazine_cover",
    title: "Couverture Magazine",
    subtitle: "Star de la mode",
    accentVar: "var(--color-magazine)",
    blurb: "Studio, lumière nette, espace de titre — la une qu'il mérite.",
    image: asset("/themes/magazine_cover.png"),
  },
  {
    key: "royalty_portrait",
    title: "Portrait Royal",
    subtitle: "Majesté à fourrure",
    accentVar: "var(--color-royalty)",
    blurb: "Huile à la Rembrandt, velours et couronne, cadre doré.",
    image: asset("/themes/royalty_portrait.png"),
  },
  {
    key: "superhero",
    title: "Superhéros",
    subtitle: "Sauveur du quartier",
    accentVar: "var(--color-superhero)",
    blurb: "Cape au vent, ville au crépuscule, pose héroïque.",
    image: asset("/themes/superhero.png"),
  },
  {
    key: "space_explorer",
    title: "Explorateur Spatial",
    subtitle: "Au-delà des étoiles",
    accentVar: "var(--color-space)",
    blurb: "Combinaison NASA, la Terre dans la visière, lumière cinéma.",
    image: asset("/themes/space_explorer.png"),
  },
  {
    key: "chef",
    title: "Grand Chef",
    subtitle: "Étoilé au guide",
    accentVar: "var(--color-chef)",
    blurb: "Toque blanche, cuisine étoilée, regard charmeur.",
    image: asset("/themes/chef.png"),
  },
];

export const steps = [
  {
    no: "01",
    title: "Choisissez la photo",
    body: "Une photo bien cadrée et lumineuse de votre chien ou chat. C'est tout ce qu'il faut.",
  },
  {
    no: "02",
    title: "Sélectionnez un thème",
    body: "Cinq univers signés. L'IA interprète chaque thème sur mesure, fidèle à votre compagnon.",
  },
  {
    no: "03",
    title: "Recevez l'œuvre encadrée",
    body: "Tirage d'art, tasse ou coque — imprimé avec soin et livré à votre porte.",
  },
];

export type ProductKey = "print" | "mug" | "case";

export type Product = {
  key: ProductKey;
  name: string;
  detail: string;
  price: string;
};

export const products: Product[] = [
  {
    key: "print",
    name: "Tirage encadré",
    detail: "Papier fine art, cadre chêne ou noir",
    price: "dès 49 €",
  },
  {
    key: "mug",
    name: "La tasse",
    detail: "Céramique, finition mate",
    price: "dès 24 €",
  },
  {
    key: "case",
    name: "Coque de téléphone",
    detail: "iPhone & Android, antichoc",
    price: "dès 29 €",
  },
];

export const testimonials = [
  {
    quote:
      "Le portrait royal de Gustave trône dans l'entrée. Mes invités pensent que c'est une commande chez un peintre.",
    name: "Camille R.",
    detail: "et Gustave, bouledogue français",
    pet: "Gustave",
    theme: "Royal",
    accent: "var(--color-royalty)",
    image: asset("/themes/royalty_portrait.png"),
  },
  {
    quote:
      "Bluffée par la ressemblance. La couverture magazine de Java est devenue ma photo de profil partout.",
    name: "Inès M.",
    detail: "et Java, chat bengal",
    pet: "Java",
    theme: "Magazine",
    accent: "var(--color-magazine)",
    image: asset("/themes/magazine_cover.png"),
  },
  {
    quote:
      "Commandé en cadeau, livré en quelques jours, encadrement impeccable. On recommande déjà le deuxième.",
    name: "Thomas L.",
    detail: "et Nala, golden retriever",
    pet: "Nala",
    theme: "Héros",
    accent: "var(--color-superhero)",
    image: asset("/themes/superhero.png"),
  },
];

export const faqs = [
  {
    q: "Quelle photo dois-je utiliser ?",
    a: "Une photo nette, bien éclairée, où le regard de votre animal est visible. Le format n'a pas d'importance — nous nous occupons du reste.",
  },
  {
    q: "Combien de temps pour générer le portrait ?",
    a: "L'aperçu est prêt en quelques secondes. Vous pouvez régénérer autant que vous le souhaitez avant de commander.",
  },
  {
    q: "Chien, chat… et les autres ?",
    a: "Pour l'instant, OhMyPet est optimisé pour les chiens et les chats. D'autres compagnons rejoindront bientôt l'atelier.",
  },
  {
    q: "Comment sont imprimées les œuvres ?",
    a: "Sur papier fine art et supports premium via nos partenaires d'impression, avec un contrôle qualité avant expédition.",
  },
];
