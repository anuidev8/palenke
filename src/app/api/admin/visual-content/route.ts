import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/admin-access";
import {
  generateVisualContent,
  type GenerateVisualContentInput,
  type OutputDestination,
} from "@/lib/visual-content/generator";
import {
  type SupportedAspectRatio,
  type VisualAssetType,
  type VisualScreenId,
  type VisualTopicId,
  VISUAL_SCREEN_PROFILES,
  VISUAL_TOPIC_PROFILES,
} from "@/lib/visual-content/profiles";

export const runtime = "nodejs";
export const maxDuration = 300;

const SUPPORTED_ASPECT_RATIOS: SupportedAspectRatio[] = ["1:1", "4:5", "16:9", "9:16"];
const SUPPORTED_ASSET_TYPES: VisualAssetType[] = ["image", "video", "design"];
const SUPPORTED_OUTPUT_DESTINATIONS: OutputDestination[] = [
  "generated-admin",
  "public-folder",
];

export async function POST(request: NextRequest) {
  try {
    const deniedResponse = await requireAdminApiRequest();
    if (deniedResponse) {
      return deniedResponse;
    }

    const body = await request.json();
    const payload = parsePayload(body);
    if (!payload.ok) {
      return NextResponse.json({ error: payload.error }, { status: 400 });
    }

    const result = await generateVisualContent(payload.value);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected generation error.",
      },
      { status: 500 },
    );
  }
}

function parsePayload(raw: unknown):
  | { ok: true; value: GenerateVisualContentInput }
  | { ok: false; error: string } {
  const input = raw as Record<string, unknown>;
  const topicId = String(input.topicId ?? "");
  const screenId = String(input.screenId ?? "");
  const objective = String(input.objective ?? "").trim();
  const additionalContext = String(input.additionalContext ?? "").trim();
  const imageCountRaw = Number(input.imageCount ?? 1);
  const videoDurationRaw = Number(input.videoDurationSeconds ?? 8);
  const aspectRatioRaw = String(input.aspectRatio ?? "");
  const outputDestinationRaw = String(input.outputDestination ?? "generated-admin");
  const outputSubfolderRaw = String(input.outputSubfolder ?? "");
  const assetTypesRaw = Array.isArray(input.assetTypes) ? input.assetTypes : [];

  if (!isTopicId(topicId)) {
    return { ok: false, error: "Invalid topic." };
  }

  if (!isScreenId(screenId)) {
    return { ok: false, error: "Invalid screen/page selection." };
  }

  if (!objective) {
    return { ok: false, error: "Objective is required." };
  }

  const assetTypes = assetTypesRaw
    .map((value) => String(value))
    .filter((value): value is VisualAssetType =>
      SUPPORTED_ASSET_TYPES.includes(value as VisualAssetType),
    );

  if (!assetTypes.length) {
    return { ok: false, error: "Select at least one asset type." };
  }

  const aspectRatio = SUPPORTED_ASPECT_RATIOS.includes(aspectRatioRaw as SupportedAspectRatio)
    ? (aspectRatioRaw as SupportedAspectRatio)
    : VISUAL_SCREEN_PROFILES[screenId].recommendedAspectRatio;
  const outputDestination = SUPPORTED_OUTPUT_DESTINATIONS.includes(
    outputDestinationRaw as OutputDestination,
  )
    ? (outputDestinationRaw as OutputDestination)
    : "generated-admin";

  return {
    ok: true,
    value: {
      topicId,
      screenId,
      objective,
      additionalContext,
      assetTypes: Array.from(new Set(assetTypes)),
      aspectRatio,
      imageCount: Number.isFinite(imageCountRaw) ? imageCountRaw : 1,
      videoDurationSeconds: Number.isFinite(videoDurationRaw) ? videoDurationRaw : 8,
      outputDestination,
      outputSubfolder: outputSubfolderRaw.trim(),
    },
  };
}

function isTopicId(value: string): value is VisualTopicId {
  return Object.prototype.hasOwnProperty.call(VISUAL_TOPIC_PROFILES, value);
}

function isScreenId(value: string): value is VisualScreenId {
  return Object.prototype.hasOwnProperty.call(VISUAL_SCREEN_PROFILES, value);
}
