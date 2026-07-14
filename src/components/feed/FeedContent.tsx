"use client";

import { useState, useCallback, useEffect } from "react";
import FeedLayout from "./FeedLayout";
import CreatePost from "./CreatePost";
import PostCard, { PostData } from "./PostCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function FeedContent() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (cursor?: string | null) => {
      if (loading) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (cursor) params.set("cursor", cursor);
        params.set("limit", "20");

        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) return;

        const data = await res.json();
        setPosts((prev) =>
          cursor ? [...prev, ...data.posts] : data.posts
        );
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (nextCursor && !loading) {
      fetchPosts(nextCursor);
    }
  }, [nextCursor, loading, fetchPosts]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  const handlePostCreated = () => {
    setPosts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchPosts();
  };

  const handleLikeToggle = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: data.liked, likesCount: data.likesCount }
            : p
        )
      );
    } catch {
      // silent fail for like toggle
    }
  };

  return (
    <FeedLayout>
      <CreatePost onPostCreated={handlePostCreated} />

      {initialLoad ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-sm bg-[var(--card-bg)] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-input dark:bg-dark-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-surface-input dark:bg-dark-secondary" />
                  <div className="h-2 w-16 rounded bg-surface-input dark:bg-dark-secondary" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-surface-input dark:bg-dark-secondary" />
                <div className="h-3 w-3/4 rounded bg-surface-input dark:bg-dark-secondary" />
              </div>
              <div className="mt-4 h-48 rounded bg-surface-input dark:bg-dark-secondary" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-sm bg-[var(--card-bg)] p-12 text-center transition-all duration-200">
          <p className="text-sm text-text-muted dark:text-white/60">
            No posts yet. Be the first to share something!
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeToggle={handleLikeToggle}
            />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {loading && !initialLoad && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </>
      )}
    </FeedLayout>
  );
}
