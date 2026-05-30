"use client";

import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write description notes, headers, lists, code samples here...",
  readOnly = false,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // We keep a ref of the current value to compare and prevent cursor jumps
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || quillRef.current) return;

    let active = true;

    // Create a dynamic, browser-only instantiation of Quill
    import("quill").then((QuillModule) => {
      if (!active) return;

      const Quill = QuillModule.default;

      const container = containerRef.current;
      if (container) {
        // Clear any double-renders from Strict Mode hot-reload races
        container.innerHTML = "";
      }

      // Create editor wrapper div to append inside the main ref container
      const editorDiv = document.createElement("div");
      container?.appendChild(editorDiv);

      const q = new Quill(editorDiv, {
        theme: "snow",
        placeholder,
        readOnly,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });

      quillRef.current = q;
      setEditorLoaded(true);

      // Pre-fill content safely
      if (valueRef.current) {
        q.root.innerHTML = valueRef.current;
      }

      // Hook up on change callback
      q.on("text-change", () => {
        const html = q.root.innerHTML;
        // Quill sets empty value to "<p><br></p>", handle it cleanly
        const cleanHtml = html === "<p><br></p>" ? "" : html;
        
        if (cleanHtml !== valueRef.current) {
          onChange(cleanHtml);
        }
      });
    });

    const container = containerRef.current;

    // Cleanup editor and elements on unmount
    return () => {
      active = false;
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [placeholder, readOnly, onChange]);

  // Synchronize outside state updates safely without shifting the user's cursor
  useEffect(() => {
    if (!quillRef.current || !editorLoaded) return;

    const editorHtml = quillRef.current.root.innerHTML;
    const cleanEditorHtml = editorHtml === "<p><br></p>" ? "" : editorHtml;

    if (value !== cleanEditorHtml) {
      // Save current selection index to restore later
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value || "";
      
      if (selection) {
        // Set timeout to restore position in queue
        setTimeout(() => {
          try {
            quillRef.current?.setSelection(selection.index, selection.length);
          } catch (e) {
            console.warn("Failed to restore cursor position:", e);
          }
        }, 0);
      }
    }
  }, [value, editorLoaded]);

  // Adapt readOnly updates on the fly
  useEffect(() => {
    if (quillRef.current && editorLoaded) {
      if (readOnly) {
        quillRef.current.disable();
      } else {
        quillRef.current.enable();
      }
    }
  }, [readOnly, editorLoaded]);

  return (
    <div className="rich-text-editor-container w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div 
        ref={containerRef} 
        className="min-h-[220px] max-h-[400px] overflow-y-auto text-sm text-gray-950 dark:text-white bg-transparent focus:outline-none prose dark:prose-invert max-w-none" 
      />
    </div>
  );
}
