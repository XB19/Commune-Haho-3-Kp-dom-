// Description des formulaires de l'administration, section par section.
// Types : text, textarea, image, icon, strings (liste de textes), list (liste d'éléments à champs).

export const ICONS = [
  ["doc", "Document"],
  ["building", "Bâtiment"],
  ["heart", "Cœur / santé"],
  ["download", "Téléchargement"],
  ["users", "Personnes"],
  ["school", "École"],
  ["map", "Carte"],
  ["leaf", "Nature"],
  ["calendar", "Calendrier"],
  ["phone", "Téléphone"],
  ["mail", "E-mail"],
  ["pin", "Lieu"],
  ["clock", "Horloge"],
  ["photo", "Photo"],
  ["star", "Étoile"],
  ["news", "Journal"],
];

const header = [
  { name: "titre", label: "Titre de la page", type: "text" },
  { name: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
  { name: "image_entete", label: "Image du bandeau", type: "image" },
];

export const SECTIONS = [
  {
    key: "general",
    label: "Informations générales",
    icon: "cog",
    path: "/contact",
    description: "Nom de la commune, coordonnées et horaires, repris dans l'en-tête, le pied de page et la page Contact.",
    groups: [
      {
        title: "Identité",
        fields: [
          { name: "nom", label: "Nom court (en-tête)", type: "text" },
          { name: "sous_titre", label: "Sous-titre (en-tête)", type: "text" },
          { name: "nom_complet", label: "Nom complet (pied de page)", type: "text" },
          { name: "devise", label: "Bandeau supérieur", type: "text" },
          { name: "footer_texte", label: "Texte du pied de page", type: "textarea", rows: 2 },
        ],
      },
      {
        title: "Coordonnées",
        fields: [
          { name: "telephone", label: "Téléphone principal", type: "text", half: true },
          { name: "telephone2", label: "Téléphone secondaire", type: "text", half: true },
          { name: "email", label: "E-mail", type: "text" },
          { name: "adresse", label: "Adresse", type: "textarea", rows: 2 },
        ],
      },
      {
        title: "Horaires d'ouverture",
        fields: [
          { name: "horaires_jours", label: "Jours", type: "text" },
          { name: "horaires_matin", label: "Matin", type: "text", half: true },
          { name: "horaires_apres_midi", label: "Après-midi", type: "text", half: true },
        ],
      },
    ],
  },
  {
    key: "maire",
    label: "Le Maire",
    icon: "users",
    path: "/",
    description: "Portrait et mot du Maire affichés sur la page d'accueil.",
    groups: [
      {
        title: "Portrait",
        fields: [
          { name: "photo", label: "Photo officielle", type: "image", aspect: "aspect-square" },
          { name: "titre", label: "Titre honorifique", type: "text", half: true },
          { name: "nom", label: "Nom", type: "text", half: true },
          { name: "fonction", label: "Fonction", type: "text" },
        ],
      },
      {
        title: "Mot du Maire",
        fields: [
          { name: "mot_titre", label: "Titre", type: "text" },
          { name: "mot_texte", label: "Texte", type: "textarea", rows: 9, hint: "Laissez une ligne vide entre deux paragraphes." },
        ],
      },
    ],
  },
  {
    key: "accueil",
    label: "Accueil",
    icon: "home",
    path: "/",
    description: "Diaporama de couverture, services, chiffres clés, agenda, galerie et liens utiles.",
    groups: [
      {
        title: "Diaporama de couverture",
        fields: [
          {
            name: "slides",
            type: "list",
            itemLabel: (s, i) => `Diapositive ${i + 1}${s.eyebrow ? ` · ${s.eyebrow}` : ""}`,
            empty: { image: "", eyebrow: "", title: "", text: "" },
            fields: [
              { name: "image", label: "Image de fond", type: "image" },
              { name: "eyebrow", label: "Surtitre", type: "text" },
              { name: "title", label: "Grand titre", type: "textarea", rows: 2, hint: "Appuyez sur Entrée pour forcer un retour à la ligne." },
              { name: "text", label: "Texte", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
      {
        title: "Accès rapides (services)",
        fields: [
          {
            name: "services",
            type: "list",
            itemLabel: (s) => s.title || "Nouveau service",
            empty: { icon: "doc", title: "", desc: "", to: "/demarches" },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Titre", type: "text", half: true },
              { name: "desc", label: "Description", type: "text" },
              { name: "to", label: "Lien", type: "text", hint: "Ex. : /demarches#etat-civil" },
            ],
          },
        ],
      },
      {
        title: "Chiffres clés",
        fields: [
          {
            name: "chiffres",
            type: "list",
            itemLabel: (c) => (c.value ? `${c.value} · ${c.label}` : "Nouveau chiffre"),
            empty: { value: "", label: "" },
            fields: [
              { name: "value", label: "Valeur", type: "text", half: true, hint: "Ex. : 58 695 ou 592 km²" },
              { name: "label", label: "Libellé", type: "text", half: true },
            ],
          },
        ],
      },
      {
        title: "Agenda",
        fields: [
          { name: "agenda_texte", label: "Texte de présentation", type: "textarea", rows: 3 },
          {
            name: "agenda",
            type: "list",
            itemLabel: (a) => a.titre || "Nouvel événement",
            empty: { jour: "", titre: "", detail: "" },
            fields: [
              { name: "jour", label: "Jour / date", type: "text", half: true },
              { name: "titre", label: "Titre", type: "text", half: true },
              { name: "detail", label: "Détail", type: "text" },
            ],
          },
        ],
      },
      {
        title: "Galerie (espace médias)",
        fields: [
          {
            name: "galerie",
            type: "list",
            itemLabel: (g) => g.alt || "Nouvelle photo",
            empty: { src: "", alt: "" },
            fields: [
              { name: "src", label: "Photo", type: "image" },
              { name: "alt", label: "Légende", type: "text" },
            ],
          },
        ],
      },
      {
        title: "Liens utiles",
        fields: [
          {
            name: "liens",
            type: "list",
            itemLabel: (l) => l.titre || "Nouveau lien",
            empty: { titre: "", desc: "", href: "https://" },
            fields: [
              { name: "titre", label: "Titre", type: "text", half: true },
              { name: "desc", label: "Description", type: "text", half: true },
              { name: "href", label: "Adresse du site", type: "text" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "commune",
    label: "La Commune",
    icon: "building",
    path: "/commune",
    description: "Présentation, élus, composition du Conseil municipal et gouvernance.",
    groups: [
      { title: "Bandeau", fields: header },
      {
        title: "Présentation",
        fields: [
          { name: "presentation_titre", label: "Titre", type: "text" },
          { name: "presentation_texte", label: "Texte", type: "textarea", rows: 5 },
          { name: "presentation_image", label: "Image", type: "image" },
          { name: "badge_valeur", label: "Pastille : valeur", type: "text", half: true },
          { name: "badge_label", label: "Pastille : libellé", type: "text", half: true },
          {
            name: "faits",
            label: "Faits marquants",
            type: "list",
            itemLabel: (f) => f.label || "Nouveau fait",
            empty: { label: "", value: "" },
            fields: [
              { name: "label", label: "Libellé", type: "text", half: true },
              { name: "value", label: "Valeur", type: "text", half: true },
            ],
          },
        ],
      },
      {
        title: "Les élus (rôles)",
        fields: [
          {
            name: "roles",
            type: "list",
            itemLabel: (r) => r.title || "Nouveau rôle",
            empty: { icon: "users", title: "", desc: "" },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Titre", type: "text", half: true },
              { name: "desc", label: "Description", type: "textarea", rows: 3 },
            ],
          },
        ],
      },
      {
        title: "Conseil municipal",
        fields: [
          { name: "conseil_titre", label: "Titre", type: "text" },
          { name: "conseil_texte", label: "Texte", type: "textarea", rows: 3 },
          {
            name: "conseil",
            label: "Membres (dans l'ordre d'affichage)",
            type: "list",
            compact: true,
            itemLabel: (m, i) => `${i + 1}. ${m.nom || "Nouveau membre"}`,
            empty: { nom: "", fonction: "Conseiller municipal" },
            fields: [
              { name: "nom", label: "Nom et prénoms", type: "text", half: true },
              { name: "fonction", label: "Qualité / fonction", type: "text", half: true },
            ],
          },
        ],
      },
      {
        title: "Gouvernance",
        fields: [
          {
            name: "gouvernance",
            type: "list",
            itemLabel: (g) => g.title || "Nouvel axe",
            empty: { icon: "users", title: "", desc: "" },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Titre", type: "text", half: true },
              { name: "desc", label: "Description", type: "textarea", rows: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "demarches",
    label: "Démarches",
    icon: "doc",
    path: "/demarches",
    description: "Catalogue des services municipaux. Les horaires se modifient dans Informations générales.",
    groups: [
      { title: "Bandeau", fields: header },
      {
        title: "Services",
        fields: [
          {
            name: "services",
            type: "list",
            itemLabel: (s) => s.title || "Nouveau service",
            empty: { id: "", icon: "doc", title: "", desc: "", items: [] },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Titre", type: "text", half: true },
              { name: "id", label: "Ancre (lien direct)", type: "text", hint: "Ex. : etat-civil → /demarches#etat-civil" },
              { name: "desc", label: "Description", type: "textarea", rows: 2 },
              { name: "items", label: "Prestations", type: "strings" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "vie_locale",
    label: "Vie locale",
    icon: "leaf",
    path: "/vie-locale",
    description: "Piliers de la vie communale et marchés hebdomadaires.",
    groups: [
      { title: "Bandeau", fields: header },
      {
        title: "Piliers",
        fields: [
          {
            name: "themes",
            type: "list",
            itemLabel: (t) => t.title || "Nouveau pilier",
            empty: { icon: "leaf", title: "", desc: "" },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Titre", type: "text", half: true },
              { name: "desc", label: "Description", type: "textarea", rows: 3 },
            ],
          },
        ],
      },
      {
        title: "Marchés",
        fields: [
          { name: "marches_titre", label: "Titre", type: "text" },
          { name: "marches_texte", label: "Texte", type: "textarea", rows: 3 },
          { name: "marches_image", label: "Image", type: "image" },
          {
            name: "marches",
            type: "list",
            compact: true,
            itemLabel: (m) => (m.lieu ? `${m.jour} · ${m.lieu}` : "Nouveau marché"),
            empty: { jour: "", lieu: "" },
            fields: [
              { name: "jour", label: "Jour", type: "text", half: true },
              { name: "lieu", label: "Lieu", type: "text", half: true },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "projets",
    label: "Projets",
    icon: "map",
    path: "/projets",
    description: "Plan de Développement Communal, réalisations et infrastructures.",
    groups: [
      { title: "Bandeau", fields: header },
      {
        title: "Grandes orientations",
        fields: [
          { name: "orientations_texte", label: "Texte", type: "textarea", rows: 3 },
          { name: "orientations_image", label: "Image", type: "image" },
          { name: "orientations", label: "Orientations", type: "strings" },
        ],
      },
      {
        title: "Projets réalisés",
        fields: [
          {
            name: "realises",
            type: "list",
            itemLabel: (r) => r.title || "Nouveau projet",
            empty: { icon: "building", title: "" },
            fields: [
              { name: "icon", label: "Icône", type: "icon", half: true },
              { name: "title", label: "Intitulé", type: "text", half: true },
            ],
          },
        ],
      },
      {
        title: "Infrastructures",
        fields: [
          {
            name: "infrastructures",
            type: "list",
            itemLabel: (r) => r.title || "Nouvelle infrastructure",
            empty: { title: "", desc: "" },
            fields: [
              { name: "title", label: "Catégorie", type: "text", half: true },
              { name: "desc", label: "Description", type: "text", half: true },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    icon: "mail",
    path: "/contact",
    description: "Informations pratiques de la page Contact. Les coordonnées se modifient dans Informations générales.",
    groups: [
      { title: "Bandeau", fields: header },
      {
        title: "Informations pratiques",
        fields: [
          { name: "acces", label: "Accès à la commune", type: "textarea", rows: 2 },
          {
            name: "infos",
            label: "Bon à savoir",
            type: "list",
            compact: true,
            itemLabel: (i) => i.label || "Nouvelle information",
            empty: { label: "", value: "" },
            fields: [
              { name: "label", label: "Rubrique", type: "text", half: true },
              { name: "value", label: "Information", type: "text", half: true },
            ],
          },
        ],
      },
    ],
  },
];

export const sectionByKey = (key) => SECTIONS.find((s) => s.key === key);
