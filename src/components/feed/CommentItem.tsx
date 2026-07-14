"use client";

import { useState } from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/timeago";
import { useAuth } from "@/context/AuthContext";

export interface CommentData {
  id: string;
  content: string;
  likesCount: number;
  isLiked: boolean;
  replyCount: number;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface CommentItemProps {
  comment: CommentData;
  postId: string;
  isReply?: boolean;
  onLike?: (commentId: string) => void;
  onCommentCountChange?: (delta: number) => void;
}

export default function CommentItem({
  comment,
  postId,
  isReply = false,
  onLike,
  onCommentCountChange,
}: CommentItemProps) {
  const { user } = useAuth();
  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;

  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesCursor, setRepliesCursor] = useState<string | null>(null);
  const [localReplyCount, setLocalReplyCount] = useState(comment.replyCount);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchReplies = async (cursor?: string | null) => {
    setLoadingReplies(true);
    try {
      const params = new URLSearchParams();
      params.set("parentId", comment.id);
      if (cursor) params.set("cursor", cursor);
      params.set("limit", "5");

      const res = await fetch(`/api/posts/${postId}/comments?${params}`);
      if (!res.ok) return;
      const data = await res.json();

      setReplies((prev) => (cursor ? [...prev, ...data.comments] : data.comments));
      setRepliesCursor(data.nextCursor);
    } finally {
      setLoadingReplies(false);
      setRepliesLoaded(true);
    }
  };

  const handleToggleReplies = () => {
    if (!showReplies && !repliesLoaded) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent.trim(), parentId: comment.id }),
      });
      if (!res.ok) return;
      const newReply = await res.json();
      setReplies((prev) => [...prev, newReply]);
      setLocalReplyCount((c) => c + 1);
      setReplyContent("");
      setShowReplyInput(false);
      setShowReplies(true);
      setRepliesLoaded(true);
      onCommentCountChange?.(1);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${replyId}/like`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json();
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId ? { ...r, isLiked: data.liked, likesCount: data.likesCount } : r
        )
      );
    } catch {
      // silent
    }
  };

  return (
    <div>
      <div className="flex gap-2.5">
        <div className={`${isReply ? "h-[28px] w-[28px]" : "h-[34px] w-[34px]"} shrink-0 overflow-hidden rounded-full`}>
          <Image
            src={comment.author.avatarUrl || "/assets/images/profile.png"}
            alt={authorName}
            width={34}
            height={34}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="rounded-lg bg-surface-input/50 px-3 py-2 dark:bg-dark-secondary/50">
            <h4 className="text-[13px] font-semibold text-text-heading dark:text-white">
              {authorName}
            </h4>
            <p className="mt-0.5 text-[13px] leading-relaxed text-text-body dark:text-white/80">
              {comment.content}
            </p>
          </div>

          {comment.likesCount > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="text-xs text-text-muted dark:text-white/50">{comment.likesCount}</span>
            </div>
          )}

          <div className="mt-1 flex items-center gap-1">
            <button
              onClick={() => onLike?.(comment.id)}
              className={`text-xs font-medium transition-colors hover:text-primary ${
                comment.isLiked ? "text-primary" : "text-text-muted dark:text-white/50"
              }`}
            >
              Like
            </button>
            <span className="text-xs text-text-muted dark:text-white/50">.</span>
            {!isReply && (
              <>
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs font-medium text-text-muted transition-colors hover:text-primary dark:text-white/50"
                >
                  Reply
                </button>
                <span className="text-xs text-text-muted dark:text-white/50">.</span>
              </>
            )}
            <span className="text-xs text-text-muted dark:text-white/50">Share</span>
            <span className="text-xs text-text-muted dark:text-white/40">
              .{timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* View replies toggle */}
          {!isReply && localReplyCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="mt-1.5 text-xs font-medium text-primary hover:underline"
            >
              {showReplies
                ? "Hide replies"
                : `View ${localReplyCount} ${localReplyCount === 1 ? "reply" : "replies"}`}
            </button>
          )}

          {/* Reply input */}
          {showReplyInput && !isReply && (
            <form onSubmit={handleReplySubmit} className="mt-2 flex items-center gap-2">
              <div className="h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src={user?.avatarUrl || "/assets/images/profile.png"}
                  alt="Your avatar"
                  width={26}
                  height={26}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-full border border-border-input bg-[var(--input-bg)] px-3 dark:border-white/10">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.firstName}...`}
                  className="flex-1 bg-transparent py-1.5 text-[12px] text-text-body outline-none placeholder:text-text-muted/60 dark:text-white dark:placeholder:text-white/40"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim() || submittingReply}
                  className="text-primary disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Replies list */}
          {showReplies && (
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-border-input/50 dark:border-white/10">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isReply
                  onLike={handleReplyLike}
                />
              ))}

              {loadingReplies && (
                <div className="flex py-1">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {repliesCursor && !loadingReplies && (
                <button
                  onClick={() => fetchReplies(repliesCursor)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
