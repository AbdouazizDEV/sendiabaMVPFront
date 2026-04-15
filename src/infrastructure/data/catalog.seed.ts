import artisan1 from "../../assets/artisan-1.png";
import artisan2 from "../../assets/artisan-2.png";
import artisan3 from "../../assets/artisan-3.png";
import artisan4 from "../../assets/artisan-4.png";
import artisan5 from "../../assets/artisan-5.png";
import artisan6 from "../../assets/artisan-6.png";

import productLeather from "../../assets/product-leather.png";
import productLeather2 from "../../assets/product-leather-2.png";
import productLeather3 from "../../assets/product-leather-3.png";
import productLeather4 from "../../assets/product-leather-4.png";
import productLeather5 from "../../assets/product-leather-5.png";

import productCushion from "../../assets/product-cushion.png";
import productLinen from "../../assets/product-linen.png";
import productMaison1 from "../../assets/product-maison-1.png";
import productMaison2 from "../../assets/product-maison-2.png";
import productMaison3 from "../../assets/product-maison-3.png";

import productSculpture from "../../assets/product-sculpture.png";
import productDecor from "../../assets/product-decor.png";

import productGift from "../../assets/product-gift.png";

import type { Artisan, Product } from "@/domain/types";

export const artisans: Artisan[] = [
  {
    id: "a1",
    name: "Ibrahima Guèye",
    title: "Maître Cordonnier",
    location: "Ngaye Mékhé, Sénégal",
    heritage: "Troisième génération, depuis 1987",
    quote: "Le cuir ne ment pas. Il garde la mémoire des mains qui l'ont travaillé.",
    bio: "Formé par son père et son grand-père, Ibrahima a perfectionné son art au fil des décennies. Ses créations allient le respect scrupuleux des techniques traditionnelles de tannage sénégalaises à un design contemporain d'une rare élégance.",
    image: artisan1,
    speciality: "Maroquinerie",
    yearsExperience: 35,
    productsCount: 42
  },
  {
    id: "a2",
    name: "Fatouma Diabaté",
    title: "Tisserande d'Art",
    location: "Ségou, Mali",
    heritage: "Héritière des techniques Bogolan",
    quote: "Chaque motif est un mot, chaque tissu est un livre d'histoire.",
    bio: "À travers son métier à tisser, Fatouma fait perdurer l'héritage textile de Ségou. Elle maîtrise la technique complexe du Bogolan, utilisant des teintures naturelles à base de feuilles, d'écorces et de boue fermentée pour créer des pièces uniques.",
    image: artisan2,
    speciality: "Maison & Textile",
    yearsExperience: 25,
    productsCount: 28
  },
  {
    id: "a3",
    name: "Ousmane Sawadogo",
    title: "Sculpteur sur Bois",
    location: "Ouagadougou, Burkina Faso",
    heritage: "Sculpteur depuis plus de 40 ans",
    quote: "Je ne crée pas la forme, je libère l'âme qui dormait dans l'ébène.",
    bio: "Ousmane est une figure respectée de l'artisanat burkinabé. Travaillant principalement le bois d'ébène et l'acajou, il crée des œuvres aux lignes épurées qui rendent hommage à la spiritualité de ses ancêtres tout en s'inscrivant dans la modernité.",
    image: artisan3,
    speciality: "Décoration",
    yearsExperience: 40,
    productsCount: 15
  },
  {
    id: "a4",
    name: "Aminata Coulibaly",
    title: "Potière d'Art",
    location: "Bamako, Mali",
    heritage: "Savoir-faire ancestral transmis par sa mère",
    quote: "La terre est vivante, elle nous parle de notre histoire à travers le feu.",
    bio: "Animée par la passion de la terre cuite, Aminata perpétue les méthodes traditionnelles de cuisson à ciel ouvert. Ses poteries, aux formes organiques et aux textures uniques, sont de véritables œuvres d'art qui célèbrent la beauté de l'imparfait.",
    image: artisan4,
    speciality: "Céramiques & Poteries",
    yearsExperience: 20,
    productsCount: 34
  },
  {
    id: "a5",
    name: "Moussa Koné",
    title: "Bijoutier Traditionnel",
    location: "Dakar, Sénégal",
    heritage: "Descendant d'une longue lignée d'orfèvres",
    quote: "Chaque bijou est une promesse faite au temps qui passe.",
    bio: "Moussa excelle dans l'art complexe du filigrane d'or et d'argent, une technique emblématique du Sénégal. Ses créations, d'une grande finesse, marient l'or et l'argent dans des motifs qui racontent l'histoire de la noblesse ouest-africaine.",
    image: artisan5,
    speciality: "Coffrets & Cadeaux",
    yearsExperience: 30,
    productsCount: 50
  },
  {
    id: "a6",
    name: "Djeneba Traoré",
    title: "Brodeuse d'Excellence",
    location: "Abidjan, Côte d'Ivoire",
    heritage: "Maîtrise des broderies royales",
    quote: "Le fil est le lien qui unit nos traditions à notre avenir.",
    bio: "Djeneba crée des broderies d'une précision remarquable, inspirées par les motifs traditionnels ivoiriens. Ses œuvres textiles habillent les plus belles tables et transforment des étoffes simples en véritables chefs-d'œuvre de patience et de raffinement.",
    image: artisan6,
    speciality: "Maison & Textile",
    yearsExperience: 18,
    productsCount: 22
  }
];

export const products: Product[] = [
  // Maroquinerie (5)
  {
    id: "p1",
    name: "Sac Signature en Cuir",
    artisanId: "a1",
    category: "maroquinerie",
    subcategory: "Sacs à Main",
    price: 350,
    description: "Un sac intemporel aux lignes épurées, confectionné dans un cuir pleine fleur d'une qualité exceptionnelle.",
    details: ["Cuir de veau pleine fleur", "Finitions en laiton massif", "Doublure en coton tissé à la main", "Dimensions: 30 x 25 x 12 cm"],
    image: productLeather,
    tag: "Best-Seller",
    inStock: true
  },
  {
    id: "p2",
    name: "Sac de Voyage Nomade",
    artisanId: "a1",
    category: "maroquinerie",
    subcategory: "Sacs de Voyage",
    price: 520,
    description: "Conçu pour les escapades, ce sac de voyage robuste acquiert une patine unique au fil du temps.",
    details: ["Cuir souple et résistant", "Coutures renforcées", "Bandoulière amovible", "Capacité idéale pour un week-end"],
    image: productLeather2,
    inStock: true
  },
  {
    id: "p3",
    name: "Portefeuille Héritage",
    artisanId: "a1",
    category: "maroquinerie",
    subcategory: "Portefeuilles & Petite Maroquinerie",
    price: 120,
    description: "Élégant et fonctionnel, ce portefeuille offre un agencement optimal pour vos essentiels du quotidien.",
    details: ["Multiples compartiments pour cartes", "Poche monnaie zippée", "Cuir texturé", "Compact et léger"],
    image: productLeather3,
    tag: "Nouveau",
    inStock: true
  },
  {
    id: "p4",
    name: "Ceinture Tressée",
    artisanId: "a1",
    category: "maroquinerie",
    subcategory: "Ceintures",
    price: 85,
    description: "Une ceinture artisanale qui souligne subtilement la taille, mêlant tradition et modernité.",
    details: ["Motifs tressés à la main", "Boucle en bronze vieilli", "Ajustable à différentes tailles"],
    image: productLeather4,
    inStock: true
  },
  {
    id: "p5",
    name: "Cabas Essentiel",
    artisanId: "a1",
    category: "maroquinerie",
    subcategory: "Sacs à Main",
    price: 280,
    description: "Le compagnon idéal pour une journée active, spacieux et structuré avec une touche d'élégance naturelle.",
    details: ["Grande capacité intérieure", "Poche intérieure de sécurité", "Poignées confortables", "Design minimaliste"],
    image: productLeather5,
    inStock: true
  },

  // Maison (5)
  {
    id: "p6",
    name: "Coussin Tissé Main",
    artisanId: "a2",
    category: "maison",
    subcategory: "Coussins",
    price: 95,
    description: "Apportez une touche de chaleur à votre intérieur avec ce coussin en coton naturel, tissé avec soin.",
    details: ["100% Coton organique", "Teintures végétales", "Garniture moelleuse incluse", "Housse amovible"],
    image: productCushion,
    inStock: true
  },
  {
    id: "p7",
    name: "Chemin de Table Ségou",
    artisanId: "a2",
    category: "maison",
    subcategory: "Linge de Maison",
    price: 185,
    description: "Une pièce maîtresse pour vos réceptions, habillant la table d'élégance et de tradition.",
    details: ["Motifs géométriques traditionnels", "Tissage serré de haute qualité", "Entretien facile", "Dimensions: 200 x 45 cm"],
    image: productLinen,
    tag: "Nouveau",
    inStock: true
  },
  {
    id: "p8",
    name: "Plaid en Bogolan",
    artisanId: "a2",
    category: "maison",
    subcategory: "Tissus & Bogolan",
    price: 210,
    description: "Doux et enveloppant, ce plaid raconte l'histoire du Bogolan à travers ses teintes profondes.",
    details: ["Véritable Bogolan du Mali", "Idéal comme jeté de canapé", "Fabrication éthique"],
    image: productMaison1,
    tag: "Pièce Unique",
    inStock: true
  },
  {
    id: "p9",
    name: "Natte Tressée Traditionnelle",
    artisanId: "a6",
    category: "maison",
    subcategory: "Tapis & Nattes",
    price: 150,
    description: "Une natte artisanale robuste et esthétique, parfaite pour délimiter les espaces avec naturel.",
    details: ["Fibres naturelles", "Résistant et durable", "Usage intérieur ou extérieur abrité"],
    image: productMaison2,
    inStock: true
  },
  {
    id: "p10",
    name: "Set de Serviettes Brodées",
    artisanId: "a6",
    category: "maison",
    subcategory: "Linge de Maison",
    price: 110,
    description: "Des serviettes de table délicatement brodées à la main, pour un art de la table raffiné.",
    details: ["Lin de qualité supérieure", "Broderies fines", "Set de 6 pièces"],
    image: productMaison3,
    inStock: true
  },

  // Decoration (5)
  {
    id: "p11",
    name: "Sculpture en Ébène",
    artisanId: "a3",
    category: "decoration",
    subcategory: "Sculptures",
    price: 450,
    description: "Une œuvre d'art saisissante qui joue avec la lumière et les ombres, taillée dans un bois précieux.",
    details: ["Bois d'ébène véritable", "Pièce numérotée", "Finition cirée à la main", "Hauteur: 40 cm"],
    image: productSculpture,
    tag: "Édition Limitée",
    inStock: true
  },
  {
    id: "p12",
    name: "Vase en Terre Cuite Ancestrale",
    artisanId: "a4",
    category: "decoration",
    subcategory: "Céramiques & Poteries",
    price: 240,
    description: "Un vase aux lignes pures, inspiré des amphores traditionnelles et cuit selon des méthodes anciennes.",
    details: ["Argile locale", "Cuisson au feu de bois", "Imperméabilisé pour usage floral"],
    image: productDecor,
    tag: "Pièce Unique",
    inStock: true
  },
  {
    id: "p13",
    name: "Panneau Mural Sculpté",
    artisanId: "a3",
    category: "decoration",
    subcategory: "Art Mural",
    price: 320,
    description: "Une décoration murale texturée qui apporte profondeur et caractère à n'importe quelle pièce.",
    details: ["Bois d'acajou sculpté", "Motifs en bas-relief", "Système d'accroche intégré"],
    image: productSculpture,
    inStock: true
  },
  {
    id: "p14",
    name: "Grande Jarre Décorative",
    artisanId: "a4",
    category: "decoration",
    subcategory: "Céramiques & Poteries",
    price: 290,
    description: "Une pièce maîtresse pour votre décoration, aux nuances terreuses uniques.",
    details: ["Poterie artisanale", "Finition texturée", "Parfaite pour les grandes compositions florales sèches"],
    image: productDecor,
    tag: "Nouveau",
    inStock: true
  },
  {
    id: "p15",
    name: "Masque Abstrait",
    artisanId: "a3",
    category: "decoration",
    subcategory: "Sculptures",
    price: 380,
    description: "Une interprétation moderne et épurée des masques traditionnels, sculptée avec précision.",
    details: ["Bois patiné", "Socle en métal inclus", "Design minimaliste"],
    image: productSculpture,
    inStock: true
  },

  // Coffrets (5)
  {
    id: "p16",
    name: "Coffret Découverte",
    artisanId: "a5",
    category: "coffrets",
    subcategory: "Coffrets Sur Mesure",
    price: 180,
    description: "Une sélection d'essentiels pour découvrir l'excellence de notre artisanat, présentée dans un bel écrin.",
    details: ["Contient 3 pièces assorties", "Boîte en bois réutilisable", "Carte explicative incluse"],
    image: productGift,
    tag: "Best-Seller",
    inStock: true
  },
  {
    id: "p17",
    name: "Coffret Union & Mariage",
    artisanId: "a5",
    category: "coffrets",
    subcategory: "Coffrets Mariage",
    price: 250,
    description: "Le cadeau idéal pour célébrer une union, symbolisant la durabilité et l'harmonie.",
    details: ["Sélection pour la maison", "Emballage raffiné avec ruban", "Possibilité de personnalisation"],
    image: productGift,
    inStock: true
  },
  {
    id: "p18",
    name: "Coffret Prestige Corporate",
    artisanId: "a5",
    category: "coffrets",
    subcategory: "Coffrets Corporate",
    price: 300,
    description: "Un coffret élégant conçu pour marquer les esprits de vos partenaires et collaborateurs.",
    details: ["Articles de bureau en cuir et bois", "Personnalisation avec logo possible", "Présentation premium"],
    image: productGift,
    inStock: true
  },
  {
    id: "p19",
    name: "Coffret Célébration Tabaski",
    artisanId: "a5",
    category: "coffrets",
    subcategory: "Coffrets Tabaski",
    price: 160,
    description: "Une composition festive pour partager la joie, incluant encens rares et accessoires raffinés.",
    details: ["Encens traditionnels", "Porte-encens artisanal", "Petite maroquinerie assortie"],
    image: productGift,
    tag: "Édition Limitée",
    inStock: true
  },
  {
    id: "p20",
    name: "Coffret Exception Sur Mesure",
    artisanId: "a5",
    category: "coffrets",
    subcategory: "Coffrets Sur Mesure",
    price: 500,
    description: "Créez une expérience inoubliable en sélectionnant vous-même des pièces rares pour un cadeau véritablement unique.",
    details: ["Consultation avec un conseiller", "Sélection parmi nos pièces uniques", "Coffret en bois précieux sculpté"],
    image: productGift,
    tag: "Pièce Unique",
    inStock: true
  }
];
