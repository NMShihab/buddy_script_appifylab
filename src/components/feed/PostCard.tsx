"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/timeago";
import { useAuth } from "@/context/AuthContext";
import CommentSection from "./CommentSection";

export interface LikerInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface PostData {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  recentLikers?: LikerInfo[];
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface PostCardProps {
  post: PostData;
  onLikeToggle?: (postId: string) => void;
  onPostUpdated?: (post: PostData) => void;
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({
  post,
  onLikeToggle,
  onPostUpdated,
  onPostDeleted,
}: PostCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === post.author.id;
  const authorName = `${post.author.firstName} ${post.author.lastName}`;

  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editVisibility, setEditVisibility] = useState(post.visibility);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount);
  const [localLikers, setLocalLikers] = useState<LikerInfo[]>(post.recentLikers ?? []);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalCommentsCount(post.commentsCount);
  }, [post.commentsCount]);

  useEffect(() => {
    setLocalLikers(post.recentLikers ?? []);
  }, [post.recentLikers]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent, visibility: editVisibility }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      onPostUpdated?.({ ...post, content: updated.content, visibility: updated.visibility });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) return;
      onPostDeleted?.(post.id);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="mb-4 rounded-sm bg-[var(--card-bg)] pb-6 pt-6 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-[42px] w-[42px] overflow-hidden rounded-full">
            <Image
              src={post.author.avatarUrl || "/assets/images/profile.png"}
              alt={authorName}
              width={42}
              height={42}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-heading">
              {authorName}
            </h4>
            <p className="text-xs text-text-muted">
              {timeAgo(post.createdAt)} .{" "}
              <span className="text-primary">
                {post.visibility === "PUBLIC" ? "Public" : "Private"}
              </span>
            </p>
          </div>
        </div>

        {/* 3-dot menu */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-text-gray hover:text-text-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
                <circle cx="2" cy="8" r="2" fill="currentColor" />
                <circle cx="2" cy="15" r="2" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-[180px] rounded-sm bg-[var(--card-bg)] py-2 shadow-[var(--dropdown-shadow)]">
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditContent(post.content);
                    setEditVisibility(post.visibility);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-body transition-colors hover:bg-surface-input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18">
                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                    <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                  </svg>
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-surface-input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 18 18">
                    <path stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                  </svg>
                  {deleting ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content — edit mode or display */}
      {editing ? (
        <div className="px-6 pt-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-border-input bg-[var(--input-bg)] p-3 text-sm leading-relaxed text-text-body outline-none focus:border-primary"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() =>
                setEditVisibility(editVisibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")
              }
              className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
                editVisibility === "PUBLIC"
                  ? "bg-primary-light text-primary"
                  : "bg-surface-input text-text-muted"
              }`}
            >
              {editVisibility === "PUBLIC" ? "Public" : "Private"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-sm px-4 py-1.5 text-sm text-text-muted hover:bg-surface-input"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={saving || !editContent.trim()}
                className="rounded-sm bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-3">
          <p className={`whitespace-pre-wrap text-sm leading-relaxed text-text-body ${!expanded ? "line-clamp-2" : ""}`}>
            {post.content}
          </p>
          {post.content.length > 120 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1 cursor-pointer text-sm font-medium text-primary hover:underline"
            >
              See more
            </button>
          )}
        </div>
      )}

      {/* Post image */}
      {post.imageUrl && (
        <div className="mt-3 px-6">
          <div className="overflow-hidden rounded-sm">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Reaction counts — liked-by + comments */}
      <div className="mt-4 flex items-center justify-between px-6">
        <div className="flex items-center gap-1.5">
          {post.likesCount > 0 && (
            <>
              <div className="flex items-center -space-x-1.5">
                {localLikers.slice(0, 3).map((liker) => (
                  <div
                    key={liker.id}
                    className="group relative h-[28px] w-[28px] cursor-pointer overflow-hidden rounded-full border-[1.5px] border-[var(--card-bg)] transition-transform hover:z-10 hover:scale-110"
                    title={`${liker.firstName} ${liker.lastName}`}
                  >
                    <Image
                      src={liker.avatarUrl || "/assets/images/profile.png"}
                      alt={`${liker.firstName} ${liker.lastName}`}
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-text-dark px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {liker.firstName} {liker.lastName}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted">
                {post.likesCount > 3 ? `${post.likesCount}+` : `${post.likesCount}`}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          {localCommentsCount > 0 && (
            <p>
              <span className="font-medium">{localCommentsCount}</span> Comment
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-6 mt-3 flex items-center border-b border-t border-border-input py-1">
        <button
          onClick={() => onLikeToggle?.(post.id)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded py-2 text-sm font-medium transition-colors hover:bg-surface-input ${
            post.isLiked ? "text-primary" : "text-text-body/60"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
            <path fill={post.isLiked ? "#FFCC4D" : "currentColor"} d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" opacity={post.isLiked ? "1" : "0.3"} />
            {post.isLiked && (
              <>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
              </>
            )}
          </svg>
          {post.isLiked ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded py-2 text-sm font-medium transition-colors hover:bg-surface-input ${
            showComments ? "text-primary" : "text-text-body/60"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 21">
            <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
          </svg>
          Comment
        </button>
        <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded py-2 text-sm font-medium text-text-body/60 transition-colors hover:bg-surface-input">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="none" viewBox="0 0 24 21">
            <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
          </svg>
          Share
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentCountChange={(delta) => setLocalCommentsCount((c) => c + delta)}
        />
      )}
    </div>
  );
}
