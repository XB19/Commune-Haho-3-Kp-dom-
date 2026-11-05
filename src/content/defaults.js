// Contenu initial du site, modifiable ensuite depuis l'administration (/admin).
// Ce fichier sert à remplir la base de données (npm run db:init) et de secours
// si l'API n'est pas joignable. Les images « asset:xxx » renvoient aux fichiers de src/assets.
// Un retour à la ligne dans un titre (\n) est respecté à l'affichage.

export const DEFAULT_CONTENT = {
  general: {
    nom: "Commune Haho 3",
    nom_complet: "Commune Haho 3 – Kpédomé",
    sous_titre: "Kpédomé · Togo",
    devise: "République Togolaise · Travail – Liberté – Patrie",
    telephone: "+228 90 72 55 12",
    telephone2: "+228 90 89 46 12",
    email: "communehaho3@gmail.com",
    adresse: "Mairie de Kpédomé, quartier Dougnon, non loin de la RN1, 290 BP 81",
    horaires_jours: "Du lundi au vendredi, tous les jours ouvrables.",
    horaires_matin: "07h30 – 12h00",
    horaires_apres_midi: "14h30 – 17h30",
    footer_texte: "Mairie de la Commune Haho 3, Kpédomé, Préfecture de Haho, Région des Plateaux, Togo.",
  },

  maire: {
    titre: "Honorable",
    nom: "AMOUDJI Komlan",
    fonction: "Député – Maire de la Commune Haho 3 – Kpédomé",
    photo: "asset:maire",
    mot_titre: "Ensemble, construisons un avenir meilleur",
    mot_texte:
      "Notre commune s’engage sur la voie d’un développement harmonieux, participatif et durable. À travers ce portail numérique, nous voulons vous informer régulièrement, faciliter vos démarches, valoriser nos ressources et renforcer le lien avec la population et la diaspora.\n\nEnsemble, avec les chefs traditionnels, les associations, la société civile et nos partenaires, nous construisons un avenir meilleur pour nos enfants. Votre participation est essentielle pour faire de Haho 3 – Kpédomé une commune moderne, solidaire et prospère.",
  },

  accueil: {
    slides: [
      {
        image: "asset:hero",
        eyebrow: "Bienvenue à Kpédomé",
        title: "Commune Haho 3\n– Kpédomé",
        text: "Une collectivité en plein essor au cœur de la préfecture de Haho, riche de ses traditions, de sa diversité culturelle et de son dynamisme économique.",
      },
      {
        image: "asset:projets",
        eyebrow: "Plan de Développement Communal",
        title: "Construire ensemble l'avenir de la commune",
        text: "Éducation, santé, eau potable et désenclavement des zones rurales : les priorités de notre PDC validé.",
      },
      {
        image: "asset:marche",
        eyebrow: "Économie locale",
        title: "Agriculture et marchés, force de notre terre",
        text: "Maïs, manioc, igname, arachide : nous accompagnons nos producteurs pour une prospérité partagée.",
      },
    ],
    services: [
      { icon: "doc", title: "État civil", desc: "Naissance, mariage, décès, actes certifiés.", to: "/demarches#etat-civil" },
      { icon: "building", title: "Urbanisme", desc: "Permis de construire, déclarations de travaux.", to: "/demarches#urbanisme" },
      { icon: "heart", title: "Santé & social", desc: "Vaccination, appui social, eau potable.", to: "/demarches#sante-social" },
      { icon: "download", title: "Formulaires", desc: "Documents administratifs à télécharger.", to: "/demarches#formulaires" },
    ],
    chiffres: [
      { value: "592 km²", label: "Superficie" },
      { value: "58 695", label: "Habitants" },
      { value: "118", label: "Villages et hameaux" },
      { value: "111", label: "Établissements scolaires" },
    ],
    agenda_texte:
      "Les marchés hebdomadaires rythment la vie sociale et économique de Kpédomé. Ils sont le lieu d'échange par excellence des produits agricoles et artisanaux locaux.",
    agenda: [
      { jour: "Mercredi", titre: "Marché d'Akpakpakpé", detail: "Marché hebdomadaire · produits agricoles et artisanaux" },
      { jour: "Vendredi", titre: "Marché d'Agbatitoé", detail: "Marché hebdomadaire · produits agricoles et artisanaux" },
      { jour: "Samedi", titre: "Marché d'Alati", detail: "Marché hebdomadaire · produits agricoles et artisanaux" },
      { jour: "Novembre", titre: "Kpédomé-Gododoza", detail: "Fête des filles et fils de Haho 3 · dernier samedi de novembre" },
    ],
    galerie: [
      { src: "asset:hero", alt: "Paysage rural de la commune au coucher du soleil" },
      { src: "asset:marche", alt: "Marché traditionnel de la commune" },
      { src: "asset:projets", alt: "École primaire réhabilitée dans la commune" },
    ],
    liens: [
      { titre: "République Togolaise", desc: "Portail officiel du Togo", href: "https://www.republiquetogolaise.com" },
      { titre: "Office Togolais des Recettes", desc: "Impôts et douanes", href: "https://www.otr.tg" },
      { titre: "Assemblée nationale", desc: "Lois et travaux parlementaires", href: "https://www.assemblee-nationale.tg" },
      { titre: "Service public", desc: "Démarches administratives nationales", href: "https://service-public.gouv.tg" },
    ],
  },

  commune: {
    titre: "Une commune en plein essor",
    intro:
      "Haho 3 – Kpédomé est l’une des quatre communes de la préfecture de Haho, dans la région des Plateaux au Togo. Elle compte plus de 100 localités et a pour chef-lieu Kpédomé.",
    image_entete: "asset:hero",
    presentation_titre: "Au carrefour de la RN1",
    presentation_texte:
      "Traversée en deux parties par la route nationale N° 1, la commune bénéficie d’une position favorable aux échanges, au commerce, à l’artisanat et aux petites entreprises. Son économie est essentiellement agricole : maïs, manioc, igname, haricot, coton et soja.",
    presentation_image: "asset:hero",
    badge_valeur: "100+",
    badge_label: "Localités",
    faits: [
      { label: "Superficie", value: "592 km²" },
      { label: "Population", value: "58 695 habitants" },
      { label: "Langues", value: "Éwé, kabiyè, lamba, moba et français" },
    ],
    roles: [
      {
        icon: "users",
        title: "Le Maire",
        desc: "Chef de l’exécutif de la commune, il dirige les services municipaux et applique les délibérations du Conseil municipal.",
      },
      {
        icon: "building",
        title: "Les Adjoints au Maire",
        desc: "Ils assistent le Maire et supervisent les secteurs qui leur sont délégués : domaine, environnement, technique, social et jeunesse.",
      },
      {
        icon: "doc",
        title: "Les Conseillers",
        desc: "Ils participent aux commissions, votent le budget, contrôlent les dépenses et prennent les décisions majeures de la commune.",
      },
    ],
    conseil_titre: "Quinze conseillers au service de la commune",
    conseil_texte:
      "Le Conseil municipal compte quinze membres, dont une femme. La Secrétaire générale de la commune est Madame KODJOKPOE Massan.",
    conseil: [
      { nom: "AMOUDJI Komlan", fonction: "Député – Maire de la commune" },
      { nom: "MLAGA Kodjo Gnatépé", fonction: "Premier Adjoint au Maire" },
      { nom: "AKAKPOTSE Edoh", fonction: "Deuxième Adjoint au Maire" },
      { nom: "KOUDO Koudjo", fonction: "Conseiller municipal / Président de la commission domaniale" },
      { nom: "KOUGBLENOU Tsokem", fonction: "Conseiller municipal / Président de la commission sociale" },
      { nom: "LABODJA Essofah", fonction: "Conseiller municipal / Président de la commission finance" },
      { nom: "GAWONOU Fati", fonction: "Conseillère municipale / Rapporteur de la commission sociale" },
      { nom: "DANHUI Kokoutsè Joseph", fonction: "Conseiller municipal / Rapporteur de la commission finance" },
      { nom: "AKPADJA Kodjo", fonction: "Conseiller municipal / Rapporteur de la commission domaniale" },
      { nom: "AFEDJI Yaovi", fonction: "Conseiller municipal" },
      { nom: "BLAOUDINA TOYI Essodessam", fonction: "Conseiller municipal" },
      { nom: "ADAISSO Kossi Hector", fonction: "Conseiller municipal" },
      { nom: "EPOU Komivi Assogba", fonction: "Conseiller municipal" },
      { nom: "AMEDOME K. Ségbédji", fonction: "Conseiller municipal" },
      { nom: "AKUE Yao", fonction: "Conseiller municipal" },
    ],
    gouvernance: [
      { icon: "users", title: "Participation citoyenne", desc: "Réunions publiques, consultations, comités de quartier ou de village." },
      { icon: "heart", title: "Chefferie traditionnelle", desc: "Rôle central dans la cohésion sociale, la résolution des conflits et la préservation des valeurs." },
      { icon: "map", title: "Planification (PDC)", desc: "Élaboration et mise en œuvre du Plan de Développement Communal sur le moyen et long terme." },
      { icon: "doc", title: "Gestion des ressources", desc: "Respect des procédures financières et optimisation des ressources propres." },
    ],
  },

  demarches: {
    titre: "Vos démarches administratives, simplifiées",
    intro:
      "La commune met à votre disposition un ensemble de services pour faciliter vos démarches au quotidien. Horaires, pièces à fournir et frais sont disponibles à la mairie.",
    image_entete: "asset:projets",
    services: [
      {
        id: "etat-civil",
        icon: "doc",
        title: "État civil",
        desc: "Le service assure les déclarations et délivrances des actes officiels :",
        items: ["Naissances", "Mariages civils", "Décès", "Copies et extraits d’actes"],
      },
      {
        id: "urbanisme",
        icon: "building",
        title: "Urbanisme",
        desc: "Le service accompagne les habitants et les promoteurs dans la gestion du territoire :",
        items: [
          "Plan d’aménagement et d’occupation du sol",
          "Permis, construction ou réhabilitation",
          "Conseils d’implantation",
          "Suivi des infrastructures",
        ],
      },
      {
        id: "sante-social",
        icon: "heart",
        title: "Santé et social",
        desc: "En lien avec l'État, les centres de santé et les associations :",
        items: [
          "Appui aux formations sanitaires",
          "Vaccination, hygiène et prévention",
          "Accompagnement des personnes vulnérables",
          "Eau potable et assainissement",
        ],
      },
      {
        id: "formulaires",
        icon: "download",
        title: "Formulaires en ligne",
        desc: "Des formulaires seront progressivement proposés au téléchargement ou en ligne :",
        items: ["Acte d’état civil", "Autorisation de construire", "Attestation de résidence", "Salle, espace public ou partenariat"],
      },
    ],
  },

  vie_locale: {
    titre: "Une commune vivante et engagée",
    intro:
      "Découvrez la richesse de la vie locale à Haho 3 – Kpédomé : l'éducation au cœur des priorités, des traditions vivantes, une économie agricole dynamique et un engagement environnemental fort.",
    image_entete: "asset:marche",
    themes: [
      {
        icon: "school",
        title: "Éducation",
        desc: "Soutien aux écoles primaires et préscolaires, réhabilitation, équipement, scolarisation des filles, lutte contre l’abandon scolaire et formation professionnelle des jeunes.",
      },
      {
        icon: "users",
        title: "Culture & Traditions",
        desc: "Fêtes coutumières, danses, chants et artisanat local. Kpédomé-Gododoza, fête des filles et fils de Haho 3, se célèbre le dernier samedi de novembre.",
      },
      {
        icon: "map",
        title: "Économie & Agriculture",
        desc: "Production de maïs, manioc, igname, haricot et arachide, élevage, commerce, artisanat et services. La commune soutient les producteurs et l’accès aux marchés.",
      },
      {
        icon: "leaf",
        title: "Environnement",
        desc: "Protection de l’eau, des sols et des forêts, reboisement, gestion des déchets, campagnes de propreté et prévention des risques climatiques.",
      },
    ],
    marches_titre: "Les marchés, cœur battant de Kpédomé",
    marches_texte:
      "Les marchés hebdomadaires rythment la vie sociale et économique de la commune. Ils sont le lieu d'échange par excellence des produits agricoles et artisanaux locaux.",
    marches_image: "asset:marche",
    marches: [
      { jour: "Mercredi", lieu: "Akpakpakpé" },
      { jour: "Vendredi", lieu: "Agbatitoé" },
      { jour: "Samedi", lieu: "Alati" },
    ],
  },

  projets: {
    titre: "Construire ensemble l'avenir de la commune",
    intro:
      "Le Plan de Développement Communal validé définit notre vision, nos priorités et nos actions sur plusieurs années. Il a été élaboré de manière participative avec la population et nos partenaires.",
    image_entete: "asset:projets",
    orientations_texte:
      "Son élaboration comprend le diagnostic des besoins, l’identification des secteurs prioritaires, la programmation des investissements et la recherche de partenaires techniques et financiers.",
    orientations_image: "asset:projets",
    orientations: [
      "L'amélioration des services sociaux de base",
      "Le développement économique local",
      "Le renforcement de la gouvernance et de la participation citoyenne",
      "La protection de l'environnement",
    ],
    realises: [
      { icon: "school", title: "Réhabilitation ou construction de salles de classe et bâtiments scolaires" },
      { icon: "heart", title: "Aménagement de forages et points d'eau potable" },
      { icon: "map", title: "Réhabilitation de pistes rurales pour l’écoulement des produits agricoles" },
      { icon: "users", title: "Initiatives de sensibilisation en santé communautaire" },
      { icon: "leaf", title: "Actions de reboisement et d'assainissement" },
    ],
    infrastructures: [
      { title: "Éducatives", desc: "Écoles, collèges et équipements scolaires." },
      { title: "Sanitaires", desc: "Unités de soins périphériques et centres de santé de base." },
      { title: "Routières", desc: "Rues et pistes rurales reliant les villages." },
      { title: "Marchandes", desc: "Marchés, hangars et espaces de vente." },
      { title: "Administratives", desc: "Bâtiments communaux et salles de réunion." },
    ],
  },

  contact: {
    titre: "Échangeons avec la Mairie",
    intro:
      "Pour toute question, suggestion ou demande d'information, l'équipe municipale s'efforce de vous répondre dans les meilleurs délais.",
    image_entete: "asset:hero",
    acces: "Par la route depuis Kpédomé et les autres agglomérations, et par les pistes rurales reliant les villages.",
    infos: [
      { label: "Marchés", value: "Agbatitoé le vendredi, Akpakpakpé le mercredi et Alati le samedi." },
      { label: "Santé", value: "USP d’Agbatitoé, Akpakpakpé, Tsinigan, Kpédikè, Avassikpé et Azakpé." },
      { label: "Éducation", value: "103 établissements primaires et préscolaires, et 8 établissements secondaires." },
      { label: "Chefferie", value: "118 villages et hameaux, et 8 quartiers dans le chef-lieu." },
      { label: "Sécurité", value: "Commissariat à Kpédomé et gendarmerie à Agbatitoé." },
    ],
  },
};

export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT);

export const CATEGORIES = ["Communiqués", "Santé", "Projets", "Événements", "Vie municipale"];
