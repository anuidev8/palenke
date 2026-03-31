"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  FileText, 
  Download, 
  Lock, 
  ExternalLink, 
  Folder as FolderIcon,
  Search,
  Home,
  X
} from "lucide-react";
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

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTree(docs: DisplayDoc[]): TreeNode[] {
  const root: TreeNode = { name: "root", path: "", type: "folder", children: [] };

  docs.forEach((doc) => {
    let segments: string[] = [];
    if (!doc.storagePath) {
      segments = [doc.territory, doc.title];
    } else {
      const parts = doc.storagePath.split("/").filter(Boolean);
      if (parts.length > 2) {
        // e.g. ["reglamentos", "cc-foo", "subfolder?", "file.pdf"]
        // Replace the "cc-foo" slug with the properly formatted territory name
        segments = [doc.territory, ...parts.slice(2)];
      } else if (parts.length === 2) {
        // e.g. ["reglamentos", "file.pdf"] -> use territory as folder
        segments = [doc.territory, parts[1]];
      } else {
        segments = [doc.territory, doc.title];
      }
    }
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
          child.name = doc.title; 
        }
        currentNode.children.push(child);
      } else if (isFile && child.type === "file") {
        child.doc = doc;
        child.name = doc.title;
      }
      currentNode = child;
    }
  });

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

function FolderCard({ node, color, onClick }: { node: TreeNode; color: string; onClick: () => void }) {
  const bgAlpha = hexToRgba(color, 0.15);
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px -5px rgba(0, 0, 0, 0.08)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col text-left p-6 bg-white rounded-[24px] border border-[#e8dfd3] shadow-sm transition-all relative overflow-hidden group"
    >
      <div 
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-10 group-hover:scale-150 pointer-events-none" 
        style={{ backgroundColor: color }} 
      />

      <div className="flex items-start justify-between mb-6 relative z-10 w-full">
        {/* Modern Dribbble-style Folder Icon with Peeking File */}
        <div className="relative w-16 h-14 transition-transform group-hover:scale-105">
          {/* Back flap (Tab) */}
          <div 
            className="absolute top-0 left-0 w-8 h-4 rounded-tl-xl rounded-tr-md"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
          
          {/* Peeking File Inside */}
          <div className="absolute bottom-2 left-2 w-10 h-10 bg-white rounded-md shadow-sm border border-[#e8dfd3] flex flex-col items-center justify-start pt-1.5 overflow-hidden">
             <div className="w-6 h-[1px] bg-black/10 rounded-full mb-1" />
             <div className="w-4 h-[1px] bg-black/10 rounded-full mb-1" />
             <div className="w-5 h-[1px] bg-black/10 rounded-full" />
          </div>

          {/* Front flap */}
          <div 
            className="absolute bottom-0 left-0 w-full h-11 rounded-xl shadow-sm border border-black/5 backdrop-blur-sm"
            style={{ backgroundColor: color, opacity: 0.9 }}
          >
             {/* Subtle internal shine/gradient on folder front */}
             <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>
        
        <span className="text-xs font-bold text-[#7a756e] bg-[#fcfaf7] border border-[#e8dfd3] px-3 py-1.5 rounded-full shadow-sm mt-1">
          {node.children.length} {node.children.length === 1 ? 'ítem' : 'ítems'}
        </span>
      </div>
      
      <h3 className="font-bold text-[#1a1a1a] text-lg leading-tight line-clamp-2 relative z-10" title={node.name}>
        {node.name}
      </h3>
    </motion.button>
  );
}

function FileCard({ doc, role, color }: { doc: DisplayDoc; role: ViewerRole; color: string }) {
  const hasAccess = canDownloadDocument(role, doc.visibility);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!doc.usesSignedUrl) return; // Proceed with direct download native behavior
    
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Fetch signed url via API without mode=redirect so we can get JSON
      const url = doc.url.replace("?mode=redirect", "");
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to get download URL");
      }
      const data = await res.json();
      if (data.url) {
        // Create an invisible iframe/link to trigger download seamlessly without leaving page
        const link = document.createElement("a");
        link.href = data.url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      // Add slight artificial delay to make loading state visible if it resolves instantly
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col bg-white rounded-[24px] border border-[#e8dfd3] shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative corner accent */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150 pointer-events-none" 
          style={{ backgroundColor: color }} 
        />
        
        {/* Modern Mac-style File Icon */}
        <div className="relative w-10 h-[52px] mb-5 transition-transform group-hover:scale-105 z-10">
          {/* File Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5f2] to-[#e8dfd3] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden">
            {/* Horizontal lines to mock text */}
            <div className="absolute top-4 left-2 w-5 h-[1.5px] bg-black/10 rounded-full" />
            <div className="absolute top-[22px] left-2 w-4 h-[1.5px] bg-black/10 rounded-full" />
            <div className="absolute top-[28px] left-2 w-[18px] h-[1.5px] bg-black/10 rounded-full" />
            <div className="absolute top-[34px] left-2 w-3 h-[1.5px] bg-black/10 rounded-full" />
            
            {/* PDF Tag */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-[#d32f2f] text-white text-[7px] font-black px-1 py-0.5 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.1)] leading-none">
              PDF
            </div>
          </div>
          {/* Folded Corner */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-transparent via-[#fcfaf7] to-[#e8dfd3] border-b border-l border-white/40 shadow-sm rounded-bl-lg" />
        </div>
        
        <h3 className="font-bold text-[#1a1a1a] text-xl leading-tight mb-4 line-clamp-3 relative z-10" title={doc.title}>
          {doc.title}
        </h3>
        
        <div className="mt-auto relative z-10">
          <p className="text-sm font-bold text-[#4a4540] mb-1.5 line-clamp-1" title={doc.territory}>{doc.territory}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7a756e] uppercase tracking-wider">{doc.year}</span>
            <span className="text-[#d1ccc5]">•</span>
            <span className="text-xs font-bold text-[#7a756e] uppercase tracking-wider">{doc.type}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#e8dfd3] bg-[#fcfaf7]">
        {!hasAccess ? (
          <a
            href="/login?redirect=/gobierno-propio&message=internal"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm font-bold text-[#7a756e] transition hover:bg-[#f8f5f2]"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            Acceso restringido
          </a>
        ) : (
          <>
            {doc.action === "file" ? (
              <a
                href={doc.url}
                onClick={handleDownload}
                {...(doc.usesSignedUrl ? {} : { download: true })}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md ${isLoading ? 'opacity-80 cursor-not-allowed scale-[0.98]' : 'hover:-translate-y-0.5'}`}
                style={{ backgroundColor: color }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Descargar
                  </>
                )}
              </a>
            ) : null}
            {doc.sourceUrl ? (
              <a
                href={doc.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Fuente oficial
              </a>
            ) : doc.action === "external" ? (
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#f8f5f2]"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {doc.fileLabel}
              </a>
            ) : null}
          </>
        )}
      </div>
    </motion.div>
  );
}

export function DocumentTree({ docs, role, color }: { docs: DisplayDoc[]; role: ViewerRole; color: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const tree = useMemo(() => buildTree(docs), [docs]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(query) || 
      doc.territory.toLowerCase().includes(query)
    );
  }, [docs, searchQuery]);

  const currentNode = useMemo(() => {
    let node: TreeNode = { name: "root", path: "", type: "folder", children: tree };
    for (const segment of currentPath) {
      const nextNode = node.children.find(c => c.name === segment && c.type === "folder");
      if (nextNode) node = nextNode;
      else break;
    }
    return node;
  }, [tree, currentPath]);

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-[#fcfaf7] rounded-[32px] border border-[#e8dfd3] border-dashed">
        <FolderIcon className="w-16 h-16 text-[#d1ccc5] mb-6" />
        <p className="text-[#4a4540] text-lg font-medium text-center">No hay documentos internos disponibles.</p>
      </div>
    );
  }

  const handleNavigate = (segment: string) => {
    setCurrentPath([...currentPath, segment]);
  };

  const handleBreadcrumb = (idx: number) => {
    setCurrentPath(currentPath.slice(0, idx + 1));
  };

  const itemsToRender = searchResults !== null 
    ? searchResults.map(doc => ({ type: "file" as const, doc, key: doc.id }))
    : currentNode.children.map(child => ({ 
        type: child.type, 
        node: child, 
        doc: child.doc,
        key: child.path 
      }));

  return (
    <div className="flex flex-col gap-8">
      {/* Navigation & Search Head */}
      <div className="bg-white rounded-[32px] border border-[#e8dfd3] p-6 shadow-sm relative overflow-hidden">
        {/* Subtle accent glow top-right */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.03] blur-3xl pointer-events-none" 
          style={{ backgroundColor: color }} 
        />
        
        <div className="relative z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#7a756e]" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título o territorio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-12 py-4 bg-[#fcfaf7] border border-[#e8dfd3] rounded-2xl text-[#1a1a1a] placeholder-[#7a756e] focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all font-medium text-base shadow-inner"
              style={{ '--tw-ring-color': hexToRgba(color, 0.5) } as React.CSSProperties}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#7a756e] hover:text-[#1a1a1a] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Breadcrumbs */}
          {!searchResults && (
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setCurrentPath([])}
                className={`flex items-center gap-1.5 transition-colors font-medium px-3 py-1.5 rounded-lg ${currentPath.length === 0 ? 'bg-[#f4f1ec] text-[#1a1a1a]' : 'hover:bg-[#f4f1ec] text-[#7a756e] hover:text-[#1a1a1a]'}`}
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </button>
              {currentPath.map((segment, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-4 h-4 text-[#d1ccc5] shrink-0" />
                  <button 
                    onClick={() => handleBreadcrumb(idx)}
                    className={`transition-colors whitespace-nowrap font-medium px-3 py-1.5 rounded-lg ${idx === currentPath.length - 1 ? 'bg-[#f4f1ec] text-[#1a1a1a]' : 'hover:bg-[#f4f1ec] text-[#7a756e] hover:text-[#1a1a1a]'}`}
                  >
                    {segment}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {itemsToRender.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[32px] border border-[#e8dfd3] shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#f4f1ec] flex items-center justify-center mb-6 shadow-inner">
            <Search className="w-8 h-8 text-[#a39f98]" />
          </div>
          <p className="text-[#4a4540] text-lg font-bold text-center mb-2">
            {searchResults !== null ? "No se encontraron documentos" : "Esta carpeta está vacía"}
          </p>
          <p className="text-[#7a756e] text-center max-w-sm">
            {searchResults !== null 
              ? "Prueba buscar con otras palabras o limpia la búsqueda." 
              : "No hay archivos disponibles en este directorio actualmente."}
          </p>
          {searchResults !== null && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 font-bold text-sm px-6 py-3 rounded-xl bg-white border border-[#e8dfd3] shadow-sm hover:bg-[#f8f5f2] transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {itemsToRender.map(item => {
              if (item.type === "folder" && item.node) {
                return (
                  <FolderCard 
                    key={item.key} 
                    node={item.node} 
                    color={color} 
                    onClick={() => handleNavigate(item.node!.name)} 
                  />
                );
              } else if (item.type === "file" && item.doc) {
                return (
                  <FileCard 
                    key={item.key} 
                    doc={item.doc} 
                    role={role} 
                    color={color} 
                  />
                );
              }
              return null;
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
