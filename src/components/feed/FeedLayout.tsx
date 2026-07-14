"use client";

import Navbar from "./Navbar";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface FeedLayoutProps {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Desktop navbar */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* Mobile header */}
      <MobileHeader />

      {/* Main 3-column layout */}
      <div className="mx-auto max-w-[1320px] px-3">
        <div className="relative overflow-hidden pt-[70px] max-lg:pt-[52px]">
          <div className="flex">
            {/* Left sidebar — 3/12 on lg+ */}
            <div className="hidden w-3/12 lg:block">
              <LeftSidebar />
            </div>

            {/* Middle content — 6/12 on lg+, full on mobile */}
            <div className="w-full lg:w-6/12">
              <div
                className="flex flex-1 flex-col overflow-auto px-0 pt-2.5 max-lg:pb-20 lg:px-2"
                style={{ height: "calc(100vh - 70px)" }}
              >
                {children}
              </div>
            </div>

            {/* Right sidebar — 3/12 on lg+ */}
            <div className="hidden w-3/12 lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
