import { NextRequest, NextResponse } from "next/server";
import { requireVisualContentAdminApiRequest } from "@/lib/admin-access";
import { generateVisualSuggestions } from "@/lib/visual-content/generator";
import {
  type VisualScreenId,
  type VisualTopicId,
  VISUAL_SCREEN_PROFILES,
  VISUAL_TOPIC_PROFILES,
} from "@/lib/visual-content/profiles";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const deniedResponse = await requireVisualContentAdminApiRequest();
    if (deniedResponse) {
      return deniedResponse;
    }

    const body = await request.json();
    const topicId = String(body?.topicId ?? "");
    const screenId = String(body?.screenId ?? "");
    const objectiveHint = String(body?.objectiveHint ?? "").trim();
    const additionalContextHint = String(body?.additionalContextHint ?? "").trim();

    if (!isTopicId(topicId)) {
      return NextResponse.json({ error: "Invalid topic." }, { status: 400 });
    }

    if (!isScreenId(screenId)) {
      return NextResponse.json({ error: "Invalid screen/page selection." }, { status: 400 });
    }

    const suggestions = await generateVisualSuggestions({
      topicId,
      screenId,
      objectiveHint: objectiveHint || undefined,
      additionalContextHint: additionalContextHint || undefined,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected suggestion error.",
      },
      { status: 500 },
    );
  }
}

function isTopicId(value: string): value is VisualTopicId {
  return Object.prototype.hasOwnProperty.call(VISUAL_TOPIC_PROFILES, value);
}

function isScreenId(value: string): value is VisualScreenId {
  return Object.prototype.hasOwnProperty.call(VISUAL_SCREEN_PROFILES, value);
}
