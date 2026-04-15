# Sendiaba MVP Front

Application frontend de **Sendiaba** construite avec **React + Vite + TypeScript**, orientee e-commerce artisanal premium.

Le projet inclut:
- un storefront (home, collections, produit, panier, paiement, profil),
- un back-office admin (dashboard, utilisateurs, artisans, contenu),
- une architecture modulaire (domain / services / features),
- une gestion de contenu editable depuis le back-office (stockee localement pour l'instant).

---

## Stack technique

- **Framework**: React 19
- **Bundler**: Vite 6
- **Langage**: TypeScript
- **Style**: Tailwind CSS 4
- **UI**: composants UI + Radix
- **Animations**: Framer Motion
- **Routing**: Wouter
- **State**: React Context (auth, cart)
- **Data locale**: localStorage (session, panier, contenu editable)

---

## Prerequis

- Node.js 20+ (recommande: 22+)
- npm 10+

---

## Installation

```bash
npm install
```

---

## Lancement en local

```bash
npm run dev
```

Application disponible sur:
- `http://localhost:5173`

---

## Scripts disponibles

- `npm run dev` : lance le serveur de developpement Vite
- `npm run build` : build de production
- `npm run serve` : preview du build de production
- `npm run typecheck` : verification TypeScript

---

## Variables d'environnement

Copiez `.env.example` vers `.env` puis adaptez:

```env
VITE_API_URL=
API_PROXY_TARGET=http://localhost:3000
```

Notes:
- `VITE_API_URL`: URL de l'API backend (si disponible)
- `API_PROXY_TARGET`: cible locale du proxy Vite pour les routes `/api`

---

## Comptes de test

### Compte utilisateur
- Email: `abdouazizdiop583@gmail.com`
- Mot de passe: `abdouazizdiop`

### Compte admin
- Email: `admin@sendiaba.com`
- Mot de passe: `Admin@2026`

L'admin est redirige automatiquement vers `/backoffice` apres connexion.

---

## Architecture du projet

```text
src/
  app/                # routes, providers, DI, state global
  components/         # composants UI et sections reutilisables
  content/            # contenu statique / editable (managed-content)
  core/               # config env + abstractions HTTP
  domain/             # types metier + interfaces
  features/           # pages et modules par fonctionnalite
  infrastructure/     # repositories statiques / seeds
  services/           # logique applicative (auth, cart, order...)
```

Principes suivis:
- separation claire des responsabilites,
- services metier centralises,
- composants UI decouples de la logique metier,
- extensibilite pour brancher une API reelle.

---

## Back-office

Routes principales:
- `/backoffice` : dashboard
- `/backoffice/utilisateurs` : gestion utilisateurs (filtres + modal detail)
- `/backoffice/artisans` : edition artisans (photo + infos)
- `/backoffice/contenu` : edition des textes de sections frontend

Pour l'instant, la plupart des donnees back-office sont statiques/locales afin de valider les interfaces UX.

---

## Gestion de contenu editable

Le back-office contenu ecrit les overrides dans `localStorage`:
- cle: `sendiaba.backoffice.content-overrides`

Les composants frontend consomment ces valeurs via:
- `src/content/managed-content.ts`
- helper `getManagedText(key, fallback)`

Cela permet d'editer des textes sans modifier le code.

---

## Build production

```bash
npm run build
```

Sortie:
- `dist/public`

---

## Deploiement Vercel

Le fichier `vercel.json` est deja configure.

Parametres Vercel recommandes:
- **Root Directory**: racine du projet
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`

---

## Qualite et verification

Avant de pousser:

```bash
npm run typecheck
npm run build
```

---

## Roadmap courte

- Brancher les services sur une vraie API backend
- Ajouter persistance server-side pour back-office
- Ajouter ACL admin plus stricte cote API
- Ajouter tests unitaires/integration (services et pages critiques)

---

## Licence

Projet prive - usage interne Sendiaba.
