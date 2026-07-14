"use client";

import { useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const storyUsers = [
  { name: "Steve Jobs", img: "/assets/images/people1.png" },
  { name: "Ryan R.", img: "/assets/images/people2.png" },
  { name: "Dylan Field", img: "/assets/images/people3.png" },
  { name: "Steve Jobs", img: "/assets/images/people1.png" },
  { name: "Ryan R.", img: "/assets/images/people2.png" },
  { name: "Dylan Field", img: "/assets/images/people3.png" },
  { name: "Steve Jobs", img: "/assets/images/people1.png" },
  { name: "Ryan R.", img: "/assets/images/people2.png" },
];

export default function StoryBar() {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mb-4 rounded-sm bg-[var(--card-bg)] p-4 transition-all duration-200">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card-bg)] shadow-[var(--dropdown-shadow)] transition-colors hover:bg-surface-input"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card-bg)] shadow-[var(--dropdown-shadow)] transition-colors hover:bg-surface-input"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Create story */}
        <div className="flex flex-shrink-0 flex-col items-center">
          <div className="relative mb-1.5">
            <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-dashed border-primary p-[2px]">
              <Image
                src={user?.avatarUrl || "/assets/images/profile.png"}
                alt="Your story"
                width={56}
                height={56}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>
          <span className="w-[68px] truncate text-center text-[11px] text-text-muted">
            Your Story
          </span>
        </div>

        {/* Other stories */}
        {storyUsers.map((story, i) => (
          <div
            key={i}
            className="flex flex-shrink-0 cursor-pointer flex-col items-center"
          >
            <div className="mb-1.5 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
              <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-[var(--card-bg)]">
                <Image
                  src={story.img}
                  alt={story.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <span className="w-[68px] truncate text-center text-[11px] text-text-muted">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
