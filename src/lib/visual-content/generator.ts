import "server-only";
import fs from "fs";
import path from "path";
import { getGeminiApiKey, getGeminiClient } from "@/lib/gemini-client";
import {
  PALENKE_BRAND_GUIDELINES,
  type SupportedAspectRatio,
  type VisualAssetType,
  type VisualScreenProfile,
  type VisualScreenId,
  type VisualTopicId,
  VISUAL_SCREEN_PROFILES,
  VISUAL_TOPIC_PROFILES,
} from "@/lib/visual-content/profiles";

const DIRECTOR_MODEL = process.env.GEMINI_DIRECTOR_MODEL ?? "gemini-3.1-pro-preview";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image-preview";
const VIDEO_MODEL = process.env.GEMINI_VIDEO_MODEL ?? "veo-3.1-generate-preview";
const DEFAULT_VIDEO_DURATION_SECONDS = 8;
const DEFAULT_IMAGE_COUNT = 1;
const GOBIERNO_PLACEHOLDER_OUTPUT_DIR = path.join(
  process.cwd(),
  "public",
  "assets",
  "placeholders",
);

type GobiernoInstrumentConfig = {
  id: string;
  label: string;
  focus: string;
  paletteAccent: string;
};

type SupportedImageMimeType = "image/png" | "image/jpeg" | "image/webp";
export type OutputDestination = "generated-admin" | "public-folder";

type OutputTarget = {
  destination: OutputDestination;
  filesystemDir: string;
  publicBaseUrl: string;
  publicSubfolder: string;
};

const DEFAULT_PUBLIC_SUBFOLDER = "assets/ai-generated";

const PCN_VISUAL_SEED_KNOWLEDGE = [
  "Represent territory, organization, and daily life of Black communities linked to PCN with dignity.",
  "Avoid folklorized, victimizing, extractive, or assistentialist framing.",
  "Territory and regional palenques: rivers, mangroves, collective houses, assemblies, and socioterritorial ties.",
  "Rights and Ley 70: community decision-making, documents, ancestral territory, and legal defense symbols.",
  "Daily life beyond conflict: care networks, fishing, weaving, cooking, children, and collective healing.",
  "Culture and memory: Afro hairstyles, dance, drums, foods, archives, oral memory, and hand-drawn maps.",
  "Organization and alliances: base organizations connected by rivers/roots, with communities as principal voices.",
  "Color direction: reduce excess green and distribute accents across the PCN palette based on scene meaning.",
].join(" ");

const GOBIERNO_INSTRUMENTS: GobiernoInstrumentConfig[] = [
  {
    id: "reglamentos",
    label: "Reglamentos internos",
    focus:
      "collective assembly decisions, normative order, and community governance symbols with warm tones",
    paletteAccent: "#e65100",
  },
  {
    id: "planes-uso",
    label: "Planes de uso y manejo",
    focus:
      "territorial planning with rivers, mapping patterns, and productive and conservation zones",
    paletteAccent: "#1565c0",
  },
  {
    id: "etnodesarrollo",
    label: "Planes de etnodesarrollo",
    focus:
      "community development, cultural continuity, and dignified collective labor in the territory",
    paletteAccent: "#f57f17",
  },
  {
    id: "conservacion",
    label: "Áreas bioculturales de conservación comunitaria",
    focus:
      "biocultural conservation, mangroves, biodiversity care, and spiritual relation with nature",
    paletteAccent: "#2e7d32",
  },
  {
    id: "proteccion-hidrica",
    label: "Protección hídrica",
    focus:
      "river and coastal water protection, watershed guardianship, and aquatic ecosystem defense",
    paletteAccent: "#00838f",
  },
];

export type GenerateVisualContentInput = {
  topicId: VisualTopicId;
  screenId: VisualScreenId;
  assetTypes: VisualAssetType[];
  objective: string;
  additionalContext?: string;
  aspectRatio?: SupportedAspectRatio;
  imageCount?: number;
  videoDurationSeconds?: number;
  outputDestination?: OutputDestination;
  outputSubfolder?: string;
};

type DesignBlock = {
  name: string;
  purpose: string;
  implementationHint: string;
};

type CreativeBrief = {
  visualDirection: string;
  imagePrompt: string;
  videoPrompt: string;
  altText: string;
  headline: string;
  supportingCopy: string;
  ctaLabel: string;
  designBlocks: DesignBlock[];
  productionChecklist: string[];
  rationale: string;
};

export type GeneratedVisualAsset = {
  type: VisualAssetType;
  status: "success" | "error";
  model: string;
  prompt: string;
  fileUrl?: string;
  filename?: string;
  mimeType?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  error?: string;
};

export type GenerateVisualContentResult = {
  requestId: string;
  brief: CreativeBrief;
  topicLabel: string;
  screenLabel: string;
  screenPath: string;
  assets: GeneratedVisualAsset[];
};

export type GenerateVisualSuggestionsInput = {
  topicId: VisualTopicId;
  screenId: VisualScreenId;
  objectiveHint?: string;
  additionalContextHint?: string;
};

type VisualSuggestionPair = {
  objective: string;
  additionalContext: string;
};

export type GenerateVisualSuggestionsResult = {
  objective: string;
  additionalContext: string;
  alternatives: VisualSuggestionPair[];
  rationale: string;
  model: string;
};

const CREATIVE_BRIEF_SCHEMA = {
  type: "object",
  properties: {
    visualDirection: { type: "string" },
    imagePrompt: { type: "string" },
    videoPrompt: { type: "string" },
    altText: { type: "string" },
    headline: { type: "string" },
    supportingCopy: { type: "string" },
    ctaLabel: { type: "string" },
    designBlocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          purpose: { type: "string" },
          implementationHint: { type: "string" },
        },
        required: ["name", "purpose", "implementationHint"],
      },
    },
    productionChecklist: {
      type: "array",
      items: { type: "string" },
    },
    rationale: { type: "string" },
  },
  required: [
    "visualDirection",
    "imagePrompt",
    "videoPrompt",
    "altText",
    "headline",
    "supportingCopy",
    "ctaLabel",
    "designBlocks",
    "productionChecklist",
    "rationale",
  ],
} as const;

const VISUAL_SUGGESTIONS_SCHEMA = {
  type: "object",
  properties: {
    objective: { type: "string" },
    additionalContext: { type: "string" },
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          objective: { type: "string" },
          additionalContext: { type: "string" },
        },
        required: ["objective", "additionalContext"],
      },
    },
    rationale: { type: "string" },
  },
  required: ["objective", "additionalContext", "alternatives", "rationale"],
} as const;

export async function generateVisualContent(
  input: GenerateVisualContentInput,
): Promise<GenerateVisualContentResult> {
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];
  const requestId = createRequestId(input.topicId, input.screenId);
  const brief = await buildCreativeBrief(input);
  const outputTarget = resolveOutputTarget(input);
  const assets: GeneratedVisualAsset[] = [];

  if (input.assetTypes.includes("image")) {
    if (input.screenId === "gobierno-instrumentos") {
      assets.push(await generateGobiernoInstrumentImagesAsset({ input, brief }));
    } else {
      assets.push(await generateImageAsset({ input, brief, requestId, outputTarget }));
    }
  }

  if (input.assetTypes.includes("video")) {
    assets.push(await generateVideoAsset({ input, brief, requestId, outputTarget }));
  }

  if (input.assetTypes.includes("design")) {
    assets.push(await generateDesignAsset({ input, brief, requestId, outputTarget }));
  }

  return {
    requestId,
    brief,
    topicLabel: topic.label,
    screenLabel: screen.label,
    screenPath: screen.pagePath,
    assets,
  };
}

export async function generateVisualSuggestions(
  input: GenerateVisualSuggestionsInput,
): Promise<GenerateVisualSuggestionsResult> {
  const ai = getGeminiClient();
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];
  const objectiveHint = input.objectiveHint?.trim();
  const additionalContextHint = input.additionalContextHint?.trim();

  const prompt = [
    "You are a senior Afroterritorial creative strategist for the PCN Palenke platform.",
    "Return ONLY JSON that matches the requested schema.",
    "",
    "Output language: Spanish (Colombia).",
    "Write concise, practical text that can be pasted into a production form.",
    "",
    "Brand and platform context:",
    `- Colors: ${Object.entries(PALENKE_BRAND_GUIDELINES.colors)
      .map(([name, value]) => `${name}=${value}`)
      .join(", ")}`,
    `- Tone: ${PALENKE_BRAND_GUIDELINES.tone.join(", ")}`,
    `- Hard rules: ${PALENKE_BRAND_GUIDELINES.hardRules.join(" | ")}`,
    `- Topic: ${topic.label}`,
    `- Political context: ${topic.politicalContext}`,
    `- Screen: ${screen.label}`,
    `- Route: ${screen.pagePath}`,
    `- Intent: ${screen.outputIntent}`,
    ...formatScreenAnalysisForPrompt(screen),
    "",
    "Seed knowledge for culturally grounded prompts:",
    PCN_VISUAL_SEED_KNOWLEDGE,
    "",
    "Generate suggestions for these fields:",
    '- objective: one sentence starting with an action verb (e.g., "Crear", "Diseñar", "Mostrar").',
    "- additionalContext: one sentence with visual constraints and anti-stereotype guidance.",
    "- alternatives: 3 additional objective/context pairs with varied visual directions.",
    "",
    "If hints are provided, refine them rather than ignoring them.",
    `- Objective hint: ${objectiveHint || "none"}`,
    `- Additional context hint: ${additionalContextHint || "none"}`,
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: DIRECTOR_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: VISUAL_SUGGESTIONS_SCHEMA,
        temperature: 0.7,
      },
    });

    const parsed = parseJson<GenerateVisualSuggestionsResult>(response.text ?? "");
    if (parsed) {
      return {
        ...parsed,
        alternatives: parsed.alternatives.slice(0, 3),
        model: DIRECTOR_MODEL,
      };
    }
  } catch {
    // Fall back to deterministic suggestions below.
  }

  return createFallbackSuggestions(input);
}

async function buildCreativeBrief(input: GenerateVisualContentInput): Promise<CreativeBrief> {
  const ai = getGeminiClient();
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];
  const prompt = [
    "You are an expert Afroterritorial art director for a production app.",
    "Return ONLY valid JSON matching the schema.",
    "",
    "Brand profile:",
    `- Colors: ${Object.entries(PALENKE_BRAND_GUIDELINES.colors)
      .map(([name, value]) => `${name}=${value}`)
      .join(", ")}`,
    `- Typography display: ${PALENKE_BRAND_GUIDELINES.typography.display}`,
    `- Typography body: ${PALENKE_BRAND_GUIDELINES.typography.body}`,
    `- Tone: ${PALENKE_BRAND_GUIDELINES.tone.join(", ")}`,
    `- Hard rules: ${PALENKE_BRAND_GUIDELINES.hardRules.join(" | ")}`,
    "",
    "Topic context:",
    `- Topic label: ${topic.label}`,
    `- Political context: ${topic.politicalContext}`,
    `- Topic tone: ${topic.tone}`,
    `- Topic keywords: ${topic.visualKeywords.join(", ")}`,
    `- Seed knowledge: ${PCN_VISUAL_SEED_KNOWLEDGE}`,
    "",
    "Screen context:",
    `- Screen label: ${screen.label}`,
    `- Route: ${screen.pagePath}`,
    `- Style direction: ${screen.styleDirection}`,
    `- Composition: ${screen.composition}`,
    `- Output intent: ${screen.outputIntent}`,
    ...formatScreenAnalysisForPrompt(screen),
    "",
    "Generation request:",
    `- Objective: ${input.objective}`,
    `- Additional context: ${input.additionalContext?.trim() || "none"}`,
    `- Aspect ratio: ${input.aspectRatio || screen.recommendedAspectRatio}`,
    "",
    "Output constraints:",
    "- The image and video prompts must be production-ready and specific.",
    "- Keep any copy neutral and respectful.",
    "- Avoid fake logos, avoid overpromising visuals, avoid stereotypes.",
    "- The design blocks must be directly implementable in a web app section.",
    "- Production checklist must include accessibility and QA points.",
  ].join("\n");

  const response = await ai.models.generateContent({
    model: DIRECTOR_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CREATIVE_BRIEF_SCHEMA,
      temperature: 0.6,
    },
  });

  const parsed = parseJson<CreativeBrief>(response.text ?? "");
  if (parsed) {
    return parsed;
  }

  return createFallbackBrief(input);
}

async function generateImageAsset({
  input,
  brief,
  requestId,
  outputTarget,
}: {
  input: GenerateVisualContentInput;
  brief: CreativeBrief;
  requestId: string;
  outputTarget: OutputTarget;
}): Promise<GeneratedVisualAsset> {
  const ai = getGeminiClient();
  const aspectRatio =
    input.aspectRatio || VISUAL_SCREEN_PROFILES[input.screenId].recommendedAspectRatio;

  try {
    const decoded = await generateImageFromModel({
      ai,
      prompt: brief.imagePrompt,
      aspectRatio,
      imageCount: clampImageCount(input.imageCount),
      outputMimeType: "image/png",
    });
    if (!decoded) {
      return {
        type: "image",
        status: "error",
        model: IMAGE_MODEL,
        prompt: brief.imagePrompt,
        error: "The image model returned bytes that are not a valid image payload.",
      };
    }

    const extension = imageExtension(decoded.mimeType);
    const filename = `${requestId}-image${extension}`;
    const filePath = path.join(outputTarget.filesystemDir, filename);
    writeFileAtomic(filePath, decoded.buffer);

    return {
      type: "image",
      status: "success",
      model: IMAGE_MODEL,
      prompt: brief.imagePrompt,
      filename,
      fileUrl: toPublicUrl(outputTarget.publicBaseUrl, filename),
      mimeType: decoded.mimeType,
      notes: "Image generated and ready to use in UI components.",
      metadata: {
        altText: brief.altText,
        aspectRatio,
        storage: {
          destination: outputTarget.destination,
          publicBaseUrl: outputTarget.publicBaseUrl,
          publicSubfolder: outputTarget.publicSubfolder,
        },
      },
    };
  } catch (error) {
    return {
      type: "image",
      status: "error",
      model: IMAGE_MODEL,
      prompt: brief.imagePrompt,
      error: getErrorMessage(error),
    };
  }
}

async function generateGobiernoInstrumentImagesAsset({
  input,
  brief,
}: {
  input: GenerateVisualContentInput;
  brief: CreativeBrief;
}): Promise<GeneratedVisualAsset> {
  const ai = getGeminiClient();
  ensureGobiernoPlaceholderOutputDir();
  const aspectRatio =
    input.aspectRatio || VISUAL_SCREEN_PROFILES[input.screenId].recommendedAspectRatio;
  const cacheBuster = Date.now();
  const generatedFiles: Array<{
    id: string;
    label: string;
    filename: string;
    fileUrl: string;
  }> = [];
  const failures: string[] = [];

  for (const instrument of GOBIERNO_INSTRUMENTS) {
    const prompt = buildGobiernoInstrumentPrompt({
      brief,
      input,
      instrument,
      aspectRatio,
    });

    try {
      const decoded = await generateImageFromModel({
        ai,
        prompt,
        aspectRatio,
        imageCount: 1,
        outputMimeType: "image/png",
      });
      if (!decoded || !["image/png", "image/jpeg", "image/webp"].includes(decoded.mimeType)) {
        failures.push(
          `${instrument.id}: invalid MIME output (${decoded?.mimeType ?? "unknown"})`,
        );
        continue;
      }

      // Always save as .png to match the hardcoded paths in the UI, browsers will still render it correctly based on the file signature
      const filename = `${instrument.id}.png`;
      const filePath = path.join(GOBIERNO_PLACEHOLDER_OUTPUT_DIR, filename);
      writeFileAtomic(filePath, decoded.buffer);
      generatedFiles.push({
        id: instrument.id,
        label: instrument.label,
        filename,
        fileUrl: `/assets/placeholders/${filename}?v=${cacheBuster}`,
      });
    } catch (error) {
      failures.push(`${instrument.id}: ${getErrorMessage(error)}`);
    }
  }

  if (!generatedFiles.length) {
    return {
      type: "image",
      status: "error",
      model: IMAGE_MODEL,
      prompt: brief.imagePrompt,
      error:
        "Automation could not generate valid instrument images. Placeholder files were not updated.",
      metadata: {
        aspectRatio,
        automation: "gobierno-instrumentos",
        failures,
      },
    };
  }

  const partialFailure = failures.length > 0;

  return {
    type: "image",
    status: "success",
    model: IMAGE_MODEL,
    prompt: brief.imagePrompt,
    filename: generatedFiles[0]?.filename,
    fileUrl: generatedFiles[0]?.fileUrl,
    mimeType: "image/png",
    notes: partialFailure
      ? `Automation updated ${generatedFiles.length}/${GOBIERNO_INSTRUMENTS.length} instrument images. Review warnings in metadata.`
      : "Automation updated all Gobierno Propio instrument card images.",
    metadata: {
      aspectRatio,
      automation: "gobierno-instrumentos",
      generatedFiles,
      failures,
      targetRoute: "/gobierno-propio",
      recommendation: "Reload /gobierno-propio to validate card crops and palette balance.",
      storage: {
        destination: "public-folder",
        publicBaseUrl: "/assets/placeholders",
        publicSubfolder: "assets/placeholders",
      },
    },
  };
}

async function generateVideoAsset({
  input,
  brief,
  requestId,
  outputTarget,
}: {
  input: GenerateVisualContentInput;
  brief: CreativeBrief;
  requestId: string;
  outputTarget: OutputTarget;
}): Promise<GeneratedVisualAsset> {
  const ai = getGeminiClient();
  const filename = `${requestId}-video.mp4`;
  const filePath = path.join(outputTarget.filesystemDir, filename);
  const aspectRatio =
    input.aspectRatio || VISUAL_SCREEN_PROFILES[input.screenId].recommendedAspectRatio;

  try {
    let operation = await ai.models.generateVideos({
      model: VIDEO_MODEL,
      prompt: brief.videoPrompt,
      config: {
        numberOfVideos: 1,
        aspectRatio,
        ...(VIDEO_MODEL.startsWith("veo-3.1")
          ? {}
          : { durationSeconds: clampDuration(input.videoDurationSeconds) }),
      },
    });

    while (!operation.done) {
      await sleep(10_000);
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUrl = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUrl) {
      return {
        type: "video",
        status: "error",
        model: VIDEO_MODEL,
        prompt: brief.videoPrompt,
        error: "No video URI was returned by Veo.",
      };
    }

    const response = await fetch(videoUrl, {
      headers: {
        "x-goog-api-key": getGeminiApiKey(),
      },
    });
    if (!response.ok) {
      return {
        type: "video",
        status: "error",
        model: VIDEO_MODEL,
        prompt: brief.videoPrompt,
        error: `Failed to download video: ${response.status} ${response.statusText}`,
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return {
      type: "video",
      status: "success",
      model: VIDEO_MODEL,
      prompt: brief.videoPrompt,
      filename,
      fileUrl: toPublicUrl(outputTarget.publicBaseUrl, filename),
      mimeType: "video/mp4",
      notes: "Video generated and exported as MP4.",
      metadata: {
        aspectRatio,
        storage: {
          destination: outputTarget.destination,
          publicBaseUrl: outputTarget.publicBaseUrl,
          publicSubfolder: outputTarget.publicSubfolder,
        },
      },
    };
  } catch (error) {
    return {
      type: "video",
      status: "error",
      model: VIDEO_MODEL,
      prompt: brief.videoPrompt,
      error: getErrorMessage(error),
    };
  }
}

async function generateDesignAsset({
  input,
  brief,
  requestId,
  outputTarget,
}: {
  input: GenerateVisualContentInput;
  brief: CreativeBrief;
  requestId: string;
  outputTarget: OutputTarget;
}): Promise<GeneratedVisualAsset> {
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];
  const filename = `${requestId}-design.json`;
  const filePath = path.join(outputTarget.filesystemDir, filename);
  const aspectRatio =
    input.aspectRatio || VISUAL_SCREEN_PROFILES[input.screenId].recommendedAspectRatio;

  try {
    const packagePayload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      topic: {
        id: input.topicId,
        label: topic.label,
        context: topic.politicalContext,
      },
      screen: {
        id: input.screenId,
        label: screen.label,
        path: screen.pagePath,
        intent: screen.outputIntent,
        contentAnalysis: screen.contentAnalysis,
      },
      brand: PALENKE_BRAND_GUIDELINES,
      visualDirection: brief.visualDirection,
      copy: {
        headline: brief.headline,
        supporting: brief.supportingCopy,
        cta: brief.ctaLabel,
      },
      prompts: {
        image: brief.imagePrompt,
        video: brief.videoPrompt,
        altText: brief.altText,
      },
      blocks: brief.designBlocks,
      productionChecklist: brief.productionChecklist,
      uiHints: {
        recommendedAspectRatio: aspectRatio,
        recommendedTypography: {
          heading: "font-display",
          body: "font-sans",
        },
        suggestedCssVariables: {
          "--pcn-black": PALENKE_BRAND_GUIDELINES.colors.pcnBlack,
          "--pcn-green": PALENKE_BRAND_GUIDELINES.colors.pcnGreen,
          "--pcn-red": PALENKE_BRAND_GUIDELINES.colors.pcnRed,
          "--pcn-yellow": PALENKE_BRAND_GUIDELINES.colors.pcnYellow,
        },
      },
      rationale: brief.rationale,
    };

    fs.writeFileSync(filePath, JSON.stringify(packagePayload, null, 2));

    return {
      type: "design",
      status: "success",
      model: DIRECTOR_MODEL,
      prompt: `Design package for ${topic.label} on ${screen.label}`,
      filename,
      fileUrl: toPublicUrl(outputTarget.publicBaseUrl, filename),
      mimeType: "application/json",
      notes: "Design JSON package is ready for direct integration in the app.",
      metadata: {
        blocks: brief.designBlocks.length,
        storage: {
          destination: outputTarget.destination,
          publicBaseUrl: outputTarget.publicBaseUrl,
          publicSubfolder: outputTarget.publicSubfolder,
        },
      },
    };
  } catch (error) {
    return {
      type: "design",
      status: "error",
      model: DIRECTOR_MODEL,
      prompt: `Design package for ${topic.label} on ${screen.label}`,
      error: getErrorMessage(error),
    };
  }
}

function createFallbackBrief(input: GenerateVisualContentInput): CreativeBrief {
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];
  const ratio = input.aspectRatio || screen.recommendedAspectRatio;

  return {
    visualDirection: `${topic.tone}; ${screen.styleDirection}.`,
    imagePrompt: [
      `Create a production-ready key visual for ${topic.label}.`,
      `Context: ${topic.politicalContext}.`,
      `Screen intent: ${screen.outputIntent}.`,
      `Composition: ${screen.composition}.`,
      `Aspect ratio: ${ratio}.`,
      "Use PCN palette accents (black, green, red, yellow) with warm neutral base.",
      "No text or logos embedded in the image.",
    ].join(" "),
    videoPrompt: [
      `Create a short atmospheric video for ${topic.label}.`,
      `Context: ${topic.politicalContext}.`,
      `Screen intent: ${screen.outputIntent}.`,
      `Composition: ${screen.composition}.`,
      "Use slow camera motion, natural territorial textures, and institutional tone.",
      "No text overlays or logos.",
    ].join(" "),
    altText: `Visual content for ${topic.label} in ${screen.label}.`,
    headline: topic.label,
    supportingCopy: input.objective,
    ctaLabel: "Explorar",
    designBlocks: [
      {
        name: "Hero",
        purpose: "Main visual entry point for the screen.",
        implementationHint: "Use 16:9 media with text-safe left section and dark gradient overlay.",
      },
    ],
    productionChecklist: [
      "Validate contrast ratios with overlay text.",
      "Verify mobile crop at 9:16 and desktop at 16:9.",
      "Confirm image/video size and performance budget.",
      "Confirm cultural and political framing before publish.",
    ],
    rationale: "Fallback brief generated because model JSON could not be parsed.",
  };
}

function createFallbackSuggestions(
  input: GenerateVisualSuggestionsInput,
): GenerateVisualSuggestionsResult {
  const topic = VISUAL_TOPIC_PROFILES[input.topicId];
  const screen = VISUAL_SCREEN_PROFILES[input.screenId];

  return {
    objective: `Crear una pieza visual para ${screen.label} que exprese ${topic.label} desde la dignidad territorial y el liderazgo comunitario afrodescendiente.`,
    additionalContext:
      "Evitar tono folclórico o asistencialista; incluir señales de organización comunitaria, vida cotidiana y equilibrio de color más allá del verde dominante.",
    alternatives: [
      {
        objective:
          "Diseñar una escena editorial del Pacífico con ríos y espacios de asamblea para comunicar autonomía y gobierno propio.",
        additionalContext:
          "Priorizar composición clara para cards, sin texto incrustado, y con acentos naranja/azul/amarillo según el instrumento.",
      },
      {
        objective:
          "Mostrar redes territoriales de consejos comunitarios como una trama viva de memoria, derechos y cuidado colectivo.",
        additionalContext:
          "Incluir mapas, archivos comunitarios y objetos de trabajo local; evitar estéticas de victimización o exotización.",
      },
      {
        objective:
          "Representar vida cotidiana y defensa del territorio como prácticas simultáneas de organización política y cultural.",
        additionalContext:
          "Mantener enfoque respetuoso en liderazgo de mujeres, juventudes y sabedores; no usar símbolos estereotipados.",
      },
    ],
    rationale: `Fallback local for ${topic.label} on ${screen.label} when AI JSON is unavailable.`,
    model: DIRECTOR_MODEL,
  };
}

function formatScreenAnalysisForPrompt(screen: VisualScreenProfile) {
  const lines = ["- Screen content analysis:"];
  lines.push(`  - Source files: ${screen.contentAnalysis.sourceFiles.join(", ")}`);
  for (const section of screen.contentAnalysis.sections) {
    lines.push(
      `  - ${section.title}: purpose=${section.purpose}; components=${section.components.join(", ")}; visualTargets=${section.visualTargets.join(", ")}`,
    );
  }
  return lines;
}

function ensureGobiernoPlaceholderOutputDir() {
  if (!fs.existsSync(GOBIERNO_PLACEHOLDER_OUTPUT_DIR)) {
    fs.mkdirSync(GOBIERNO_PLACEHOLDER_OUTPUT_DIR, { recursive: true });
  }
}

function parseJson<T>(raw: string): T | null {
  const normalized = raw.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  if (!normalized) {
    return null;
  }

  try {
    return JSON.parse(normalized) as T;
  } catch {
    return null;
  }
}

function createRequestId(topicId: VisualTopicId, screenId: VisualScreenId) {
  const timestamp = Date.now();
  return `${slugify(topicId)}-${slugify(screenId)}-${timestamp}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function clampImageCount(value: number | undefined) {
  if (!value) {
    return DEFAULT_IMAGE_COUNT;
  }
  return Math.min(4, Math.max(1, Math.round(value)));
}

function clampDuration(value: number | undefined) {
  if (!value) {
    return DEFAULT_VIDEO_DURATION_SECONDS;
  }
  return Math.min(12, Math.max(4, Math.round(value)));
}

function toPublicUrl(basePath: string, filename: string) {
  return `${basePath}/${filename}`;
}

function resolveOutputTarget(input: GenerateVisualContentInput): OutputTarget {
  if (input.outputDestination === "public-folder") {
    const publicSubfolder = sanitizePublicSubfolder(input.outputSubfolder);
    const filesystemDir = path.join(process.cwd(), "public", ...publicSubfolder.split("/"));
    ensureOutputDir(filesystemDir);
    return {
      destination: "public-folder",
      filesystemDir,
      publicBaseUrl: `/${publicSubfolder}`,
      publicSubfolder,
    };
  }

  const publicSubfolder = "generated/admin";
  const filesystemDir = path.join(process.cwd(), "public", "generated", "admin");
  ensureOutputDir(filesystemDir);
  return {
    destination: "generated-admin",
    filesystemDir,
    publicBaseUrl: "/generated/admin",
    publicSubfolder,
  };
}

function sanitizePublicSubfolder(value?: string) {
  const rawValue = (value ?? DEFAULT_PUBLIC_SUBFOLDER).replace(/\\/g, "/").trim();
  const normalized = rawValue.replace(/^\/+|\/+$/g, "");
  const safeSegments = normalized
    .split("/")
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, ""))
    .filter((segment) => segment.length > 0 && segment !== "." && segment !== "..");
  const safePath = safeSegments.join("/");
  return safePath || DEFAULT_PUBLIC_SUBFOLDER;
}

function ensureOutputDir(outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

async function generateImageFromModel({
  ai,
  prompt,
  aspectRatio,
  imageCount,
  outputMimeType,
}: {
  ai: ReturnType<typeof getGeminiClient>;
  prompt: string;
  aspectRatio: SupportedAspectRatio;
  imageCount: number;
  outputMimeType: SupportedImageMimeType;
}) {
  if (isGeminiNativeImageModel(IMAGE_MODEL)) {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: `${prompt}\nAspect ratio: ${aspectRatio}.`,
    });
    const inlineImage = extractInlineImageBytes(response);
    return decodeGeneratedImageBytes(inlineImage);
  }

  const response = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt,
    config: {
      numberOfImages: imageCount,
      outputMimeType,
      aspectRatio,
      includeRaiReason: true,
    },
  });

  const bytes = response.generatedImages?.[0]?.image?.imageBytes;
  return decodeGeneratedImageBytes(bytes);
}

function isGeminiNativeImageModel(model: string) {
  return model.includes("flash-image") || model.includes("pro-image");
}

function extractInlineImageBytes(response: unknown) {
  const candidates = (response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string };
        }>;
      };
    }>;
  }).candidates;

  for (const candidate of candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      const data = part.inlineData?.data;
      if (data) {
        return data;
      }
    }
  }

  return null;
}

function buildGobiernoInstrumentPrompt({
  brief,
  input,
  instrument,
  aspectRatio,
}: {
  brief: CreativeBrief;
  input: GenerateVisualContentInput;
  instrument: GobiernoInstrumentConfig;
  aspectRatio: SupportedAspectRatio;
}) {
  const additionalContext = input.additionalContext?.trim();

  return [
    `Create one production-ready image for "${instrument.label}" in the Gobierno Propio module.`,
    `Primary focus: ${instrument.focus}.`,
    `Visual direction: ${brief.visualDirection}.`,
    `Main objective: ${input.objective}.`,
    additionalContext ? `Additional context: ${additionalContext}.` : "",
    `Use a strong color accent around ${instrument.paletteAccent}; avoid overusing green.`,
    "Style: dignified, editorial, territorial, and institutional.",
    "Do not include text, logos, watermarks, or stereotyped representation.",
    "Image will be used as a dashboard card cover.",
    `Aspect ratio: ${aspectRatio}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function decodeGeneratedImageBytes(bytes: string | null | undefined) {
  if (!bytes) {
    return null;
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(bytes, "base64");
  } catch {
    return null;
  }

  if (!buffer.length) {
    return null;
  }

  const mimeType = detectImageMimeType(buffer);
  if (!mimeType) {
    return null;
  }

  return { buffer, mimeType };
}

function detectImageMimeType(buffer: Buffer): SupportedImageMimeType | null {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function imageExtension(mimeType: SupportedImageMimeType) {
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  return ".png";
}

function writeFileAtomic(filePath: string, buffer: Buffer) {
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, buffer);
  fs.renameSync(tempPath, filePath);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error.";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
