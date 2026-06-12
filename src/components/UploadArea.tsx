"use client";

import { useRef, useState } from "react";

interface UploadAreaProps {
  onSubmit: (text: string, images: File[]) => Promise<void>;
  busy: boolean;
  cta?: string;
  placeholder?: string;
}

export default function UploadArea({
  onSubmit,
  busy,
  cta = "Анализировать",
  placeholder = "Вставьте сюда тексты, переписки, сообщения…",
}: UploadAreaProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  async function handleTxtFile(file: File) {
    const txt = await file.text();
    setText((prev) => (prev ? prev + "\n\n" + txt : txt));
  }

  async function handleSubmit() {
    if (busy) return;
    if (!text.trim() && images.length === 0) return;
    await onSubmit(text, images);
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={8}
        disabled={busy}
        className="w-full resize-y rounded-xl bg-surface p-4 text-base leading-relaxed text-[#f3ede4] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm"
            >
              <span className="max-w-[140px] truncate text-muted">
                {img.name}
              </span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                disabled={busy}
                className="text-muted hover:text-accent disabled:opacity-50"
                aria-label="Удалить"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt"
          multiple
          hidden
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            const txtFiles = Array.from(files).filter((f) =>
              f.name.endsWith(".txt"),
            );
            const imgFiles = Array.from(files).filter((f) =>
              f.type.startsWith("image/"),
            );
            txtFiles.forEach(handleTxtFile);
            if (imgFiles.length > 0) {
              const merged = [...images, ...imgFiles].slice(0, 8);
              setImages(merged);
            }
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            const merged = [...images, ...Array.from(files)].slice(0, 8);
            setImages(merged);
            if (cameraInputRef.current) cameraInputRef.current.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className="flex-1 rounded-xl border border-muted/40 bg-transparent px-4 py-3 text-sm text-[#f3ede4] hover:border-accent disabled:opacity-50"
        >
          📎 Файл (.txt / фото)
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={busy}
          className="flex-1 rounded-xl border border-muted/40 bg-transparent px-4 py-3 text-sm text-[#f3ede4] hover:border-accent disabled:opacity-50 sm:hidden"
        >
          📷 Снять переписку
        </button>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy || (!text.trim() && images.length === 0)}
        className="rounded-xl bg-accent px-4 py-4 text-base font-medium text-background hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Анализирую…" : cta}
      </button>
    </div>
  );
}
