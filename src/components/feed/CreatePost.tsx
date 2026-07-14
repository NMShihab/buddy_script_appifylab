"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setImagePreview(null);
      setImageUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setPosting(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrl, visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setContent("");
      removeImage();
      setVisibility("PUBLIC");
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mb-4 rounded-sm bg-[var(--card-bg)] p-6 transition-all duration-200">
      {/* Textarea row */}
      <div className="mb-4 flex gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={user?.avatarUrl || "/assets/images/profile.png"}
            alt="You"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something ..."
            rows={3}
            className="w-full rounded-sm border-none bg-transparent text-sm leading-relaxed text-text-body outline-none placeholder:text-text-muted dark:text-white dark:placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative mb-4 overflow-hidden rounded-sm">
          <Image
            src={imagePreview}
            alt="Preview"
            width={500}
            height={300}
            className="h-auto max-h-[300px] w-full object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-sm text-white">Uploading...</span>
            </div>
          )}
          <button
            onClick={removeImage}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            &times;
          </button>
        </div>
      )}

      {error && (
        <p className="mb-3 text-sm text-red-500">{error}</p>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-border-input pt-4 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-1">
          {/* Photo */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
              <path fill="currentColor" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
            </svg>
            Photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Video */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726z" />
            </svg>
            Video
          </button>

          {/* Event */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698z" />
            </svg>
            Event
          </button>

          {/* Article (hidden on small screens) */}
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary sm:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="none" viewBox="0 0 18 20">
              <path fill="currentColor" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056z" />
            </svg>
            Article
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Visibility toggle */}
          <button
            type="button"
            onClick={() => setVisibility(visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")}
            className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
              visibility === "PUBLIC"
                ? "bg-primary-light text-primary dark:bg-primary/20"
                : "bg-surface-input text-text-muted dark:bg-dark-secondary dark:text-white/60"
            }`}
          >
            {visibility === "PUBLIC" ? "Public" : "Private"}
          </button>

          {/* Post button */}
          <button
            onClick={handleSubmit}
            disabled={posting || uploading || (!content.trim() && !imageUrl)}
            className="rounded-sm bg-primary px-6 py-2 text-sm font-medium text-white transition-shadow hover:shadow-hover disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
