"use client";

import dynamic from "next/dynamic";

const FeedContent = dynamic(() => import("@/components/feed/FeedContent"), {
  ssr: false,
});

export default function FeedPage() {
  return <FeedContent />;
}
