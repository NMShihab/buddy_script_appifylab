"use client";

import Image from "next/image";
import { timeAgo } from "@/lib/timeago";
import { useAuth } from "@/context/AuthContext";

export interface PostData {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
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
}

export default function PostCard({ post, onLikeToggle }: PostCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === post.author.id;
  const authorName = `${post.author.firstName} ${post.author.lastName}`;

  return (
    <div className="mb-4 rounded-sm bg-[var(--card-bg)] pb-6 pt-6 transition-all duration-200">
      {/* Header: avatar, name, time, visibility, menu */}
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
            <h4 className="text-sm font-medium text-text-heading dark:text-white">
              {authorName}
            </h4>
            <p className="text-xs text-text-muted dark:text-white/50">
              {timeAgo(post.createdAt)} .{" "}
              <span className="text-primary">
                {post.visibility === "PUBLIC" ? "Public" : "Private"}
              </span>
            </p>
          </div>
        </div>
        {isOwner && (
          <button className="p-1 text-text-gray hover:text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
              <circle cx="2" cy="2" r="2" fill="currentColor" />
              <circle cx="2" cy="8" r="2" fill="currentColor" />
              <circle cx="2" cy="15" r="2" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pt-3">
        <p className="text-sm leading-relaxed text-text-body dark:text-white/90 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

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

      {/* Reaction counts */}
      <div className="mt-4 flex items-center justify-between px-6">
        <div className="flex items-center gap-1">
          {post.likesCount > 0 && (
            <>
              <span className="flex items-center text-xs text-text-muted dark:text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-primary"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                {post.likesCount}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted dark:text-white/50">
          {post.commentsCount > 0 && (
            <span>{post.commentsCount} Comment{post.commentsCount > 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      {/* Action buttons: Like, Comment, Share */}
      <div className="mx-6 mt-3 flex items-center border-t border-b border-border-input py-1 dark:border-white/10">
        <button
          onClick={() => onLikeToggle?.(post.id)}
          className={`flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-medium transition-colors hover:bg-surface-input dark:hover:bg-dark-secondary ${
            post.isLiked
              ? "text-primary"
              : "text-text-body/60 dark:text-white/60"
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
        <button className="flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-medium text-text-body/60 transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 21">
            <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
          </svg>
          Comment
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded py-2 text-sm font-medium text-text-body/60 transition-colors hover:bg-surface-input dark:text-white/60 dark:hover:bg-dark-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="none" viewBox="0 0 24 21">
            <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
