# Commune Haho 3 – Kpédomé

Portail de la commune : site public en React (Vite, Tailwind CSS v4, React Router) et administration
complète, avec une API Node.js (Express) et une base PostgreSQL.

## Installation (une seule fois)

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Copiez `.env.example` en `.env`, puis renseignez :
   - le mot de passe PostgreSQL (`PGPASSWORD`) ;
   - une longue chaîne aléatoire (`JWT_SECRET`) ;
   - le premier compte administrateur (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

   **Ne partagez jamais ce fichier** : il est exclu par `.gitignore`.
3. Créez la base, les tables, le contenu initial et le compte administrateur :
   ```bash
   npm run db:init
   ```
   Vous pouvez relancer cette commande sans risque : elle ne remplace rien de ce qui existe déjà.

## Lancer en développement

```bash
npm run dev      # site : http://localhost:5173 · API : http://localhost:4000
```

Cette commande démarre à la fois le site (Vite) et l'API. Vite transmet `/api` et `/uploads` à l'API.

## Administration : `/admin`

On y accède par le lien « Espace mairie » du pied de page. L'administration est séparée du site public.

| Rubrique               | Rôle |
|------------------------|------|
| Tableau de bord        | Chiffres clés, derniers messages, dernières actualités, activité de l'équipe |
| Actualités             | Créer, modifier, publier ou dépublier, mettre à la une, ajouter une galerie photo et vidéo |
| Messages               | Messages du formulaire de contact : lire, répondre, archiver, supprimer |
| Médiathèque            | Envoyer des images, vidéos et PDF (50 Mo maximum par fichier) |
| Pages du site          | Tous les textes et images : informations générales, Maire, Accueil (diaporama, chiffres, agenda, galerie, liens), Commune (conseil municipal…), Démarches, Vie locale, Projets, Contact |
| Utilisateurs           | Comptes de l'équipe (réservé aux administrateurs) |
| Mon compte             | Changer son mot de passe |

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

## Base de données (PostgreSQL)

| Table          | Contenu |
|----------------|---------|
| `contenus`     | Textes et images de chaque section du site (JSON), une ligne par section |
| `actualites`   | Articles |
| `messages`     | Messages reçus par le formulaire de contact |
| `medias`       | Fichiers envoyés (stockés dans le dossier `uploads/`) |
| `utilisateurs` | Comptes de l'administration |
| `journal`      | Historique des actions de l'équipe |

Le contenu d'origine se trouve dans `src/content/defaults.js`. Il sert aussi de secours si l'API ne répond pas.

## Code

| Dossier / fichier         | Rôle |
|---------------------------|------|
| `server/index.js`         | API (authentification, contenus, actualités, messages, médias, comptes) |
| `server/init.js`          | Création de la base et des données initiales |
| `src/pages/`              | Pages du site public |
| `src/admin/`              | Administration |
| `src/admin/schemas.js`    | Champs modifiables de chaque section : ajoutez-y un champ pour le rendre éditable |
| `src/lib/content.jsx`     | Chargement du contenu du site depuis l'API |

## Déploiement avec Docker

Il faut Docker et Docker Compose.

```bash
cp .env.example .env        # puis remplissez PGPASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up -d --build
```

- Site : http://localhost:4000. Administration : http://localhost:4000/admin
- Au premier démarrage, le conteneur crée les tables, le contenu initial et le compte administrateur.
- Les données sont conservées dans deux volumes Docker :
  - `db-data` pour la base PostgreSQL ;
  - `uploads` pour les fichiers de la médiathèque.
- Pour changer le port publié, réglez `APP_PORT` dans `.env`.
- En HTTPS (derrière Nginx, Caddy, Traefik…), mettez `COOKIE_SECURE=true` dans `.env`.

Commandes utiles :

```bash
docker compose logs -f app                                             # journaux de l'application
docker compose exec db pg_dump -U postgres haho3 > sauvegarde.sql      # sauvegarde de la base
docker compose down                                                    # arrêt (les données sont conservées)
```

## Mise en production

```bash
npm run build                          # compile le site dans dist/
npm start                              # l'API sert aussi le site compilé (port PORT, 4000 par défaut)
```

Placez un serveur HTTPS (Nginx, Caddy…) devant le port de l'API et mettez `COOKIE_SECURE=true`.
Sauvegardez régulièrement la base PostgreSQL et le dossier `uploads/`.
