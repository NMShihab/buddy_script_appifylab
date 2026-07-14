"use client";

import dynamic from "next/dynamic";
import FeedLayout from "@/components/feed/FeedLayout";

const ProfileContent = dynamic(
  () => import("@/components/feed/ProfileContent"),
  { ssr: false }
);

export default function ProfilePage() {
  return (
    <FeedLayout>
      <ProfileContent />
    </FeedLayout>
  );
}
