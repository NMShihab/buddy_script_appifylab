"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import CommentItem, { CommentData } from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  onCommentCountChange?: (delta: number) => void;
}

export default function CommentSection({ postId, onCommentCountChange }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async (cursor?: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      params.set("limit", "10");

      const res = await fetch(`/api/posts/${postId}/comments?${params}`);
      if (!res.ok) return;
      const data = await res.json();

      setComments((prev) => cursor ? [...prev, ...data.comments] : data.comments);
      setNextCursor(data.nextCursor);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (!res.ok) return;
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setContent("");
      onCommentCountChange?.(1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}/like`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, isLiked: data.liked, likesCount: data.likesCount } : c
        )
      );
    } catch {
      // silent
    }
  };

  return (
    <div className="px-6 pt-3">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-2.5">
        <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-full">
          <Image
            src={user?.avatarUrl || "/assets/images/profile.png"}
            alt="Your avatar"
            width={34}
            height={34}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border-input bg-[var(--input-bg)] px-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 bg-transparent py-2 text-[13px] text-text-body outline-none placeholder:text-text-muted/60"
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="text-primary disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loaded && comments.length > 0 && (
        <div className="mt-3 space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onLike={handleLike}
              onCommentCountChange={onCommentCountChange}
            />
          ))}

          {nextCursor && (
            <button
              onClick={() => fetchComments(nextCursor)}
              disabled={loading}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              {loading ? "Loading..." : "View more comments"}
            </button>
          )}
        </div>
      )}

      {loading && !loaded && (
        <div className="mt-3 flex justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
