"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface ImageItem {
  preview: string;
  url: string | null;
  uploading: boolean;
}

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.url;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");

    const newImages: ImageItem[] = files.map((f) => ({
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
    }));

    const startIdx = images.length;
    setImages((prev) => [...prev, ...newImages]);

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadFile(files[i]);
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === startIdx + i ? { ...img, url, uploading: false } : img
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setImages((prev) => prev.filter((_, idx) => idx !== startIdx + i));
      }
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = images.some((img) => img.uploading);
  const uploadedUrls = images.filter((img) => img.url).map((img) => img.url!);

  const handleSubmit = async () => {
    if (!content.trim() && uploadedUrls.length === 0) return;
    setPosting(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrls: uploadedUrls, visibility }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setContent("");
      setImages([]);
      setVisibility("PUBLIC");
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mb-4 rounded-[6px] bg-[var(--card-bg)] p-6 transition-all duration-200">
      {/* Textarea row */}
      <div className="mb-4 flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={user?.avatarUrl || "/assets/images/profile.png"}
            alt="You"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder=" "
            rows={3}
            className="peer w-full rounded-[6px] border border-border-input bg-transparent px-3 pb-2 pt-6 text-sm leading-relaxed text-text-body outline-none transition-colors focus:border-primary"
          />
          <label className="pointer-events-none absolute left-3 top-2 flex items-center gap-1.5 text-sm text-text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 23 24">
              <path fill="currentColor" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" />
            </svg>
          </label>
        </div>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-[6px]">
              <Image
                src={img.preview}
                alt={`Preview ${i + 1}`}
                width={200}
                height={150}
                className="h-[120px] w-full object-cover"
              />
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              <button
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs text-white hover:bg-black/70"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-3 text-sm text-red-500">{error}</p>
      )}

      {/* Action bar — Desktop */}
      <div className="hidden items-center justify-between border-t border-border-input pt-4 sm:flex">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input"
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
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          <button
            type="button"
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726z" />
            </svg>
            Video
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698z" />
            </svg>
            Event
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="none" viewBox="0 0 18 20">
              <path fill="currentColor" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056z" />
            </svg>
            Article
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVisibility(visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              visibility === "PUBLIC"
                ? "bg-primary-light text-primary"
                : "bg-surface-input text-text-muted"
            }`}
          >
            {visibility === "PUBLIC" ? "Public" : "Private"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={posting || isUploading || (!content.trim() && uploadedUrls.length === 0)}
            className="flex items-center gap-1.5 rounded-[6px] bg-primary px-5 py-2 text-sm font-medium text-white transition-shadow hover:shadow-hover disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
              <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
            </svg>
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Action bar — Mobile */}
      <div className="flex items-center justify-between border-t border-border-input pt-4 sm:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center rounded p-2 text-text-muted transition-colors hover:bg-surface-input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 20 20">
              <path fill="currentColor" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
            </svg>
          </button>
          <button type="button" className="flex items-center justify-center rounded p-2 text-text-muted transition-colors hover:bg-surface-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726z" />
            </svg>
          </button>
          <button type="button" className="flex items-center justify-center rounded p-2 text-text-muted transition-colors hover:bg-surface-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698z" />
            </svg>
          </button>
          <button type="button" className="flex items-center justify-center rounded p-2 text-text-muted transition-colors hover:bg-surface-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill="none" viewBox="0 0 18 20">
              <path fill="currentColor" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={posting || isUploading || (!content.trim() && uploadedUrls.length === 0)}
          className="flex items-center gap-1.5 rounded-[6px] bg-primary px-5 py-2 text-sm font-medium text-white transition-shadow hover:shadow-hover disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
            <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
          </svg>
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
