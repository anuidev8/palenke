"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Download, Lock, ExternalLink, Folder } from "lucide-react";
import { type ViewerRole, canDownloadDocument } from "@/lib/mock-data";

export type DocumentVisibility = "public" | "internal" | "sensitive";

export type DisplayDoc = {
  id: string;
  title: string;
  section: string;
  type: string;
  territory: string;
  year: string;
  visibility: DocumentVisibility;
  action: "file" | "external" | "video";
  fileLabel: string;
  url: string;
  sourceUrl?: string;
  usesSignedUrl: boolean;
  storagePath?: string | null;
};

type TreeNode = {
  name: string;
  path: string;
  type: "folder" | "file";
  children: TreeNode[];
  doc?: DisplayDoc;
};

function buildTree(docs: DisplayDoc[]): TreeNode[] {
  const root: TreeNode = { name: "root", path: "", type: "folder", children: [] };

  docs.forEach((doc) => {
    // Determine the path to use
    let pathStr = doc.storagePath;
    if (!pathStr) {
      // Fallback if no storage path: Territory -> File
      pathStr = `${doc.territory}/${doc.title}`;
    } else {
      // Remove instrument prefix if present (e.g. "reglamentos/cc-foo/file.pdf" -> "cc-foo/file.pdf")
      const parts = pathStr.split("/");
      if (parts.length > 2) {
        // e.g. reglamentos / cc-foo / file.pdf
        // We drop the first part (instrument) to make the council the top level folder
        pathStr = parts.slice(1).join("/");
      }
    }

    const segments = pathStr.split("/").filter(Boolean);
    let currentNode = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isFile = i === segments.length - 1;

      let child = currentNode.children.find((c) => c.name === segment);
      if (!child) {
        child = {
          name: segment,
          path: segments.slice(0, i + 1).join("/"),
          type: isFile ? "file" : "folder",
          children: [],
        };
        if (isFile) {
          child.doc = doc;
          // Format filename
          child.name = doc.title; 
        }
        currentNode.children.push(child);
      } else if (isFile && child.type === "file") {
        // If there's a name collision, we just replace or skip.
        // We'll replace it.
        child.doc = doc;
        child.name = doc.title;
      }
      currentNode = child;
    }
  });

  // Sort: folders first, then files. Alphabetical within each type.
  const sortTree = (node: TreeNode) => {
    node.children.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    });
    node.children.forEach(sortTree);
  };
  sortTree(root);

  return root.children;
}

function FolderNode({ node, color, role, level = 0 }: { node: TreeNode; color: string; role: ViewerRole; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open top level
  useState(() => {
    if (level === 0) setIsOpen(true);
  });

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col select-none">
      <div
        className="flex items-center gap-3 py-3 px-4 hover:bg-[#fcfaf7] cursor-pointer rounded-lg transition-colors border-l-2 border-transparent"
        style={{ paddingLeft: `${(level + 1) * 16}px` }}
        onClick={toggle}
      >
        <button className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-[#e8dfd3] transition-colors" style={{ color }}>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <Folder className="w-5 h-5" style={{ fill: color, color }} />
        <span className="font-bold text-[#1a1a1a] text-base">{node.name.replace(/-/g, " ").toUpperCase()}</span>
      </div>

      {isOpen && (
        <div className="flex flex-col">
          {node.children.map((child, idx) => (
            child.type === "folder" ? (
              <FolderNode key={`${child.path}-${idx}`} node={child} color={color} role={role} level={level + 1} />
            ) : (
              <FileNode key={`${child.path}-${idx}`} node={child} color={color} role={role} level={level + 1} />
            )
          ))}
        </div>
      )}
    </div>
  );
}

function FileNode({ node, color, role, level = 0 }: { node: TreeNode; color: string; role: ViewerRole; level?: number }) {
  const doc = node.doc!;
  const hasAccess = canDownloadDocument(role, doc.visibility);
  
  const handleDownload = (e: React.MouseEvent) => {
    if (!doc.usesSignedUrl) {
      // Let it act as a normal link with download attr
      return;
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 pr-6 hover:bg-[#fcfaf7] transition-colors border-t border-[#e8dfd3]/50 group"
      style={{ paddingLeft: `${(level + 1) * 16 + 36}px` }}
    >
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 mt-0.5 shrink-0 text-[#7a756e] group-hover:text-[#4a4540] transition-colors" />
        <div>
          <p className="font-medium text-[#1a1a1a] text-base group-hover:text-black transition-colors">{doc.title}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#7a756e]">
            <span className="font-medium uppercase tracking-wider">{doc.territory}</span>
            <span>•</span>
            <span>{doc.year}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center sm:ml-auto">
        {!hasAccess ? (
          <a
            href="/login?redirect=/gobierno-propio&message=internal"
            className="inline-flex w-max items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-4 py-2 text-xs font-bold text-[#7a756e] transition hover:bg-[#f8f5f2]"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Iniciar sesión
          </a>
        ) : (
          <>
            {doc.action === "file" ? (
              <a
                href={doc.url}
                onClick={handleDownload}
                {...(doc.usesSignedUrl ? {} : { download: true })}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-black shadow-sm hover:shadow-md"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Descargar
              </a>
            ) : null}
            {doc.sourceUrl ? (
              <a
                href={doc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-5 py-2.5 text-xs font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Fuente oficial
              </a>
            ) : doc.action === "external" ? (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-5 py-2.5 text-xs font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                {doc.fileLabel}
              </a>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export function DocumentTree({ docs, role, color }: { docs: DisplayDoc[]; role: ViewerRole; color: string }) {
  const tree = buildTree(docs);

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-[#e8dfd3] border-dashed">
        <Folder className="w-12 h-12 text-[#d1ccc5] mb-4" />
        <p className="text-[#7a756e] font-medium text-center">No hay documentos internos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-[24px] border border-[#e8dfd3] shadow-lg overflow-hidden pb-4">
      {/* Subtle modern gradient overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-32 opacity-10 pointer-events-none mix-blend-multiply" 
        style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
      />
      <div className="relative z-10 pt-2">
        {tree.map((node, idx) => (
          node.type === "folder" ? (
            <FolderNode key={`${node.path}-${idx}`} node={node} color={color} role={role} />
          ) : (
            <FileNode key={`${node.path}-${idx}`} node={node} color={color} role={role} />
          )
        ))}
      </div>
    </div>
  );
}
