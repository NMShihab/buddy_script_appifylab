"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const currentAvatar =
    avatarPreview || user?.avatarUrl || "/assets/images/profile.png";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Upload failed");
        }
        const uploadData = await uploadRes.json();
        avatarUrl = uploadData.url;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...(avatarUrl !== undefined && { avatarUrl }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      await refreshUser();
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-[600px] pt-6">
      <div className="rounded-sm bg-[var(--card-bg)] p-6">
        <h2 className="mb-6 text-xl font-semibold text-text-heading">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="h-[100px] w-[100px] overflow-hidden rounded-full">
                <Image
                  src={currentAvatar}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-text-muted">
              Click the camera icon to change photo
            </p>
          </div>

          {/* First Name */}
          <div className="mb-3.5">
            <label className="mb-2 block text-base font-medium leading-[1.4] text-text-label">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-12 w-full rounded-sm border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-sm leading-[1.4] text-text-body placeholder:text-[13px] placeholder:font-normal placeholder:leading-[1.4] placeholder:text-text-muted focus:border-[var(--input-focus-border)] focus:shadow-none focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="mb-3.5">
            <label className="mb-2 block text-base font-medium leading-[1.4] text-text-label">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-12 w-full rounded-sm border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-sm leading-[1.4] text-text-body placeholder:text-[13px] placeholder:font-normal placeholder:leading-[1.4] placeholder:text-text-muted focus:border-[var(--input-focus-border)] focus:shadow-none focus:outline-none"
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="mb-2 block text-base font-medium leading-[1.4] text-text-label">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="h-12 w-full rounded-sm border border-[var(--input-border)] bg-surface-input px-4 text-sm leading-[1.4] text-text-muted"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 rounded-sm bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-sm bg-green-50 p-3 text-center text-sm text-green-600">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="h-12 w-full rounded-sm bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
