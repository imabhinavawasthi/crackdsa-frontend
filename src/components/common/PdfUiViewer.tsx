"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  BookOpen, 
  Loader2, 
  ChevronDown, 
  ArrowUp, 
  Check, 
  Sparkles,
  Layers
} from "lucide-react";

interface PdfUiViewerProps {
  url: string;
  title: string;
}

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

// Sub-component for individual lazy-rendered page
function DocumentPage({
  pdfDoc,
  pageNumber,
  containerWidth,
}: {
  pdfDoc: any;
  pageNumber: number;
  containerWidth: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1.414); // Default A4
  const renderTaskRef = useRef<any>(null);

  // Measure initial aspect ratio once
  useEffect(() => {
    let active = true;
    if (!pdfDoc) return;

    pdfDoc.getPage(pageNumber).then((page: any) => {
      if (!active) return;
      const vp = page.getViewport({ scale: 1 });
      setAspectRatio(vp.height / vp.width);
    });

    return () => {
      active = false;
    };
  }, [pdfDoc, pageNumber]);

  // Lazy render using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || !pdfDoc || isRendered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          renderPage();
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px 0px", // Preload when 300px near viewport
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [pdfDoc, pageNumber, containerWidth, isRendered]);

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }

      const page = await pdfDoc.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const initialVp = page.getViewport({ scale: 1 });
      const currentWidth = containerWidth > 0 ? containerWidth : 800;
      const scaleFactor = currentWidth / initialVp.width;
      const pixelRatio = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      const viewport = page.getViewport({ scale: scaleFactor * pixelRatio });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      setIsRendered(true);
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") {
        console.error(`Page ${pageNumber} render error:`, err);
      }
    }
  };

  // Re-render when container width changes (e.g. window resize)
  useEffect(() => {
    if (isRendered) {
      renderPage();
    }
  }, [containerWidth]);

  return (
    <div
      ref={containerRef}
      id={`note-page-${pageNumber}`}
      className="relative w-full rounded-2xl overflow-hidden bg-white shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200/90 dark:border-gray-800 transition-all"
      style={{
        minHeight: containerWidth > 0 ? `${containerWidth * aspectRatio}px` : "600px",
      }}
    >
      {/* Top discreet page badge */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-gray-900/70 text-white text-[10px] font-bold tracking-wider backdrop-blur-xs select-none">
        Page {pageNumber}
      </div>

      {/* Placeholder skeleton before rendering */}
      {!isRendered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 animate-pulse">
          <Loader2 size={24} className="animate-spin text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-gray-400">Loading page {pageNumber}...</span>
        </div>
      )}

      {/* Rendered Canvas (Looks like native high-res document page) */}
      <canvas
        ref={canvasRef}
        className={`w-full block ${isRendered ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      />
    </div>
  );
}

export default function PdfUiViewer({ url, title }: PdfUiViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(850);
  const [selectedJumpPage, setSelectedJumpPage] = useState<number>(1);

  const streamRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to track container width for perfect responsive scaling
  useEffect(() => {
    if (!streamRef.current) return;

    const updateWidth = () => {
      if (streamRef.current) {
        setContainerWidth(streamRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(streamRef.current);

    return () => observer.disconnect();
  }, []);

  // Load PDF.js from CDN and fetch document
  useEffect(() => {
    let isMounted = true;

    const loadPdf = () => {
      if (window.pdfjsLib) {
        initPdf(window.pdfjsLib);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (!isMounted) return;
        const pdfjs = window.pdfjsLib;
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          initPdf(pdfjs);
        }
      };
      script.onerror = () => {
        if (isMounted) {
          setError("Failed to load document engine.");
          setIsLoading(false);
        }
      };
      document.body.appendChild(script);
    };

    const initPdf = async (pdfjs: any) => {
      try {
        setIsLoading(true);
        setError(null);
        const loadingTask = pdfjs.getDocument({
          url,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });
        const doc = await loadingTask.promise;
        if (!isMounted) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("PDF load error:", err);
        setError(err.message || "Failed to load document.");
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [url]);

  const scrollToPage = (pageNum: number) => {
    setSelectedJumpPage(pageNum);
    const element = document.getElementById(`note-page-${pageNum}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={streamRef} className="w-full space-y-6">
      {/* ─── STREAM HEADER & QUICK JUMP BAR ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BookOpen size={16} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
              {title} Notes
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              {numPages > 0 ? `${numPages} Comprehensive Pages` : "Loading pages..."} • Scroll to read
            </p>
          </div>
        </div>

        {/* Quick Page Jump Selector */}
        {numPages > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Jump to:
            </span>
            <select
              value={selectedJumpPage}
              onChange={(e) => scrollToPage(Number(e.target.value))}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-1.5 px-3 text-xs font-bold text-gray-900 dark:text-white focus:border-brand-500 focus:outline-hidden cursor-pointer"
            >
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Page {p} of {numPages}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ─── LOADING STATE ──────────────────────────────────────────── */}
      {isLoading && (
        <div className="rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 size={32} className="animate-spin text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Formatting & Rendering Notes for Web...
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
            Optimizing high-resolution graphics directly into the webpage flow.
          </p>
        </div>
      )}

      {/* ─── ERROR STATE ────────────────────────────────────────────── */}
      {error && (
        <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-center space-y-2">
          <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ─── SEAMLESS VERTICAL STREAM OF NOTE PAGES ─────────────────── */}
      {!isLoading && !error && numPages > 0 && (
        <div className="space-y-6">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <DocumentPage
              key={pageNum}
              pdfDoc={pdfDoc}
              pageNumber={pageNum}
              containerWidth={containerWidth}
            />
          ))}

          {/* End of Notes Banner */}
          <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check size={20} className="stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              You&apos;ve reached the end of {title} Notes!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ready to test your understanding? Review the core syllabus questions below or explore another CS fundamental subject.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowUp size={13} />
                <span>Scroll to Top</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
