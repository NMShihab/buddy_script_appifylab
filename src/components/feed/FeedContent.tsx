"use client";

import FeedLayout from "./FeedLayout";

export default function FeedContent() {
  return (
    <FeedLayout>
      <div className="rounded-sm bg-[var(--card-bg)] p-6 transition-all duration-200">
        <p className="text-center text-sm text-text-muted dark:text-white/60">
          Feed posts will appear here — coming in Step 9 &amp; 10
        </p>
      </div>
    </FeedLayout>
  );
}
