"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";

type TopicOption = {
  id: string;
  label: string;
  tone: string;
};

type ScreenOption = {
  id: string;
  label: string;
  pagePath: string;
  topicIds: string[];
  recommendedAspectRatio: string;
  recommendedAssetTypes: string[];
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

type AssetResult = {
  type: "image" | "video" | "design";
  status: "success" | "error";
  model: string;
  prompt: string;
  fileUrl?: string;
  filename?: string;
  mimeType?: string;
  notes?: string;
  error?: string;
  metadata?: Record<string, unknown>;
};

type AutomatedImageFile = {
  id: string;
  label: string;
  filename: string;
  fileUrl: string;
};

type PromptSuggestion = {
  objective: string;
  additionalContext: string;
};

type OutputDestination = "generated-admin" | "public-folder";

type GenerationResponse = {
  requestId: string;
  brief: {
    visualDirection: string;
    imagePrompt: string;
    videoPrompt: string;
    altText: string;
    headline: string;
    supportingCopy: string;
    ctaLabel: string;
    designBlocks: Array<{
      name: string;
      purpose: string;
      implementationHint: string;
    }>;
    productionChecklist: string[];
    rationale: string;
  };
  topicLabel: string;
  screenLabel: string;
  screenPath: string;
  assets: AssetResult[];
};

type SuggestionsResponse = {
  objective: string;
  additionalContext: string;
  alternatives: PromptSuggestion[];
  rationale: string;
  model: string;
};

function readAutomatedImageFiles(metadata: Record<string, unknown> | undefined): AutomatedImageFile[] {
  const rawFiles = metadata?.generatedFiles;
  if (!Array.isArray(rawFiles)) {
    return [];
  }

  const files = rawFiles
    .map((item): AutomatedImageFile | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const label = typeof record.label === "string" ? record.label : "";
      const filename = typeof record.filename === "string" ? record.filename : "";
      const fileUrl = typeof record.fileUrl === "string" ? record.fileUrl : "";

      if (!id || !label || !filename || !fileUrl) {
        return null;
      }

      return { id, label, filename, fileUrl };
    })
    .filter((file): file is AutomatedImageFile => file !== null);

  return files;
}

function readAutomationFailures(metadata: Record<string, unknown> | undefined): string[] {
  const rawFailures = metadata?.failures;
  if (!Array.isArray(rawFailures)) {
    return [];
  }

  return rawFailures.filter((value): value is string => typeof value === "string");
}

function readStorageInfo(metadata: Record<string, unknown> | undefined) {
  const storage = metadata?.storage;
  if (!storage || typeof storage !== "object") {
    return null;
  }

  const record = storage as Record<string, unknown>;
  const publicSubfolder =
    typeof record.publicSubfolder === "string" ? record.publicSubfolder : null;
  const destination = typeof record.destination === "string" ? record.destination : null;

  if (!publicSubfolder || !destination) {
    return null;
  }

  return {
    destination,
    publicSubfolder,
  };
}

export function AdminVisualContentGenerator({
  topics,
  screens,
}: {
  topics: TopicOption[];
  screens: ScreenOption[];
}) {
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [screenId, setScreenId] = useState(screens[0]?.id ?? "");
  const [aspectRatio, setAspectRatio] = useState(screens[0]?.recommendedAspectRatio ?? "16:9");
  const [objective, setObjective] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [imageCount, setImageCount] = useState(1);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(8);
  const [outputDestination, setOutputDestination] = useState<OutputDestination>("generated-admin");
  const [outputSubfolder, setOutputSubfolder] = useState("assets/ai-generated");
  const [assetTypes, setAssetTypes] = useState<Array<"image" | "video" | "design">>([
    "image",
    "video",
    "design",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);

  const filteredScreens = useMemo(() => {
    const scoped = screens.filter((screen) => screen.topicIds.includes(topicId));
    return scoped.length > 0 ? scoped : screens;
  }, [screens, topicId]);

  const currentTopic = useMemo(
    () => topics.find((option) => option.id === topicId) ?? topics[0],
    [topicId, topics],
  );

  const currentScreen = useMemo(
    () => filteredScreens.find((option) => option.id === screenId) ?? filteredScreens[0] ?? screens[0],
    [screenId, filteredScreens, screens],
  );

  const toggleAssetType = (type: "image" | "video" | "design") => {
    setAssetTypes((previous) => {
      if (previous.includes(type)) {
        return previous.filter((value) => value !== type);
      }

      return [...previous, type];
    });
  };

  const onTopicChange = (nextTopicId: string) => {
    setTopicId(nextTopicId);
    const scopedScreens = screens.filter((item) => item.topicIds.includes(nextTopicId));
    const nextScreen =
      scopedScreens.find((item) => item.id === screenId) ?? scopedScreens[0] ?? screens[0];
    if (nextScreen) {
      setScreenId(nextScreen.id);
      setAspectRatio(nextScreen.recommendedAspectRatio);
    }
  };

  const onScreenChange = (nextScreenId: string) => {
    const nextScreen = filteredScreens.find((item) => item.id === nextScreenId);
    setScreenId(nextScreenId);
    if (nextScreen) {
      setAspectRatio(nextScreen.recommendedAspectRatio);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCopiedPrompt(null);

    if (!assetTypes.length) {
      setError("Select at least one asset type.");
      return;
    }

    if (!objective.trim()) {
      setError("Objective is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/visual-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          screenId,
          assetTypes,
          objective,
          additionalContext,
          aspectRatio,
          imageCount,
          videoDurationSeconds,
          outputDestination,
          outputSubfolder,
        }),
      });

      const payload = (await response.json()) as GenerationResponse | { error?: string };
      if (!response.ok) {
        if ("error" in payload) {
          setError(payload.error ?? "Generation failed.");
        } else {
          setError("Generation failed.");
        }
        return;
      }

      setResult(payload as GenerationResponse);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected request error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPrompt = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedPrompt(key);
      setTimeout(() => setCopiedPrompt(null), 1800);
    } catch {
      setCopiedPrompt(null);
    }
  };

  const applySuggestion = (suggestion: PromptSuggestion) => {
    setObjective(suggestion.objective);
    setAdditionalContext(suggestion.additionalContext);
  };

  const suggestPrompts = async () => {
    setError(null);
    setIsSuggesting(true);
    try {
      const response = await fetch("/api/admin/visual-content/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          screenId,
          objectiveHint: objective,
          additionalContextHint: additionalContext,
        }),
      });

      const payload = (await response.json()) as SuggestionsResponse | { error?: string };
      if (!response.ok) {
        setError("error" in payload ? payload.error ?? "Suggestion failed." : "Suggestion failed.");
        return;
      }

      const suggestionPayload = payload as SuggestionsResponse;
      setObjective(suggestionPayload.objective);
      setAdditionalContext(suggestionPayload.additionalContext);
      setSuggestions(suggestionPayload.alternatives);
    } catch (suggestionError) {
      setError(
        suggestionError instanceof Error
          ? suggestionError.message
          : "Unexpected suggestion request error.",
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="surface-card space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">Topic</span>
            <select
              value={topicId}
              onChange={(event) => onTopicChange(event.target.value)}
              className="input-shell"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">Page / Screen</span>
            <select
              value={screenId}
              onChange={(event) => onScreenChange(event.target.value)}
              className="input-shell"
            >
              {filteredScreens.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {currentScreen ? (
          <div className="rounded-[20px] border border-[color:var(--border-soft)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Screen analysis
                </p>
                <h3 className="mt-1 font-display text-2xl text-[color:var(--forest)]">
                  {currentScreen.label}
                </h3>
                <p className="text-sm text-[color:var(--muted-strong)]">
                  Route: <span className="font-medium">{currentScreen.pagePath}</span>
                </p>
                <p className="text-xs text-[color:var(--muted)]">
                  Topic context: {currentTopic?.label ?? "N/A"} · {currentTopic?.tone ?? ""}
                </p>
              </div>
              <div className="rounded-[12px] border border-[color:var(--border-soft)] bg-[color:var(--sand-strong)] px-3 py-2 text-xs text-[color:var(--muted)]">
                <p>{currentScreen.contentAnalysis.sections.length} sections mapped</p>
                <p>{currentScreen.contentAnalysis.sourceFiles.length} source files</p>
              </div>
            </div>

            <div className="mt-3 rounded-[14px] border border-[color:var(--border-soft)] bg-[color:var(--sand-strong)] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
                Source files
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted-strong)]">
                {currentScreen.contentAnalysis.sourceFiles.join(" · ")}
              </p>
            </div>

            <div className="mt-3 grid gap-3">
              {currentScreen.contentAnalysis.sections.map((section) => (
                <article
                  key={section.id}
                  className="rounded-[14px] border border-[color:var(--border-soft)] px-3 py-3"
                >
                  <p className="text-sm font-semibold text-[color:var(--forest)]">{section.title}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">{section.purpose}</p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    Components: {section.components.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    Visual targets: {section.visualTargets.join(", ")}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">Aspect ratio</span>
            <select
              value={aspectRatio}
              onChange={(event) => setAspectRatio(event.target.value)}
              className="input-shell"
            >
              {["1:1", "4:5", "16:9", "9:16"].map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">Images</span>
            <input
              type="number"
              min={1}
              max={4}
              value={imageCount}
              onChange={(event) => setImageCount(Number(event.target.value))}
              className="input-shell"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[color:var(--forest)]">Video seconds</span>
            <input
              type="number"
              min={4}
              max={12}
              value={videoDurationSeconds}
              onChange={(event) => setVideoDurationSeconds(Number(event.target.value))}
              className="input-shell"
            />
          </label>
        </div>

        {/* Output destination config removed - always using defaults */}

        <label className="grid gap-2">
          <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[color:var(--forest)]">
            <span>Objective *</span>
            <button
              type="button"
              onClick={suggestPrompts}
              disabled={isSuggesting}
              className="button-secondary !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSuggesting ? "Generating..." : "AI suggest"}
            </button>
          </span>
          <textarea
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            rows={3}
            className="textarea-shell"
            placeholder="Example: Hero visual for Memoria Afroterritorial focused on juridical memory and ancestral knowledge."
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[color:var(--forest)]">Additional context (optional)</span>
          <textarea
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
            rows={2}
            className="textarea-shell"
            placeholder="Example: Prioritize mangrove + river symbols, avoid human faces."
          />
        </label>

        {suggestions.length ? (
          <div className="rounded-[16px] border border-[color:var(--border-soft)] bg-white p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
              Alternate AI suggestions
            </p>
            <div className="mt-2 grid gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.objective}-${index}`}
                  type="button"
                  onClick={() => applySuggestion(suggestion)}
                  className="rounded-[12px] border border-[color:var(--border-soft)] px-3 py-2 text-left text-sm text-[color:var(--muted-strong)] hover:bg-[color:var(--sand-strong)]"
                >
                  <p className="font-semibold text-[color:var(--forest)]">Option {index + 1}</p>
                  <p>{suggestion.objective}</p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">{suggestion.additionalContext}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[20px] border border-[color:var(--border-soft)] bg-[color:var(--sand-strong)] p-4">
          <p className="text-sm font-semibold text-[color:var(--forest)]">Asset types</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {(["image", "video", "design"] as const).map((type) => {
              const checked = assetTypes.includes(type);
              return (
                <label
                  key={type}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                    checked
                      ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--sand)]"
                      : "border-[color:var(--border-strong)] bg-white text-[color:var(--forest)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAssetType(type)}
                    className="sr-only"
                  />
                  <span>
                    {type === "image" ? "Image" : type === "video" ? "Video" : "Design asset"}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            Recommended for this screen: {currentScreen?.recommendedAssetTypes.join(", ") ?? "image"}.
          </p>
          {screenId === "gobierno-instrumentos" ? (
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              Automation mode: image generation updates all five Gobierno Propio instrument covers.
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="callout callout-danger">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--danger)]">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>{error}</span>
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="button-primary disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Generating...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Generate visual content</span>
              </span>
            )}
          </button>
          <p className="text-xs text-[color:var(--muted)]">
            Gemini 3.1 Pro drives direction. Nano Banana 2 and Veo 3.1 generate media.
          </p>
        </div>
      </form>

      {result ? (
        <section className="space-y-6">
          <article className="surface-card space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Request {result.requestId}
            </p>
            <h2 className="font-display text-3xl text-[color:var(--forest)]">
              {result.topicLabel} · {result.screenLabel}
            </h2>
            <p className="text-sm text-[color:var(--muted-strong)]">Target route: {result.screenPath}</p>
            <p className="text-sm leading-7 text-[color:var(--muted-strong)]">{result.brief.visualDirection}</p>
            <div className="rounded-[20px] border border-[color:var(--border-soft)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Suggested copy</p>
              <p className="mt-2 font-display text-2xl text-[color:var(--forest)]">{result.brief.headline}</p>
              <p className="mt-2 text-sm text-[color:var(--muted-strong)]">{result.brief.supportingCopy}</p>
              <p className="mt-3 inline-flex rounded-full bg-[color:var(--sand-strong)] px-3 py-1 text-xs font-semibold text-[color:var(--forest)]">
                CTA: {result.brief.ctaLabel}
              </p>
            </div>
          </article>

          <div className="grid gap-5">
            {result.assets.map((asset) => {
              const generatedFiles = readAutomatedImageFiles(asset.metadata);
              const automationFailures = readAutomationFailures(asset.metadata);
              const storageInfo = readStorageInfo(asset.metadata);

              return (
              <article key={`${asset.type}-${asset.filename ?? asset.model}`} className="surface-card space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      {asset.type} · {asset.model}
                    </p>
                    <p className="text-sm text-[color:var(--muted-strong)]">
                      {asset.status === "success" ? asset.notes : asset.error}
                    </p>
                  </div>
                  {asset.status === "success" ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Error</span>
                    </span>
                  )}
                </div>

                {/* Storage info label removed as saving is just a temp mechanism for rendering/downloading */}

                {asset.status === "success" && asset.type === "image" && asset.fileUrl ? (
                  <Image
                    src={asset.fileUrl}
                    alt={result.brief.altText}
                    width={1600}
                    height={900}
                    unoptimized
                    className="w-full rounded-[18px] border border-[color:var(--border-soft)] object-cover"
                  />
                ) : null}

                {asset.status === "success" && generatedFiles.length > 0 ? (
                  <div className="rounded-[18px] border border-[color:var(--border-soft)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      Automated files
                    </p>
                    <div className="mt-2 grid gap-2 text-sm text-[color:var(--muted-strong)]">
                      {generatedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="inline-flex items-center justify-between rounded-[12px] border border-[color:var(--border-soft)] px-3 py-2"
                        >
                          <div>
                            <span>{file.label}</span>
                            <p className="text-xs text-[color:var(--muted)]">{file.filename}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="button-secondary !px-2.5 !py-1 text-xs"
                            >
                              Open
                            </a>
                            <a
                              href={file.fileUrl}
                              download={file.filename}
                              className="button-secondary !px-2.5 !py-1 text-xs"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {automationFailures.length > 0 ? (
                  <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-semibold">Automation warnings</p>
                    <ul className="mt-1 space-y-1">
                      {automationFailures.map((failure) => (
                        <li key={failure}>• {failure}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {asset.status === "success" && asset.type === "video" && asset.fileUrl ? (
                  <video
                    src={asset.fileUrl}
                    controls
                    className="w-full rounded-[18px] border border-[color:var(--border-soft)]"
                  />
                ) : null}

                {asset.status === "success" && asset.type === "design" && asset.fileUrl ? (
                  <div className="rounded-[18px] border border-[color:var(--border-soft)] bg-[color:var(--sand-strong)] p-4 text-sm text-[color:var(--muted-strong)]">
                    JSON package includes copy, prompts, style tokens, and implementation blocks.
                  </div>
                ) : null}

                <div className="grid gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Prompt used
                  </p>
                  <p className="rounded-[16px] border border-[color:var(--border-soft)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--muted-strong)]">
                    {asset.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyPrompt(asset.prompt, `${asset.type}-prompt`)}
                      className="button-secondary"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {copiedPrompt === `${asset.type}-prompt` ? "Prompt copied" : "Copy prompt"}
                      </span>
                    </button>
                    {asset.fileUrl ? (
                      <>
                        <a
                          href={asset.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button-secondary"
                        >
                          Open file
                        </a>
                        <a
                          href={asset.fileUrl}
                          download={asset.filename ?? ""}
                          className="button-secondary"
                        >
                          Download file
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            );
            })}
          </div>

          <article className="surface-card space-y-3">
            <h3 className="font-display text-2xl text-[color:var(--forest)]">Design blocks</h3>
            <div className="grid gap-3">
              {result.brief.designBlocks.map((block) => (
                <div key={`${block.name}-${block.purpose}`} className="rounded-[16px] border border-[color:var(--border-soft)] bg-white p-4">
                  <p className="text-sm font-semibold text-[color:var(--forest)]">{block.name}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-strong)]">{block.purpose}</p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">{block.implementationHint}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[16px] border border-[color:var(--border-soft)] bg-[color:var(--sand-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">Production checklist</p>
              <ul className="mt-2 space-y-1 text-sm text-[color:var(--muted-strong)]">
                {result.brief.productionChecklist.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}
