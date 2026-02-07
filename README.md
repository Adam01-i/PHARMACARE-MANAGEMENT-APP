# PROJET-PHARMACIE

# 📌 **Description du projet**

**DIGITAL PHARMACIE SYSTEM** est une **plateforme web moderne de pharmacie en ligne**, permettant aux utilisateurs de **rechercher des produits pharmaceutiques, gérer un panier, ajouter des favoris, passer des commandes et suivre leur historique**.

L’application intègre un **système d’authentification sécurisé**, un **catalogue dynamique avec recherche**, un **panneau de notifications**, ainsi qu’un **espace administrateur** pour la gestion des produits, des commandes et des utilisateurs.

Construite avec **React, TypeScript, Vite et Tailwind CSS**, et connectée à **Supabase** pour la base de données et l’authentification, la plateforme garantit **performance, sécurité et évolutivité**, tout en offrant une **expérience utilisateur fluide et intuitive**.

Ce projet est idéal pour les **pharmacies modernes**, **boutiques médicales en ligne**, ou comme **solution e-commerce spécialisée dans la santé**.

---

```md
# 💊 PHARMACARE — DIGITAL PHARMACIE SYSTEM

Plateforme web moderne de **vente de produits pharmaceutiques en ligne**, incluant un système d’authentification, panier, favoris, commandes et tableau de bord administrateur.

---

## 🚀 Fonctionnalités

### 👤 Utilisateurs
- Inscription & connexion sécurisées
- Gestion du profil utilisateur
- Recherche rapide de produits
- Ajout aux favoris ❤️
- Gestion du panier 🛒
- Suivi des commandes 📦
- Notifications en temps réel 🔔

### 🛍️ Boutique & Catalogue
- Catalogue dynamique de produits
- Barre de recherche intelligente
- Filtres & navigation optimisés
- Affichage des détails produits

### 🛒 Commandes
- Création & validation des commandes
- Historique des achats
- Suivi du statut des commandes

### 🛠️ Administration
- Tableau de bord Admin
- Gestion des produits
- Gestion des commandes
- Gestion des utilisateurs
- Supervision de la base Supabase

---

## 🛠️ Technologies utilisées

- **React + TypeScript**
- **Vite** — Build ultra-rapide
- **Tailwind CSS** — UI moderne
- **Supabase** — Authentification & Base de données
- **PostCSS**
- **Lucide Icons**
- **State Management (store.ts)**

---

## 📂 Structure du projet

```

src/
├── components/        # UI Components
│   ├── AuthModal
│   ├── FavoriteButton
│   ├── SearchBar
│   ├── NotificationsPanel
│   └── Navigation
├── pages/             # Pages principales
│   ├── Home
│   ├── Catalog
│   ├── Cart
│   ├── Orders
│   ├── Profile
│   └── Admin
├── lib/               # Supabase & Store
├── types/             # Types DB
└── App.tsx

```

---

## 🧩 Composants clés

| Composant | Fonction |
|---------|--------|
| `SearchBar` | Recherche produits |
| `FavoriteButton` | Gestion favoris |
| `AuthModal` | Authentification |
| `NotificationsPanel` | Notifications |
| `Cart` | Panier |
| `Orders` | Historique commandes |
| `Admin` | Tableau de bord |

---

## 🗄️ Base de données (Supabase)

Tables principales :
- `users`
- `products`
- `favorites`
- `cart`
- `orders`
- `notifications`

Migrations disponibles dans :
```

## 🖼️ Captures d’écran (optionnel)

```md
![Home](screenshots/home.png)
![Catalog](screenshots/catalog.png)
![Cart](screenshots/cart.png)
![Admin Dashboard](screenshots/admin.png)
```

supabase/migrations/

````

---

## ⚙️ Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/Adam01-i/DIGITAL-PHARMACY-SYSTEM.git 
cd DIGITAL-PHARMACY-SYSTEM
````

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Configurer Supabase

Créer un fichier `.env` :

```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 4️⃣ Lancer le projet

```bash
npm run dev
```

➡️ Accès local : [http://localhost:5173](http://localhost:5173)

---

## 🔐 Sécurité

* Authentification Supabase
* Protection des routes Admin
* Gestion des rôles (User / Admin)
* Validation des formulaires

---

## 🚀 Déploiement

Recommandé :

* **Vercel**
* **Netlify**
* **Cloudflare Pages**

```bash
npm run build
```

---

## 📧 Contact

**Auteur : Adama Seck**
📩 Email : [seckmote@gmail.com](mailto:seckmote@gmail.com)
💼 GitHub : [https://github.com/Adam01-i](https://github.com/Adam01-i)
🔗 LinkedIn : [https://linkedin.com/in/Adam01-i](https://linkedin.com/in/Adam01-i)

---

## 📄 Licence

Projet sous licence **MIT**.

```
