import "server-only";

export type VisualTopicId =
  | "memoria-afroterritorial"
  | "gobierno-propio"
  | "scita"
  | "biblioteca"
  | "noticias-eventos"
  | "mujeres-juventudes-ninez"
  | "inicio-institucional";

export type VisualScreenId =
  | "home-hero"
  | "home-accesos-rapidos"
  | "memoria-hero"
  | "memoria-submodulo"
  | "gobierno-instrumentos"
  | "scita-mapa"
  | "scita-capas"
  | "biblioteca-cards"
  | "noticias-detalle"
  | "mjn-hero";

export type VisualAssetType = "image" | "video" | "design";
export type SupportedAspectRatio = "1:1" | "4:5" | "16:9" | "9:16";

export type BrandGuidelines = {
  colors: Record<string, string>;
  typography: {
    display: string;
    body: string;
    personality: string;
  };
  tone: string[];
  hardRules: string[];
};

export type VisualTopicProfile = {
  label: string;
  politicalContext: string;
  visualKeywords: string[];
  tone: string;
};

export type VisualScreenProfile = {
  label: string;
  pagePath: string;
  topicIds: VisualTopicId[];
  styleDirection: string;
  composition: string;
  recommendedAspectRatio: SupportedAspectRatio;
  recommendedAssetTypes: VisualAssetType[];
  outputIntent: string;
  contentAnalysis: {
    sourceFiles: string[];
    sections: Array<{
      id: string;
      title: string;
      purpose: string;
      components: string[];
      visualTargets: string[];
    }>;
  };
};

export const PALENKE_BRAND_GUIDELINES: BrandGuidelines = {
  colors: {
    pcnBlack: "#1a1a1a",
    pcnGreen: "#2e7d32",
    pcnRed: "#d32f2f",
    pcnYellow: "#fbc02d",
    pageCream: "#f8f5f2",
    pageWarm: "#f0eae0",
  },
  typography: {
    display: "DM Serif Display",
    body: "Source Sans 3",
    personality: "institutional, territorial, warm, politically clear",
  },
  tone: [
    "dignified",
    "community-centered",
    "territorial and political",
    "clear and non-sensationalist",
  ],
  hardRules: [
    "No stereotypes or folklorized representation.",
    "Avoid visual violence or trauma imagery unless explicitly requested.",
    "Prefer context-rich territorial symbols (river, mangrove, collective tools).",
    "Keep contrast and readability ready for production UI overlays.",
    "No embedded logos or text baked into images unless explicitly requested.",
  ],
};

export const VISUAL_TOPIC_PROFILES: Record<VisualTopicId, VisualTopicProfile> = {
  "memoria-afroterritorial": {
    label: "Memoria Afroterritorial",
    politicalContext:
      "Historical, juridical, cultural, and ancestral memory for collective rights defense.",
    visualKeywords: ["memory archive", "territory", "river culture", "ancestral knowledge"],
    tone: "reflective, rooted, and intergenerational",
  },
  "gobierno-propio": {
    label: "Gobierno Propio",
    politicalContext:
      "Collective authority, governance instruments, and territorial autonomy of community councils.",
    visualKeywords: ["collective governance", "territorial planning", "community authority"],
    tone: "institutional, firm, and organized",
  },
  scita: {
    label: "SCITA",
    politicalContext:
      "Community territorial and environmental information system for decision making.",
    visualKeywords: ["community GIS", "layers", "monitoring", "environmental alerts"],
    tone: "technical but community-first",
  },
  biblioteca: {
    label: "Biblioteca Base",
    politicalContext:
      "Repository of norms, public policy, and community knowledge for legal and political action.",
    visualKeywords: ["documents", "knowledge system", "juridical memory"],
    tone: "editorial, ordered, and informative",
  },
  "noticias-eventos": {
    label: "Noticias y Eventos",
    politicalContext: "Current milestones, territorial processes, and collective communications.",
    visualKeywords: ["newsroom", "territorial action", "collective communication"],
    tone: "timely, credible, and mobilizing",
  },
  "mujeres-juventudes-ninez": {
    label: "Mujeres, Juventudes y Ninez",
    politicalContext:
      "Agenda for women, youth, and children with pedagogical and political emphasis.",
    visualKeywords: ["intergenerational", "care", "leadership", "community education"],
    tone: "hopeful, empowering, and collective",
  },
  "inicio-institucional": {
    label: "Inicio Institucional",
    politicalContext:
      "Main institutional narrative of who PCN is, what it does, and how to navigate.",
    visualKeywords: ["institutional hero", "entry points", "territorial identity"],
    tone: "welcoming, strategic, and clear",
  },
};

export const VISUAL_SCREEN_PROFILES: Record<VisualScreenId, VisualScreenProfile> = {
  "home-hero": {
    label: "Home Hero",
    pagePath: "/",
    topicIds: ["inicio-institucional"],
    styleDirection: "cinematic cover with subtle movement and strong headline readability",
    composition: "foreground safe area for title + CTA, deep textured territorial background",
    recommendedAspectRatio: "16:9",
    recommendedAssetTypes: ["image", "video", "design"],
    outputIntent: "landing hero background and hero copy package",
    contentAnalysis: {
      sourceFiles: [
        "src/app/page.tsx",
        "src/components/home/HeroCards.tsx",
        "src/components/home/ExpandableVideo.tsx",
      ],
      sections: [
        {
          id: "hero-principal",
          title: "Hero principal",
          purpose: "Present institutional narrative and core CTA with high visual impact.",
          components: ["video background", "hero heading", "search form", "ExpandableVideo"],
          visualTargets: ["hero background image/video", "hero overlay gradient"],
        },
        {
          id: "quienes-somos",
          title: "Quienes somos",
          purpose: "Explain organizational identity and strategic role.",
          components: ["HomeWhoWeAreAccordion", "section heading", "intro paragraphs"],
          visualTargets: ["supportive editorial texture", "section divider accents"],
        },
        {
          id: "orientacion-politica",
          title: "Orientacion politica",
          purpose: "Connect audiovisual narrative with political orientation content.",
          components: ["HomeVideoGallery", "HomePoliticalOrientationAccordion"],
          visualTargets: ["video thumbnails", "content card background"],
        },
        {
          id: "accesos-rapidos",
          title: "Accesos rapidos",
          purpose: "Expose direct entry cards to high-priority modules.",
          components: ["quick-access cards", "CTA links"],
          visualTargets: ["card covers", "tag badges", "icon accents"],
        },
        {
          id: "noticias-home",
          title: "Noticias en home",
          purpose: "Surface latest news and incidence updates.",
          components: ["news cards", "list links", "category chips"],
          visualTargets: ["news cover placeholders", "category color overlays"],
        },
      ],
    },
  },
  "home-accesos-rapidos": {
    label: "Home Accesos Rapidos",
    pagePath: "/",
    topicIds: ["inicio-institucional"],
    styleDirection: "modular and card-ready with high clarity for quick actions",
    composition: "three-entry visual system with clear icon/shape hierarchy",
    recommendedAspectRatio: "1:1",
    recommendedAssetTypes: ["image", "design"],
    outputIntent: "card visual kit for quick access modules",
    contentAnalysis: {
      sourceFiles: ["src/app/page.tsx"],
      sections: [
        {
          id: "hero-principal",
          title: "Hero principal",
          purpose: "Keep visual continuity between hero and quick-access cards.",
          components: ["hero heading", "hero CTAs", "HeroCards"],
          visualTargets: ["hero-card previews", "module color bridge"],
        },
        {
          id: "accesos-rapidos",
          title: "Accesos rapidos",
          purpose: "Highlight three core module entry points with immediate clarity.",
          components: ["quick-access card grid", "tag pill", "card CTA"],
          visualTargets: ["1:1 card covers", "module badge visuals"],
        },
        {
          id: "noticias-home",
          title: "Noticias en home",
          purpose: "Maintain visual coherence with the editorial section below.",
          components: ["news cards", "incidence links"],
          visualTargets: ["color accents reused from quick-access palette"],
        },
      ],
    },
  },
  "memoria-hero": {
    label: "Memoria Hero",
    pagePath: "/memoria-afroterritorial",
    topicIds: ["memoria-afroterritorial"],
    styleDirection: "dark editorial frame with dignified and archival atmosphere",
    composition: "immersive background with bottom-left title safe zone",
    recommendedAspectRatio: "16:9",
    recommendedAssetTypes: ["image", "video", "design"],
    outputIntent: "page opener for memory module",
    contentAnalysis: {
      sourceFiles: ["src/app/memoria-afroterritorial/page.tsx"],
      sections: [
        {
          id: "memoria-hero-video",
          title: "Hero de memoria",
          purpose: "Open module with immersive cover and territorial memory signal.",
          components: ["VideoThumbnail", "title overlay", "tag label"],
          visualTargets: ["16:9 hero image/video", "overlay-safe focal point"],
        },
        {
          id: "definicion-funcion",
          title: "Definicion y funcion",
          purpose: "Explain conceptual scope and political function of the module.",
          components: ["definition text", "function bullet list", "supportive visual panel"],
          visualTargets: ["illustrative side panel", "section texture accents"],
        },
        {
          id: "normativa-vigente",
          title: "Normativa vigente",
          purpose: "Route users to legal framework and strategic rights tools.",
          components: ["CTA card", "function bullets", "link to biblioteca"],
          visualTargets: ["card background", "iconography for legal memory"],
        },
        {
          id: "memoria-viva",
          title: "Memoria viva del territorio",
          purpose: "Promote cultural and community knowledge resources.",
          components: ["CTA visual card", "definition block", "link to biblioteca section"],
          visualTargets: ["editorial background", "symbolic memory motifs"],
        },
      ],
    },
  },
  "memoria-submodulo": {
    label: "Memoria Submodulo Card",
    pagePath: "/memoria-afroterritorial",
    topicIds: ["memoria-afroterritorial"],
    styleDirection: "clean institutional card with warm-paper contrast and subtle symbolism",
    composition: "text-first card with supportive graphic texture",
    recommendedAspectRatio: "4:5",
    recommendedAssetTypes: ["image", "design"],
    outputIntent: "submodule card and section assets",
    contentAnalysis: {
      sourceFiles: [
        "src/app/memoria-afroterritorial/page.tsx",
        "src/app/biblioteca/page.tsx",
        "src/components/palenke/BibliotecaDocGrid.tsx",
      ],
      sections: [
        {
          id: "normativa-vigente-card",
          title: "Card Normativa vigente",
          purpose: "Represent legal corpus with high readability in listing views.",
          components: ["section card", "CTA link", "metadata chips"],
          visualTargets: ["4:5 thumbnail", "document card cover"],
        },
        {
          id: "memoria-viva-card",
          title: "Card Memoria viva",
          purpose: "Represent community archives and cultural production assets.",
          components: ["section card", "supportive text block", "CTA link"],
          visualTargets: ["4:5 thumbnail", "editorial accent texture"],
        },
        {
          id: "biblioteca-grids",
          title: "Grillas de biblioteca",
          purpose: "Render cards in dense grids with metadata overlays.",
          components: ["BibliotecaDocGrid", "BibliotecaMemoriaGrid"],
          visualTargets: ["cover image slot", "chip-safe composition zones"],
        },
      ],
    },
  },
  "gobierno-instrumentos": {
    label: "Gobierno Instrument Grid",
    pagePath: "/gobierno-propio",
    topicIds: ["gobierno-propio"],
    styleDirection: "structured governance visuals with modular semantic colors",
    composition: "grid-based supportive assets for each governance instrument",
    recommendedAspectRatio: "1:1",
    recommendedAssetTypes: ["image", "design"],
    outputIntent: "instrument cards and badges",
    contentAnalysis: {
      sourceFiles: [
        "src/app/gobierno-propio/page.tsx",
        "src/components/palenke/InstrumentDashboardGrid.tsx",
      ],
      sections: [
        {
          id: "gobierno-header",
          title: "Encabezado de modulo",
          purpose: "Introduce governance framework and strategic narrative.",
          components: ["module title", "intro paragraphs", "GovernmentFunctionsList"],
          visualTargets: ["supportive header motif", "impact-card accents"],
        },
        {
          id: "instrumentos-grid",
          title: "Grid de instrumentos",
          purpose: "Show five governance instruments as actionable cards.",
          components: ["InstrumentDashboardGrid", "card cover image", "icon badge", "CTA"],
          visualTargets: [
            "reglamentos.png",
            "planes-uso.png",
            "etnodesarrollo.png",
            "conservacion.png",
            "proteccion-hidrica.png",
          ],
        },
        {
          id: "alianzas",
          title: "Bloque de alianzas",
          purpose: "Display oriented-by and partner organization logos.",
          components: ["brand cards", "logo containers"],
          visualTargets: ["secondary card backgrounds", "neutral partner frame"],
        },
      ],
    },
  },
  "scita-mapa": {
    label: "SCITA Map Header",
    pagePath: "/scita",
    topicIds: ["scita"],
    styleDirection: "data-oriented map mood, layered geography, and field monitoring cues",
    composition: "large map base with legend-safe zones",
    recommendedAspectRatio: "16:9",
    recommendedAssetTypes: ["image", "video", "design"],
    outputIntent: "map hero background and geospatial explainer visuals",
    contentAnalysis: {
      sourceFiles: ["src/app/scita/page.tsx"],
      sections: [
        {
          id: "scita-header",
          title: "Encabezado SCITA",
          purpose: "Set the module identity before map interaction.",
          components: ["section title", "dark header strip"],
          visualTargets: ["header background gradient"],
        },
        {
          id: "scita-mapa-principal",
          title: "Mapa territorial principal",
          purpose: "Represent geospatial context with readable legend and hotspots.",
          components: ["map texture", "legend", "map label", "geoportal CTA"],
          visualTargets: ["16:9 map hero image/video", "legend-safe corners"],
        },
        {
          id: "video-explicativo",
          title: "Video explicativo SCITA",
          purpose: "Explain module function with audiovisual story.",
          components: ["video thumbnail", "play button", "description bullets"],
          visualTargets: ["video cover frame", "preview composition"],
        },
        {
          id: "capas-informacion",
          title: "Capas de informacion",
          purpose: "Expose layer categories and activation controls.",
          components: ["ScitaLayerToggles", "layer cards", "color-coded states"],
          visualTargets: ["layer tile covers", "category badges"],
        },
      ],
    },
  },
  "scita-capas": {
    label: "SCITA Layer Cards",
    pagePath: "/scita",
    topicIds: ["scita"],
    styleDirection: "technical cards with clear layer differentiation and readability",
    composition: "small tile visuals that remain clear at low sizes",
    recommendedAspectRatio: "1:1",
    recommendedAssetTypes: ["image", "design"],
    outputIntent: "layer toggle card assets",
    contentAnalysis: {
      sourceFiles: ["src/app/scita/page.tsx", "src/components/palenke/ScitaLayerToggles.tsx"],
      sections: [
        {
          id: "capas-informacion",
          title: "Capas de informacion",
          purpose: "Provide visual identity for each map layer category.",
          components: ["ScitaLayerToggles", "toggle chips", "layer labels"],
          visualTargets: [
            "1:1 layer card covers",
            "ACC category visual",
            "hidrica category visual",
            "alertas category visual",
          ],
        },
        {
          id: "acceso-geoportal",
          title: "Acceso a geoportal",
          purpose: "Bridge layer cards with full GIS platform access.",
          components: ["CTA block", "supportive map illustration"],
          visualTargets: ["auxiliary illustration", "CTA side visual"],
        },
      ],
    },
  },
  "biblioteca-cards": {
    label: "Biblioteca Cards",
    pagePath: "/biblioteca",
    topicIds: ["biblioteca", "memoria-afroterritorial"],
    styleDirection: "editorial and documentary with strong metadata readability",
    composition: "cover art that leaves room for overlay chips and titles",
    recommendedAspectRatio: "4:5",
    recommendedAssetTypes: ["image", "design"],
    outputIntent: "document thumbnails and listing cards",
    contentAnalysis: {
      sourceFiles: [
        "src/app/biblioteca/page.tsx",
        "src/components/palenke/BibliotecaDocGrid.tsx",
        "src/components/palenke/BibliotecaMemoriaGrid.tsx",
      ],
      sections: [
        {
          id: "biblioteca-encabezado",
          title: "Encabezado de biblioteca",
          purpose: "Contextualize section route and explain document corpus.",
          components: ["context ribbon", "rich section header", "module tags"],
          visualTargets: ["header strip accents", "section marker visuals"],
        },
        {
          id: "filtros-busqueda",
          title: "Filtros y busqueda",
          purpose: "Support retrieval workflows by territory, year, and keywords.",
          components: ["filter form", "search input", "active filter chips", "BibliotecaAiSearchPanel"],
          visualTargets: ["search panel iconography", "filter-state badges"],
        },
        {
          id: "grid-documentos",
          title: "Grid de documentos",
          purpose: "Render document cards with quick metadata scanning.",
          components: ["BibliotecaDocGrid", "BibliotecaMemoriaGrid", "pagination controls"],
          visualTargets: ["4:5 document covers", "metadata-safe top area"],
        },
      ],
    },
  },
  "noticias-detalle": {
    label: "Noticias Detalle Hero",
    pagePath: "/noticias/[slug]",
    topicIds: ["noticias-eventos"],
    styleDirection: "journalistic, contextual, and credible with strong focal subject",
    composition: "wide hero image with top and bottom text-safe margins",
    recommendedAspectRatio: "16:9",
    recommendedAssetTypes: ["image", "video", "design"],
    outputIntent: "news hero and supporting media",
    contentAnalysis: {
      sourceFiles: ["src/app/noticias/[slug]/page.tsx"],
      sections: [
        {
          id: "noticia-header",
          title: "Header de noticia",
          purpose: "Present category, source metadata, and headline hierarchy.",
          components: ["metadata pills", "article title"],
          visualTargets: ["category-color accent blocks"],
        },
        {
          id: "imagen-destacada",
          title: "Imagen destacada",
          purpose: "Set the contextual scene of the article before body copy.",
          components: ["featured hero container", "caption"],
          visualTargets: ["16:9 article hero image", "caption-safe lower edge"],
        },
        {
          id: "cuerpo-articulo",
          title: "Cuerpo del articulo",
          purpose: "Combine longform text, quote callout, and mini gallery.",
          components: ["intro paragraph", "quote block", "mini photo gallery"],
          visualTargets: ["gallery thumbnails", "quote accent panel"],
        },
        {
          id: "enlaces-relacionados",
          title: "Enlaces relacionados",
          purpose: "Drive navigation to related documents, dashboards, or governance tools.",
          components: ["related cards", "icon map"],
          visualTargets: ["card icon backgrounds", "module-coded accents"],
        },
      ],
    },
  },
  "mjn-hero": {
    label: "MJN Hero",
    pagePath: "/mujeres-juventudes-ninez",
    topicIds: ["mujeres-juventudes-ninez"],
    styleDirection: "symbolic and vibrant but institutional, centered in care and agency",
    composition: "dynamic abstract composition with CTA-safe zones",
    recommendedAspectRatio: "16:9",
    recommendedAssetTypes: ["image", "video", "design"],
    outputIntent: "MJN hero visual system",
    contentAnalysis: {
      sourceFiles: [
        "src/app/mujeres-juventudes-ninez/page.tsx",
        "src/components/palenke/HeroSection.tsx",
      ],
      sections: [
        {
          id: "mjn-hero",
          title: "Hero MJN",
          purpose: "Lead with agenda framing for women, youth, and children.",
          components: ["HeroSection", "main CTA", "generated hero image"],
          visualTargets: ["16:9 hero image/video", "headline-safe area"],
        },
        {
          id: "mjn-contexto-cita",
          title: "Contexto y cita",
          purpose: "Explain political context and highlight a strategic quote.",
          components: ["SectionHeader", "context paragraphs", "Callout"],
          visualTargets: ["supportive editorial texture", "quote background"],
        },
        {
          id: "mjn-documentos",
          title: "Documentos y materiales",
          purpose: "Filter and list agenda-linked knowledge resources.",
          components: ["tab links", "DocumentCard grid", "biblioteca CTA"],
          visualTargets: ["document thumbnail slot", "tab-state visuals"],
        },
        {
          id: "mjn-piezas-campanas",
          title: "Piezas autorizadas y campanas",
          purpose: "Show publication-authorized stories and active campaign cards.",
          components: ["PiezasAutorizadasSection", "CampaignCard list"],
          visualTargets: ["story media placeholders", "campaign cover visuals"],
        },
      ],
    },
  },
};

export function getVisualTopicOptions() {
  return (Object.entries(VISUAL_TOPIC_PROFILES) as Array<[VisualTopicId, VisualTopicProfile]>).map(
    ([id, profile]) => ({
      id,
      label: profile.label,
      tone: profile.tone,
    }),
  );
}

export function getVisualScreenOptions() {
  return (Object.entries(VISUAL_SCREEN_PROFILES) as Array<[VisualScreenId, VisualScreenProfile]>).map(
    ([id, profile]) => ({
      id,
      label: profile.label,
      pagePath: profile.pagePath,
      topicIds: profile.topicIds,
      recommendedAspectRatio: profile.recommendedAspectRatio,
      recommendedAssetTypes: profile.recommendedAssetTypes,
      contentAnalysis: profile.contentAnalysis,
    }),
  );
}
