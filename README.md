# Commune Haho 3 – Kpédomé

Portail de la commune, en deux parties :

| Dossier      | Contenu | Technologies |
|--------------|---------|--------------|
| `frontend/`  | Site public : accueil, la commune, démarches, vie locale, projets, actualités, contact | React, Vite, Tailwind CSS v4 |
| `backend/`   | API, base de données et **tableau de bord d'administration** (`/admin`) | Node.js, Express, PostgreSQL ; tableau de bord en React + Vite |

```
.
├── .env                  configuration locale (non partagée)
├── .env.example          modèle de configuration
├── docker-compose.yml    déploiement : PostgreSQL + backend + frontend
├── package.json          commandes communes (dev, build, db:init)
├── frontend/
│   ├── src/              pages, composants, styles du site public
│   ├── nginx.conf        serveur web du site en production (Docker)
│   └── Dockerfile
└── backend/
    ├── server/           API : index.js (routes), db.js, init.js (création de la base)
    ├── content/          contenu initial du site (defaults.js)
    ├── admin/            tableau de bord d'administration (React)
    ├── uploads/          fichiers envoyés depuis la médiathèque (créé automatiquement)
    └── Dockerfile
```

## Installation (une seule fois)

1. Installez les dépendances des trois `package.json` :
   ```bash
   npm run install:all
   ```
2. Copiez `.env.example` en `.env` (à la racine), puis renseignez :
   - le mot de passe PostgreSQL (`PGPASSWORD`) ;
   - une longue chaîne aléatoire (`JWT_SECRET`) ;
   - le premier compte administrateur (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

   **Ne partagez jamais ce fichier** : il est exclu par `.gitignore`.
3. Créez la base, les tables, le contenu initial et le compte administrateur :
   ```bash
   npm run db:init
   ```
   Vous pouvez relancer cette commande sans risque : elle ne remplace rien de ce qui existe déjà.

## Développement

```bash
npm run dev
```

Cette commande lance trois serveurs :

| Adresse                       | Rôle |
|-------------------------------|------|
| http://localhost:5173         | Site public (frontend) |
| http://localhost:5173/admin   | Tableau de bord (Vite le transmet au backend) |
| http://localhost:4000         | API (backend) |

Chaque partie peut aussi être lancée seule :
- `npm run dev --prefix frontend` pour le site ;
- `npm run dev --prefix backend` pour l'API et le tableau de bord, accessible sur http://localhost:5174/admin.

## Tableau de bord : `/admin`

On y accède par le lien « Espace mairie » du pied de page.

| Rubrique         | Rôle |
|------------------|------|
| Tableau de bord  | Chiffres clés, derniers messages, dernières actualités, activité de l'équipe |
| Actualités       | Créer, modifier, publier ou dépublier, mettre à la une, ajouter une galerie photo et vidéo |
| Messages         | Messages du formulaire de contact : lire, répondre, archiver, supprimer |
| Médiathèque      | Envoyer des images, vidéos et PDF (50 Mo maximum par fichier) |
| Pages du site    | Tous les textes et images du site, page par page |
| Utilisateurs     | Comptes de l'équipe (réservé aux administrateurs) |
| Mon compte       | Changer son mot de passe |

Il existe deux rôles :
- **administrateur** : accès à tout ;
- **éditeur** : tout sauf la gestion des comptes et la remise à zéro des pages.

Après la première connexion, changez le mot de passe initial dans « Mon compte ».

Sécurité :
- les mots de passe sont chiffrés avec bcrypt ;
- la session est conservée dans un cookie httpOnly valable 8 heures ;
- les tentatives de connexion sont limitées ;
- le formulaire de contact est protégé contre les robots ;
- seuls certains types de fichiers peuvent être envoyés.

Pour rendre un nouveau champ modifiable, ajoutez-le dans `backend/admin/src/schemas.js`, puis affichez-le dans la page
correspondante de `frontend/src/pages/`.

## Base de données (PostgreSQL)

| Table          | Contenu |
|----------------|---------|
| `contenus`     | Textes et images de chaque section du site (JSON), une ligne par section |
| `actualites`   | Articles |
| `messages`     | Messages reçus par le formulaire de contact |
| `medias`       | Fichiers envoyés (stockés dans `backend/uploads/`) |
| `utilisateurs` | Comptes de l'administration |
| `journal`      | Historique des actions de l'équipe |

## Déploiement avec Docker

Il faut Docker et Docker Compose.

```bash
cp .env.example .env        # puis remplissez PGPASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up -d --build
```

| Conteneur  | Rôle |
|------------|------|
| `db`       | PostgreSQL 17 (volume `db-data`) |
| `backend`  | API et tableau de bord. Au premier démarrage, crée les tables, le contenu initial et le compte administrateur (volume `uploads`) |
| `frontend` | Nginx : sert le site public et transmet `/api`, `/uploads` et `/admin` au backend |

- Site : http://localhost:8080. Administration : http://localhost:8080/admin
- Pour changer le port, réglez `APP_PORT` dans `.env`.
- En HTTPS (derrière un proxy ou un hébergeur), mettez `COOKIE_SECURE=true` dans `.env`.

Commandes utiles :

```bash
docker compose logs -f backend                                         # journaux de l'API
docker compose exec db pg_dump -U postgres haho3 > sauvegarde.sql      # sauvegarde de la base
docker compose down                                                    # arrêt (les données sont conservées)
```

## Déploiement sans Docker (un seul serveur)

```bash
npm run build     # compile le tableau de bord (backend/dist) et le site (frontend/dist)
npm start         # le backend sert l'API, /admin et le site public (port 4000)
```

Placez un serveur HTTPS (Nginx, Caddy…) devant le port 4000 et mettez `COOKIE_SECURE=true`.
Sauvegardez régulièrement la base PostgreSQL et le dossier `backend/uploads/`.
